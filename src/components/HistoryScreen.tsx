import React, { useState, useMemo } from 'react';
import { Search, Clock, Trash2, ArrowLeft, FileText, Filter, Check, Eye } from 'lucide-react';
import { ScanRecord, RiskLevel } from '../types';

interface HistoryScreenProps {
  scans: ScanRecord[];
  onOpenScan: (scan: ScanRecord) => void;
  onDeleteScan: (id: string) => void;
  onClearAll: () => void;
  onBack: () => void;
  language: 'en' | 'hi';
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  scans,
  onOpenScan,
  onDeleteScan,
  onClearAll,
  onBack,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredScans = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return scans.filter((scan) => {
      // Risk filter
      if (filterRisk !== 'all') {
        const risk = scan.result?.riskLevel || 'medium';
        if (risk !== filterRisk) return false;
      }

      // Search query over tldr, ocrText, and riskReason
      if (!q) return true;
      const tldr = scan.result?.tldr?.toLowerCase() || '';
      const ocr = scan.ocrText?.toLowerCase() || '';
      const reason = scan.result?.riskReason?.toLowerCase() || '';
      return tldr.includes(q) || ocr.includes(q) || reason.includes(q);
    });
  }, [scans, searchQuery, filterRisk]);

  const isHindi = language === 'hi';

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-6 text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[16px] font-semibold text-[#312E81] hover:underline active:scale-95 transition-all duration-150"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
          <span>{isHindi ? 'वापस' : 'Back'}</span>
        </button>

        <h1 className="text-[22px] font-bold text-[#312E81]">
          {isHindi ? 'स्कैन इतिहास' : 'Scan History'}
        </h1>

        {scans.length > 0 ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 rounded-[8px] border border-[#DC2626] bg-white px-3 py-1.5 text-[16px] font-semibold text-[#DC2626] active:bg-[#DC2626] active:text-white transition-all duration-150"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
            <span>Clear All</span>
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {/* Clear All Confirmation Alert */}
      {showClearConfirm && (
        <div className="card-surface p-5 border-2 border-[#DC2626] text-left">
          <h3 className="text-[18px] font-bold text-[#DC2626]">
            Clear all saved scans from this device?
          </h3>
          <p className="mt-1 text-[16px] text-slate-700">
            This will permanently remove all cached OCR and simplified records from local storage.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => {
                onClearAll();
                setShowClearConfirm(false);
              }}
              className="rounded-[8px] bg-[#DC2626] px-4 py-2 text-[16px] font-bold text-white active:scale-95 transition-all"
            >
              Yes, Delete All
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="rounded-[8px] border border-slate-300 bg-white px-4 py-2 text-[16px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search Input: Min height 56px, clean border, left icon with text placeholder */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" strokeWidth={2} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isHindi
              ? 'दस्तावेज़ या सारांश में खोजें...'
              : 'Search scans by keyword or notice title...'
          }
          className="w-full rounded-[12px] border-2 border-slate-300 bg-white py-3.5 pl-12 pr-4 text-[18px] text-slate-900 placeholder:text-slate-400 focus:border-[#312E81] focus:outline-none min-h-[56px]"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[16px]">
        <span className="text-slate-600 font-bold shrink-0 flex items-center gap-1">
          <Filter className="h-4 w-4" strokeWidth={2} />
          <span>Filter:</span>
        </span>
        {(['all', 'high', 'medium', 'low'] as const).map((r) => {
          const isSelected = filterRisk === r;
          const label = {
            all: isHindi ? 'सभी' : 'All',
            high: isHindi ? 'उच्च जोखिम' : 'High Risk',
            medium: isHindi ? 'मध्यम जोखिम' : 'Medium Risk',
            low: isHindi ? 'निम्न जोखिम' : 'Low Risk',
          }[r];

          return (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`rounded-[8px] px-3.5 py-1.5 text-[16px] font-bold transition-all duration-150 shrink-0 active:scale-95 ${
                isSelected
                  ? 'bg-[#312E81] text-white shadow-sm'
                  : 'border border-[#312E81]/20 bg-white text-[#312E81] hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Scan Records List */}
      {filteredScans.length === 0 ? (
        <div className="card-surface p-8 text-center flex flex-col items-center">
          <FileText className="h-12 w-12 text-slate-400" strokeWidth={1.8} />
          <h3 className="mt-3 text-[20px] font-bold text-[#312E81]">
            {searchQuery ? 'No matching scans found' : 'No scans saved in local storage'}
          </h3>
          <p className="mt-1 text-[18px] text-slate-600 max-w-sm">
            {searchQuery
              ? 'Try adjusting your search query or clear the filter.'
              : 'All scanned documents are saved automatically to your device.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredScans.map((scan) => {
            const risk = scan.result?.riskLevel || 'medium';
            // Strictly reserve red/amber/green for risk level
            const riskBadgeClass =
              risk === 'high'
                ? 'bg-[#DC2626] text-white'
                : risk === 'medium'
                ? 'bg-[#F59E0B] text-slate-950 font-bold'
                : 'bg-[#059669] text-white';

            return (
              <div
                key={scan.id}
                className="card-surface p-5 sm:p-6 text-left flex flex-col gap-4 transition-all duration-150 hover:border-[#312E81]/30"
              >
                <div
                  onClick={() => onOpenScan(scan)}
                  className="flex items-start gap-4 cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-[8px] border border-slate-200 bg-slate-100">
                    {scan.imageDataUrl ? (
                      <img
                        src={scan.imageDataUrl}
                        alt="Scan thumbnail"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <FileText className="h-8 w-8" strokeWidth={1.8} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-[6px] px-2.5 py-0.5 text-[14px] font-bold uppercase tracking-wide ${riskBadgeClass}`}>
                        {risk} Risk
                      </span>
                      <div className="flex items-center gap-1.5 text-[16px] text-slate-500">
                        <Clock className="h-4 w-4" strokeWidth={2} />
                        <span>{new Date(scan.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <h4 className="mt-2 text-[18px] sm:text-[20px] font-bold text-[#312E81] line-clamp-2 leading-snug">
                      {scan.result?.tldr || scan.ocrText.slice(0, 90) || 'Scanned Document'}
                    </h4>

                    {scan.result?.actionItems?.[0] && (
                      <p className="mt-1.5 line-clamp-1 text-[16px] text-slate-700 font-semibold">
                        Next action: {scan.result.actionItems[0].text}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Row Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[16px] text-slate-500 font-mono">
                    {scan.ocrText ? `${scan.ocrText.length} characters` : 'Cached'}
                  </span>

                  <div className="flex items-center gap-3">
                    {confirmDeleteId === scan.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-bold text-[#DC2626]">Delete?</span>
                        <button
                          onClick={() => {
                            onDeleteScan(scan.id);
                            setConfirmDeleteId(null);
                          }}
                          className="rounded-[6px] bg-[#DC2626] px-3 py-1 text-[14px] font-bold text-white active:scale-95"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[14px] text-slate-600 hover:text-slate-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(scan.id)}
                        className="flex items-center gap-1 rounded-[8px] p-2 text-slate-500 hover:text-[#DC2626] active:scale-95 transition-colors"
                        title="Delete this document"
                      >
                        <Trash2 className="h-5 w-5" strokeWidth={2} />
                        <span className="text-[16px]">Delete</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenScan(scan)}
                      className="flex items-center gap-1.5 rounded-[8px] bg-[#312E81] px-4 py-2 text-[16px] font-bold text-white active:scale-95 hover:bg-[#26236b] transition-all duration-150"
                    >
                      <Eye className="h-4 w-4" strokeWidth={2} />
                      <span>Open</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
