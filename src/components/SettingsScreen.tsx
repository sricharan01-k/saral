import React, { useState } from 'react';
import { ArrowLeft, Globe, Type, Trash2, Shield, Check, HelpCircle } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClearAllHistory: () => void;
  onBack: () => void;
  onOpenPitchGuide: () => void;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', comingSoon: true },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', comingSoon: true },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳', comingSoon: true },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳', comingSoon: true },
] as const;

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onClearAllHistory,
  onBack,
  onOpenPitchGuide,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[16px] font-semibold text-[#312E81] hover:underline active:scale-95 transition-all duration-150"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
          <span>Back</span>
        </button>

        <h1 className="text-[22px] font-bold text-[#312E81]">
          Settings &amp; Preferences
        </h1>
        <div className="w-16" />
      </div>

      {/* Language Toggle Section */}
      <section className="card-surface p-6 sm:p-8 text-left flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <Globe className="h-6 w-6 text-[#312E81]" strokeWidth={2.2} />
          <h2 className="text-[22px] font-bold text-[#312E81]">
            Document Output Language
          </h2>
        </div>
        <p className="text-[18px] text-slate-600">
          Choose the language used for plain-language summaries, action items, and decoded terms.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mt-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = settings.language === lang.code;
            const isComingSoon = Boolean((lang as any).comingSoon);

            return (
              <button
                key={lang.code}
                disabled={isComingSoon}
                onClick={() => onUpdateSettings({ language: lang.code as 'en' | 'hi' })}
                className={`relative flex flex-col rounded-[12px] p-4 text-left transition-all duration-150 active:scale-[0.98] ${
                  isSelected
                    ? 'border-2 border-[#312E81] bg-[#312E81] text-white shadow-sm'
                    : isComingSoon
                    ? 'border border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed text-slate-400'
                    : 'border-2 border-slate-200 bg-white text-[#312E81] hover:border-[#312E81]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{lang.flag}</span>
                  {isSelected && <Check className="h-5 w-5 text-white" strokeWidth={2.5} />}
                  {isComingSoon && (
                    <span className="text-[12px] font-bold text-slate-500 uppercase">Soon</span>
                  )}
                </div>
                <span className={`mt-2 text-[18px] font-bold ${isSelected ? 'text-white' : 'text-[#312E81]'}`}>
                  {lang.native}
                </span>
                <span className={`text-[16px] ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                  {lang.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Accessibility: Large Text Mode */}
      <section className="card-surface p-6 sm:p-8 text-left">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Type className="h-6 w-6 text-[#312E81] shrink-0 mt-0.5" strokeWidth={2.2} />
            <div>
              <h2 className="text-[22px] font-bold text-[#312E81]">
                Enhanced Legibility Mode
              </h2>
              <p className="mt-1 text-[18px] text-slate-600">
                Increases baseline typography scaling for elderly and low-vision readers.
              </p>
            </div>
          </div>

          <button
            onClick={() => onUpdateSettings({ largeText: !settings.largeText })}
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
              settings.largeText ? 'bg-[#312E81]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-150 ease-in-out ${
                settings.largeText ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Technical Architecture & Privacy Details */}
      <section className="card-surface p-6 sm:p-8 text-left flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="h-6 w-6 text-[#312E81]" strokeWidth={2.2} />
            <h2 className="text-[22px] font-bold text-[#312E81]">
              Offline Architecture &amp; Privacy
            </h2>
          </div>
          <button
            onClick={onOpenPitchGuide}
            className="flex items-center gap-1.5 text-[16px] font-bold text-[#312E81] hover:underline"
          >
            <HelpCircle className="h-4 w-4" strokeWidth={2} />
            <span>Judge Guide</span>
          </button>
        </div>

        <div className="text-[18px] leading-relaxed text-slate-700 space-y-3">
          <p>
            • <strong>OCR &amp; Storage:</strong> Camera capture, image preprocessing, and Tesseract character recognition run 100% on-device with zero internet connection required.
          </p>
          <p>
            • <strong>Simplification Engine:</strong> Architected for on-device Gemini Nano execution, seamlessly falling back to the Gemini Flash API when connectivity is available.
          </p>
          <p>
            • <strong>Data Privacy:</strong> Documents remain stored in local IndexedDB by default.
          </p>
        </div>
      </section>

      {/* Destructive Action: Clear Stored History */}
      {/* "Destructive action: white fill, 2px border and text in #DC2626, only fills red on press" */}
      <section className="card-surface p-6 sm:p-8 text-left flex flex-col gap-4 border-2 border-[#DC2626]/20">
        <div>
          <h2 className="text-[22px] font-bold text-[#DC2626] flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-[#DC2626]" strokeWidth={2.2} />
            <span>Clear Stored History</span>
          </h2>
          <p className="mt-1 text-[18px] text-slate-600">
            Permanently delete all scanned documents, images, and cached OCR text from this device.
          </p>
        </div>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="btn-destructive self-start"
        >
          <Trash2 className="h-5 w-5" strokeWidth={2.2} />
          <span>Clear Local Data</span>
        </button>

        {showClearConfirm && (
          <div className="rounded-[12px] border-2 border-[#DC2626] bg-red-50 p-5 text-left mt-2">
            <p className="text-[18px] font-bold text-[#DC2626]">
              Are you sure? This will remove all scans from local storage. This action cannot be undone.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  onClearAllHistory();
                  setShowClearConfirm(false);
                }}
                className="rounded-[8px] bg-[#DC2626] px-5 py-2.5 text-[16px] font-bold text-white active:scale-95 transition-all"
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-[8px] border border-slate-300 bg-white px-5 py-2.5 text-[16px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
