import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { ResultScreen } from './components/ResultScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PitchGuideModal } from './components/PitchGuideModal';
import { ScanRecord, UserSettings, SampleDoc, ScanStatus } from './types';
import {
  getAllScanRecords,
  saveScanRecord,
  deleteScanRecord,
  clearAllScanRecords,
  getStoredSettings,
  saveStoredSettings,
} from './lib/storage';
import { compressImageToMax800, runClientOcr } from './lib/ocr';
import { requestDocumentSimplification } from './lib/api';
import { useOnlineStatus } from './hooks/useOnlineStatus';

type AppScreen = 'home' | 'processing' | 'result' | 'history' | 'settings';

export default function App() {
  const isOnline = useOnlineStatus();
  const [screen, setScreen] = useState<AppScreen>('home');
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [currentScan, setCurrentScan] = useState<ScanRecord | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrMessage, setOcrMessage] = useState('Initializing on-device OCR...');
  const [isPitchGuideOpen, setIsPitchGuideOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    language: 'en',
    largeText: false,
  });

  // Load stored settings and history from IndexedDB on startup
  useEffect(() => {
    async function initStorage() {
      try {
        const storedSettings = await getStoredSettings();
        setSettings(storedSettings);

        const storedScans = await getAllScanRecords();
        setScans(storedScans);
      } catch (err) {
        console.error('Initialization error with IndexedDB:', err);
      }
    }
    initStorage();
  }, []);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveStoredSettings(updated);
  };

  // Capture workflow from camera or file upload
  const handleCaptureFile = async (file: File) => {
    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Step 0: Compress image to max 800px wide
    let compressedDataUrl = '';
    try {
      compressedDataUrl = await compressImageToMax800(file);
    } catch (err) {
      console.warn('Compression error, using raw file URL:', err);
      compressedDataUrl = URL.createObjectURL(file);
    }

    const initialRecord: ScanRecord = {
      id: scanId,
      timestamp: Date.now(),
      imageDataUrl: compressedDataUrl,
      ocrText: '',
      language: settings.language,
      result: null,
      status: 'captured',
    };

    setCurrentScan(initialRecord);
    setScreen('processing');
    setOcrProgress(0.05);
    setOcrMessage('Preparing document...');

    // Step 1: Run On-Device OCR with Tesseract.js
    let ocrText = '';
    try {
      const ocrResult = await runClientOcr(compressedDataUrl, (p) => {
        setOcrProgress(p.progress);
        setOcrMessage(p.message);
      });
      ocrText = ocrResult.text.trim();
    } catch (ocrErr: any) {
      const failedRecord: ScanRecord = {
        ...initialRecord,
        status: 'error',
        errorMessage: ocrErr?.message || 'Failed to read document image.',
      };
      setCurrentScan(failedRecord);
      await saveScanRecord(failedRecord);
      return;
    }

    // Step 2: Enforce specification rule:
    // "If OCR produces under 20 characters of text, show an inline error state:
    // 'Couldn't read this clearly — try better lighting or a flatter angle'
    // with a retake button, and do not call the API."
    if (ocrText.length < 20) {
      const errorRecord: ScanRecord = {
        ...initialRecord,
        ocrText,
        status: 'error',
        errorMessage: "Couldn't read this clearly — try better lighting or a flatter angle.",
      };
      setCurrentScan(errorRecord);
      await saveScanRecord(errorRecord);
      return;
    }

    // Step 3: OCR succeeded with sufficient characters! Update status to 'simplifying'
    const ocrDoneRecord: ScanRecord = {
      ...initialRecord,
      ocrText,
      status: 'simplifying',
    };
    setCurrentScan(ocrDoneRecord);
    await saveScanRecord(ocrDoneRecord);

    // Step 4: Call Simplifier API
    try {
      const response = await requestDocumentSimplification(
        ocrText,
        settings.language
      );
      const simplifiedResult = response.result;

      const completedRecord: ScanRecord = {
        ...ocrDoneRecord,
        status: 'done',
        result: simplifiedResult,
        title: simplifiedResult.tldr.slice(0, 50),
      };

      setCurrentScan(completedRecord);
      await saveScanRecord(completedRecord);

      // Update in-memory scan history list
      setScans((prev) => [completedRecord, ...prev.filter((s) => s.id !== completedRecord.id)]);
      setScreen('result');
    } catch (apiErr: any) {
      console.error('Simplification error:', apiErr);
      const apiErrorRecord: ScanRecord = {
        ...ocrDoneRecord,
        status: 'error',
        errorMessage: apiErr?.message || 'Failed to simplify document. Please try again.',
      };
      setCurrentScan(apiErrorRecord);
      await saveScanRecord(apiErrorRecord);
    }
  };

  // 1-Click sample selection for instant hackathon judge demonstration
  const handleSelectSample = async (sample: SampleDoc) => {
    const isHindi = settings.language === 'hi';
    const sampleResult = isHindi ? sample.sampleResultHi : sample.sampleResultEn;

    const sampleScan: ScanRecord = {
      id: `sample_${sample.id}_${Date.now()}`,
      timestamp: Date.now(),
      imageDataUrl: sample.imageDataUrl,
      ocrText: sample.ocrText,
      language: settings.language,
      result: sampleResult,
      status: 'done',
      title: sample.title,
    };

    setCurrentScan(sampleScan);
    await saveScanRecord(sampleScan);
    setScans((prev) => [sampleScan, ...prev.filter((s) => s.id !== sampleScan.id)]);
    setScreen('result');
  };

  const handleOpenScan = (scan: ScanRecord) => {
    setCurrentScan(scan);
    if (scan.status === 'done' && scan.result) {
      setScreen('result');
    } else {
      setScreen('processing');
    }
  };

  const handleDeleteScan = async (id: string) => {
    await deleteScanRecord(id);
    setScans((prev) => prev.filter((s) => s.id !== id));
    if (currentScan?.id === id) {
      setCurrentScan(null);
      setScreen('home');
    }
  };

  const handleClearAllHistory = async () => {
    await clearAllScanRecords();
    setScans([]);
    setCurrentScan(null);
    setScreen('home');
  };

  return (
    <div
      className="min-h-screen bg-[#FAF7F2] text-[#312E81] antialiased relative overflow-x-hidden"
    >
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation Bar */}
        <Navbar
          currentScreen={screen === 'processing' || screen === 'result' ? 'home' : screen}
          onNavigate={(s) => setScreen(s)}
          isOnline={isOnline}
          historyCount={scans.length}
          onOpenPitchGuide={() => setIsPitchGuideOpen(true)}
        />

        {/* Main Screen Content with spacing for sticky bottom bar */}
        <main className="flex-1 pb-28">
          {screen === 'home' && (
            <HomeScreen
              recentScans={scans}
              onCaptureFile={handleCaptureFile}
              onSelectSample={handleSelectSample}
              onOpenScan={handleOpenScan}
              onNavigateHistory={() => setScreen('history')}
              language={settings.language}
            />
          )}

          {screen === 'processing' && currentScan && (
            <ProcessingScreen
              status={currentScan.status}
              ocrProgress={ocrProgress}
              ocrMessage={ocrMessage}
              ocrText={currentScan.ocrText}
              thumbnailUrl={currentScan.imageDataUrl}
              errorMessage={currentScan.errorMessage}
              onRetake={() => {
                setCurrentScan(null);
                setScreen('home');
              }}
              onCancel={() => {
                setCurrentScan(null);
                setScreen('home');
              }}
              isOnline={isOnline}
            />
          )}

          {screen === 'result' && currentScan && (
            <ResultScreen
              scan={currentScan}
              onBack={() => setScreen('home')}
              language={settings.language}
            />
          )}

          {screen === 'history' && (
            <HistoryScreen
              scans={scans}
              onOpenScan={handleOpenScan}
              onDeleteScan={handleDeleteScan}
              onClearAll={handleClearAllHistory}
              onBack={() => setScreen('home')}
              language={settings.language}
            />
          )}

          {screen === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={updateSettings}
              onClearAllHistory={handleClearAllHistory}
              onBack={() => setScreen('home')}
              onOpenPitchGuide={() => setIsPitchGuideOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Hackathon Demo Pitch Cheatsheet & Architecture Modal */}
      <PitchGuideModal
        isOpen={isPitchGuideOpen}
        onClose={() => setIsPitchGuideOpen(false)}
      />
    </div>
  );
}
