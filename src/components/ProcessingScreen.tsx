import React from 'react';
import { Loader2, AlertTriangle, ArrowLeft, Camera, FileText, CheckCircle2, Cpu } from 'lucide-react';
import { ScanStatus } from '../types';

interface ProcessingScreenProps {
  status: ScanStatus;
  ocrProgress: number; // 0 to 1
  ocrMessage: string;
  ocrText: string;
  thumbnailUrl: string;
  errorMessage?: string;
  onRetake: () => void;
  onCancel: () => void;
  onManualOcrEdit?: (text: string) => void;
  isOnline: boolean;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  status,
  ocrProgress,
  ocrMessage,
  ocrText,
  thumbnailUrl,
  errorMessage,
  onRetake,
  onCancel,
  isOnline,
}) => {
  const isOcrRunning = status === 'captured';
  const isSimplifying = status === 'simplifying';
  const isTooShortError = errorMessage && errorMessage.includes('20 characters');

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-6 text-left">
      {/* Back to Home Button */}
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#312E81] hover:underline active:scale-95 transition-all duration-150 self-start"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
        <span>Cancel &amp; return home</span>
      </button>

      {/* Captured Document Preview Card */}
      <div className="card-surface mx-auto flex h-60 w-48 overflow-hidden p-2 items-center justify-center">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Captured document"
            className="h-full w-full rounded-[10px] object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-100 text-slate-400">
            <FileText className="h-10 w-10" strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Status & Actions Container */}
      {status === 'error' ? (
        <div className="card-surface p-6 text-left">
          {/* Risk/Error Banner signal */}
          <div className="flex items-center gap-3 text-[#DC2626]">
            <AlertTriangle className="h-7 w-7 shrink-0" strokeWidth={2.2} />
            <h2 className="text-[22px] font-bold text-[#DC2626]">
              {isTooShortError ? "Couldn't read clearly" : "Scan Error"}
            </h2>
          </div>

          <p className="mt-3 text-[18px] text-slate-700 leading-relaxed">
            {errorMessage ||
              "Couldn't read this clearly — try better lighting or a flatter angle."}
          </p>

          {ocrText && ocrText.length > 0 && (
            <div className="mt-4 rounded-[12px] bg-slate-100 p-4 border border-slate-200">
              <span className="text-[16px] font-bold text-slate-700 block mb-1">
                Extracted snippet ({ocrText.length} characters):
              </span>
              <p className="text-[16px] text-slate-600 line-clamp-3 font-mono">
                {ocrText}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={onRetake}
              className="btn-primary w-full"
            >
              <Camera className="h-5 w-5" strokeWidth={2.2} />
              <span>Retake Photo</span>
            </button>
            <button
              onClick={onCancel}
              className="btn-secondary w-full"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="card-surface p-6 sm:p-8 text-left">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#312E81]/10 text-[#312E81]">
              <Loader2 className="h-6 w-6 animate-spin" strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="text-[22px] font-bold text-[#312E81]">
                {isOcrRunning ? 'Reading document...' : 'Simplifying document...'}
              </h2>
              <p className="text-[16px] text-slate-600">
                {isOcrRunning
                  ? ocrMessage || 'Extracting on-device text with Tesseract.js'
                  : 'Synthesizing plain language, deadlines & action steps'}
              </p>
            </div>
          </div>

          {/* Sequential Step Progress */}
          <div className="mt-6 flex flex-col gap-4">
            {/* Step 1: On-Device OCR */}
            <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-[16px] mb-2">
                <span className="font-bold text-[#312E81] flex items-center gap-2">
                  {status === 'simplifying' || status === 'done' ? (
                    <CheckCircle2 className="h-5 w-5 text-[#0D9488]" strokeWidth={2.2} />
                  ) : (
                    <Cpu className="h-5 w-5 text-[#312E81]" strokeWidth={2.2} />
                  )}
                  <span>1. On-Device OCR (Tesseract.js)</span>
                </span>
                <span className="font-mono font-bold text-[#312E81]">
                  {Math.round(ocrProgress * 100)}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-[#312E81] transition-all duration-150"
                  style={{ width: `${Math.max(5, Math.round(ocrProgress * 100))}%` }}
                />
              </div>
            </div>

            {/* Step 2: Simplification & Action Extraction */}
            <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-[16px] mb-2">
                <span className="font-bold text-[#312E81] flex items-center gap-2">
                  {status === 'done' ? (
                    <CheckCircle2 className="h-5 w-5 text-[#0D9488]" strokeWidth={2.2} />
                  ) : (
                    <Loader2 className={`h-5 w-5 ${isSimplifying ? 'animate-spin text-[#0D9488]' : 'text-slate-400'}`} strokeWidth={2.2} />
                  )}
                  <span>2. Plain Language &amp; Action Steps</span>
                </span>
                <span className="text-[16px] font-semibold text-slate-600">
                  {isSimplifying ? 'Processing...' : 'Waiting'}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full bg-[#0D9488] transition-all duration-150 ${
                    isSimplifying ? 'w-3/4 animate-pulse' : 'w-0'
                  }`}
                />
              </div>
            </div>
          </div>

          {!isOnline && (
            <div className="mt-5 rounded-[12px] bg-slate-100 p-3 text-[16px] text-slate-700">
              Offline mode active. Document text is preserved in local storage.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
