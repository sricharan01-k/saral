import React, { useRef } from 'react';
import { Camera, Upload, ArrowRight, Clock, FileText, CheckCircle2, Shield } from 'lucide-react';
import { ScanRecord, SampleDoc } from '../types';
import { SAMPLE_DOCUMENTS } from '../lib/samples';

interface HomeScreenProps {
  recentScans: ScanRecord[];
  onCaptureFile: (file: File) => void;
  onSelectSample: (sample: SampleDoc) => void;
  onOpenScan: (scan: ScanRecord) => void;
  onNavigateHistory: () => void;
  language: 'en' | 'hi';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  recentScans,
  onCaptureFile,
  onSelectSample,
  onOpenScan,
  onNavigateHistory,
  language,
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCaptureFile(e.target.files[0]);
    }
  };

  const isHindi = language === 'hi';

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 py-6">
      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="saral-camera-input"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="saral-gallery-input"
      />

      {/* Hero Headline Card: solid white #FFFFFF, 16px radius, soft shadow, left-aligned */}
      <section className="card-surface p-6 sm:p-8 text-left">
        <h1 className="text-[26px] font-bold leading-tight text-[#312E81]">
          {isHindi
            ? 'कानूनी नोटिस और बिल समझें आसान भाषा में'
            : 'Decode confusing legal notices and bills'}
        </h1>

        <p className="mt-3 text-[18px] text-slate-700 leading-relaxed">
          {isHindi
            ? 'कागज़ात की फोटो लें। ऑन-डिवाइस ओसीआर बिना इंटरनेट के शब्द पहचानता है और जरूरी कदम साफ भाषा में समझाता है।'
            : 'Photograph any legal summons, utility bill, or RTI notice. Saral extracts text on-device and translates legalese into simple action steps.'}
        </p>

        {/* Action Buttons: Primary + Secondary, 56px min height, 12px radius, icon to left */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="btn-primary flex-1"
            id="saral-btn-capture-camera"
          >
            <Camera className="h-6 w-6 shrink-0" strokeWidth={2.2} />
            <span>{isHindi ? 'कैमरा से फोटो लें' : 'Photograph Document'}</span>
          </button>

          <button
            onClick={() => galleryInputRef.current?.click()}
            className="btn-secondary flex-1"
            id="saral-btn-upload-gallery"
          >
            <Upload className="h-6 w-6 shrink-0" strokeWidth={2.2} />
            <span>{isHindi ? 'गैलरी से चुनें' : 'Upload from Files'}</span>
          </button>
        </div>
      </section>

      {/* Recent Scans Section */}
      <section className="flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-[#312E81]">
            {isHindi ? 'हाल के स्कैन' : 'Recent Scans'}
          </h2>
          {recentScans.length > 0 && (
            <button
              onClick={onNavigateHistory}
              className="flex items-center gap-1.5 text-[16px] font-semibold text-[#312E81] hover:underline active:scale-95 transition-all duration-150"
            >
              <span>{isHindi ? 'सभी देखें' : 'View all'}</span>
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {recentScans.length === 0 ? (
          <div className="card-surface p-6 text-left">
            <p className="text-[18px] text-slate-600">
              {isHindi
                ? 'अभी कोई स्कैन सहेजा नहीं गया है। ऊपर दिए गए बटन से पहला दस्तावेज़ स्कैन करें या नीचे दिए गए नमूनों से तुरंत आज़माएं।'
                : 'No documents scanned yet. Take a photo above or try one of the sample notices below.'}
            </p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recentScans.slice(0, 5).map((scan) => {
              const risk = scan.result?.riskLevel || 'medium';
              // Reserve red/amber/green strictly for risk levels
              const riskBadgeBg =
                risk === 'high'
                  ? 'bg-[#DC2626] text-white'
                  : risk === 'medium'
                  ? 'bg-[#F59E0B] text-slate-950 font-bold'
                  : 'bg-[#059669] text-white';

              return (
                <button
                  key={scan.id}
                  onClick={() => onOpenScan(scan)}
                  className="card-surface group flex w-64 shrink-0 flex-col p-5 text-left transition-all duration-150 hover:border-[#312E81]/30 active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-14 w-12 shrink-0 overflow-hidden rounded-[8px] bg-slate-100 border border-slate-200">
                      {scan.imageDataUrl ? (
                        <img
                          src={scan.imageDataUrl}
                          alt="Thumbnail"
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <FileText className="h-5 w-5" strokeWidth={2} />
                        </div>
                      )}
                    </div>
                    <span className={`rounded-[6px] px-2.5 py-1 text-[16px] font-bold uppercase tracking-wide ${riskBadgeBg}`}>
                      {risk}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-[18px] font-semibold text-[#312E81] leading-snug">
                    {scan.result?.tldr || scan.ocrText.slice(0, 70) || 'Scanned document'}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-[16px] text-slate-500">
                    <Clock className="h-4 w-4" strokeWidth={2} />
                    <span>{new Date(scan.timestamp).toLocaleDateString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Test with Sample Documents */}
      <section className="flex flex-col gap-4 text-left">
        <div>
          <h2 className="text-[20px] font-bold text-[#312E81]">
            {isHindi ? 'नमूना दस्तावेज़ से तुरंत आज़माएं' : 'Sample Documents'}
          </h2>
          <p className="mt-1 text-[18px] text-slate-600">
            {isHindi
              ? 'बिना कागज़ात के देखने के लिए इनमें से कोई भी कानूनी नोटिस या बिल चुनें:'
              : 'Select a sample to inspect the simplification flow:'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="card-surface group flex flex-col justify-between p-5 text-left transition-all duration-150 hover:border-[#312E81]/30 active:scale-[0.98]"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="rounded-[6px] bg-[#312E81]/10 px-2.5 py-1 text-[16px] font-semibold text-[#312E81]">
                    {sample.category}
                  </span>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#312E81] group-hover:translate-x-0.5 transition-all duration-150" strokeWidth={2} />
                </div>
                <h3 className="mt-3 text-[18px] font-bold text-[#312E81] line-clamp-2">
                  {sample.title}
                </h3>
                <p className="mt-1.5 text-[16px] text-slate-600 line-clamp-2">
                  {sample.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[16px] text-[#312E81] font-semibold">
                <span>View decode</span>
                <span className="text-slate-400">Sample</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Offline Architecture Note: Solid white card, clean text, no glassmorphism */}
      <section className="card-surface p-5 text-left">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-[#312E81] shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <h3 className="text-[18px] font-bold text-[#312E81]">
              On-Device Privacy &amp; Offline OCR
            </h3>
            <p className="mt-1 text-[16px] text-slate-600 leading-relaxed">
              Camera scanning, image processing, and text recognition run directly on your phone using local IndexedDB storage.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
