import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Share2,
  Check,
  ArrowLeft,
  MessageSquare,
  Send,
  Loader2,
  BookOpen,
  IndianRupee,
  PenTool,
  Phone,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Cloud,
  X,
  Layers
} from 'lucide-react';
import { ScanRecord, RiskLevel } from '../types';
import { askDocumentFollowUp, submitGlossaryFeedback } from '../lib/api';
import { isCloudSyncBannerDismissed, dismissCloudSyncBannerFor7Days } from '../lib/storage';

interface ResultScreenProps {
  scan: ScanRecord;
  onBack: () => void;
  onResimplifyInLang?: (lang: 'en' | 'hi') => void;
  language: 'en' | 'hi';
  largeText?: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  scan,
  onBack,
  language,
}) => {
  const result = scan.result;
  const [viewMode, setViewMode] = useState<'simplified' | 'original'>('simplified');
  const [expandedGlossary, setExpandedGlossary] = useState<Record<number, boolean>>({});
  const [activeSpeakingText, setActiveSpeakingText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});
  const [showSyncBanner, setShowSyncBanner] = useState(!isCloudSyncBannerDismissed());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Grounded Follow-Up Q&A state
  const [question, setQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState<{ q: string; a: string }[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [qaError, setQaError] = useState<string | null>(null);

  const hasAutoPlayedRef = useRef(false);

  // Text-to-speech helper
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (activeSpeakingText === text) {
      window.speechSynthesis.cancel();
      setActiveSpeakingText(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    if (scan.language === 'hi' || language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 0.92;

    utterance.onend = () => setActiveSpeakingText(null);
    utterance.onerror = () => setActiveSpeakingText(null);

    setActiveSpeakingText(text);
    window.speechSynthesis.speak(utterance);
  };

  const stopAllSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setActiveSpeakingText(null);
    }
  };

  // Auto-play TL;DR text-to-speech once on result mount
  useEffect(() => {
    if (!hasAutoPlayedRef.current && result?.tldr) {
      hasAutoPlayedRef.current = true;
      const timer = setTimeout(() => {
        speakText(result.tldr);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [result]);

  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, []);

  const handleCopySummary = () => {
    if (!result) return;
    const actionsText = result.actionItems
      .map((a, i) => `${i + 1}. ${a.text} ${a.deadline ? `[Deadline: ${a.deadline}]` : ''}`)
      .join('\n');
    const shareText = `Saral Document Breakdown\n\nTL;DR:\n${result.tldr}\n\nRisk Level: ${result.riskLevel.toUpperCase()} (${result.riskReason})\n\nAction Steps:\n${actionsText}`;

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!result) return;
    const shareData = {
      title: 'Saral Document Simplification',
      text: `${result.tldr}\n\nKey action: ${result.actionItems[0]?.text || ''}`,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      handleCopySummary();
    }
  };

  const handleFeedback = async (term: string, plainMeaning: string, wasHelpful: boolean) => {
    setFeedbackGiven((prev) => ({ ...prev, [term]: wasHelpful ? 'up' : 'down' }));
    await submitGlossaryFeedback(term, plainMeaning, wasHelpful);
  };

  const handleDismissSyncBanner = () => {
    dismissCloudSyncBannerFor7Days();
    setShowSyncBanner(false);
  };

  const handleTriggerCloudBackup = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setShowSyncBanner(false), 2500);
    }, 1000);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAnswering) return;

    const userQ = question.trim();
    setQuestion('');
    setQaError(null);
    setIsAnswering(true);

    try {
      const answer = await askDocumentFollowUp(
        userQ,
        scan.ocrText,
        result?.tldr || '',
        scan.language || language
      );
      setQaHistory((prev) => [...prev, { q: userQ, a: answer }]);
    } catch (err: any) {
      setQaError(err?.message || 'Could not fetch answer.');
    } finally {
      setIsAnswering(false);
    }
  };

  // Action item icons
  const getActionItemIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (/(?:rupee|pay|paid|rs\.?|₹|amount|fee|fine|penalty|settle|cheque|deposit|cost|money|bill)/i.test(lower)) {
      return <IndianRupee className="h-6 w-6 text-[#312E81]" strokeWidth={2.2} />;
    }
    if (/(?:sign|signature|endorse|thumb|stamp|execute)/i.test(lower)) {
      return <PenTool className="h-6 w-6 text-[#312E81]" strokeWidth={2.2} />;
    }
    if (/(?:call|phone|contact|officer|cpio|helpline|reach|inquire)/i.test(lower)) {
      return <Phone className="h-6 w-6 text-[#312E81]" strokeWidth={2.2} />;
    }
    if (/(?:send|submit|file|appeal|reply|post|mail|dispatch|forward)/i.test(lower)) {
      return <Send className="h-6 w-6 text-[#312E81]" strokeWidth={2.2} />;
    }
    if (/(?:date|deadline|cutoff|before|within|days|by\s+[0-9]|due)/i.test(lower)) {
      return <Calendar className="h-6 w-6 text-[#312E81]" strokeWidth={2.2} />;
    }
    return <AlertCircle className="h-6 w-6 text-[#312E81]" strokeWidth={2.2} />;
  };

  if (!result) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-8 text-left">
        <div className="card-surface p-6 text-left">
          <AlertTriangle className="h-10 w-10 text-[#DC2626]" strokeWidth={2.2} />
          <h2 className="mt-3 text-[22px] font-bold text-[#312E81]">No simplification data available</h2>
          <p className="mt-2 text-[18px] text-slate-600">Raw OCR text was saved, but document simplification is still pending.</p>
          <button onClick={onBack} className="btn-primary mt-6 w-full">
            <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
            <span>Return Home</span>
          </button>
        </div>
      </div>
    );
  }

  // Sort action items: high > medium > low, then deadline
  const urgencyWeight: Record<RiskLevel, number> = { high: 3, medium: 2, low: 1 };
  const sortedActionItems = [...result.actionItems].sort((a, b) => {
    const weightDiff = (urgencyWeight[b.urgency] || 1) - (urgencyWeight[a.urgency] || 1);
    if (weightDiff !== 0) return weightDiff;
    if (a.deadline && !b.deadline) return -1;
    if (!a.deadline && b.deadline) return 1;
    return 0;
  });

  const risk = result.riskLevel || 'medium';

  // EXACT RISK BANNER SPECIFICATION:
  // - High: white text on solid #DC2626 background, warning-triangle icon
  // - Medium: dark text on solid #F59E0B background, clock icon
  // - Low: white text on solid #059669 background, checkmark icon
  // - Full-width, top of the Result screen, never a subtle tint — this needs to be unmissable!
  const isHigh = risk === 'high';
  const isMedium = risk === 'medium';
  const isLow = risk === 'low';

  return (
    <div className="w-full">
      {/* 1. FULL-WIDTH TOP RISK BANNER */}
      <section
        className={`w-full px-5 py-5 text-left transition-colors duration-150 ${
          isHigh
            ? 'bg-[#DC2626] text-white'
            : isMedium
            ? 'bg-[#F59E0B] text-slate-950'
            : 'bg-[#059669] text-white'
        }`}
      >
        <div className="mx-auto flex max-w-2xl items-start gap-4">
          <div className="mt-1 shrink-0">
            {isHigh && <AlertTriangle className="h-8 w-8 text-white" strokeWidth={2.5} />}
            {isMedium && <Clock className="h-8 w-8 text-slate-950" strokeWidth={2.5} />}
            {isLow && <CheckCircle2 className="h-8 w-8 text-white" strokeWidth={2.5} />}
          </div>

          <div className="flex-1">
            <div className="text-[16px] font-bold uppercase tracking-wider">
              {risk.toUpperCase()} RISK LEVEL
            </div>
            <h2 className="mt-0.5 text-[22px] sm:text-[24px] font-bold leading-tight">
              {isHigh && (language === 'hi' ? 'उच्च जोखिम: तुरंत कार्रवाई आवश्यक है' : 'High Risk: Immediate Action Required')}
              {isMedium && (language === 'hi' ? 'मध्यम जोखिम: समय पर कार्रवाई करें' : 'Medium Risk: Action Needed Soon')}
              {isLow && (language === 'hi' ? 'निम्न जोखिम: केवल सूचनात्मक' : 'Low Risk: Informational Notice')}
            </h2>
            <p className="mt-1.5 text-[18px] leading-relaxed font-normal opacity-95">
              {result.riskReason}
            </p>
          </div>
        </div>
      </section>

      {/* Main Container: Single-column, generous 20px+ padding, mobile-first */}
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 py-6">
        {/* Navigation & Sharing Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[16px] font-semibold text-[#312E81] hover:underline active:scale-95 transition-all duration-150"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
            <span>{language === 'hi' ? 'मुख्य पृष्ठ' : 'Back to home'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-[12px] border-2 border-[#312E81] bg-white px-4 py-2 text-[16px] font-bold text-[#312E81] active:scale-95 hover:bg-slate-50 transition-all duration-150"
          >
            {copied ? <Check className="h-4 w-4" strokeWidth={2.2} /> : <Share2 className="h-4 w-4" strokeWidth={2.2} />}
            <span>{copied ? 'Copied summary' : 'Share breakdown'}</span>
          </button>
        </div>

        {/* Segmented View Switcher: Simplified vs Original */}
        <div className="grid grid-cols-2 gap-2 rounded-[12px] bg-white p-1.5 border border-[#312E81]/15 shadow-sm">
          <button
            onClick={() => setViewMode('simplified')}
            className={`flex items-center justify-center gap-2 rounded-[8px] py-3 text-[16px] font-bold transition-all duration-150 active:scale-[0.98] ${
              viewMode === 'simplified'
                ? 'bg-[#312E81] text-white shadow-sm'
                : 'bg-transparent text-[#312E81] hover:bg-[#FAF7F2]'
            }`}
          >
            <FileText className="h-4 w-4" strokeWidth={2} />
            <span>Simplified</span>
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`flex items-center justify-center gap-2 rounded-[8px] py-3 text-[16px] font-bold transition-all duration-150 active:scale-[0.98] ${
              viewMode === 'original'
                ? 'bg-[#312E81] text-white shadow-sm'
                : 'bg-transparent text-[#312E81] hover:bg-[#FAF7F2]'
            }`}
          >
            <Layers className="h-4 w-4" strokeWidth={2} />
            <span>Original Text</span>
          </button>
        </div>

        {/* Optional Cloud Sync Notice Banner */}
        {showSyncBanner && (
          <div className="card-surface flex items-center justify-between gap-4 p-5 text-left">
            <div className="flex items-start gap-3">
              <Cloud className="h-6 w-6 text-[#312E81] shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <h4 className="text-[18px] font-bold text-[#312E81]">
                  {syncSuccess ? 'Backup Saved' : 'Optional Cloud Sync'}
                </h4>
                <p className="mt-0.5 text-[16px] text-slate-600">
                  {syncSuccess
                    ? 'This document is synced to your private anonymous vault.'
                    : 'Save an encrypted backup to access this scan across your devices.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!syncSuccess && (
                <button
                  onClick={handleTriggerCloudBackup}
                  disabled={isSyncing}
                  className="rounded-[8px] bg-[#312E81] px-3.5 py-2 text-[16px] font-bold text-white active:scale-95 transition-all duration-150"
                >
                  {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sync'}
                </button>
              )}
              <button
                onClick={handleDismissSyncBanner}
                className="rounded-[8px] p-2 text-slate-400 hover:text-slate-700 active:scale-95"
                title="Dismiss for 7 days"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {viewMode === 'original' ? (
          /* Original Document Text View: separated by whitespace, clean white card */
          <div className="flex flex-col gap-6">
            <div className="card-surface p-6 sm:p-8 text-left">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-[22px] font-bold text-[#312E81]">Original Document Text</h2>
                  <p className="text-[16px] text-slate-600">Extracted on-device with Tesseract OCR</p>
                </div>
                <button
                  onClick={() => setViewMode('simplified')}
                  className="text-[16px] font-bold text-[#312E81] underline"
                >
                  Back to summary
                </button>
              </div>

              {/* Raw extracted text */}
              <div className="mt-5 rounded-[12px] bg-slate-50 p-5 font-mono text-[16px] sm:text-[18px] text-slate-800 whitespace-pre-wrap leading-relaxed border border-slate-200">
                {scan.ocrText || 'No text extracted.'}
              </div>

              {scan.imageDataUrl && (
                <div className="mt-6">
                  <span className="text-[16px] font-bold text-[#312E81] block mb-2">
                    Source Photo:
                  </span>
                  <div className="max-h-96 overflow-hidden rounded-[12px] bg-slate-100 p-2 border border-slate-200">
                    <img
                      src={scan.imageDataUrl}
                      alt="Source document"
                      className="w-full h-full object-contain rounded-[8px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Simplified Result Screen: Sections separated by real whitespace (24px+ / gap-8) */
          <div className="flex flex-col gap-8">
            {/* SECTION A: TL;DR — 26px bold, centered allowed per spec, with audio button */}
            <section className="card-surface p-6 sm:p-8 text-center flex flex-col items-center">
              <span className="text-[16px] font-bold uppercase tracking-wider text-[#312E81]/80">
                {language === 'hi' ? 'मुख्य सारांश' : 'Plain Language Summary'}
              </span>

              <h1 className="mt-3 text-[26px] font-bold leading-tight text-[#312E81]">
                "{result.tldr}"
              </h1>

              {/* Master Spoken Audio Button: Solid indigo or teal fill, 56px height, icon to left */}
              <div className="mt-6 w-full max-w-sm">
                <button
                  onClick={() => speakText(result.tldr)}
                  className={`btn-primary w-full ${activeSpeakingText === result.tldr ? 'bg-[#0D9488]' : ''}`}
                >
                  {activeSpeakingText === result.tldr ? (
                    <>
                      <VolumeX className="h-6 w-6 shrink-0" strokeWidth={2.2} />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-6 w-6 shrink-0" strokeWidth={2.2} />
                      <span>Listen to Summary</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* SECTION B: "What You Need To Do" — Checklist with large icons and numbered steps */}
            <section className="flex flex-col gap-4 text-left">
              <div>
                <h2 className="text-[22px] font-bold text-[#312E81]">
                  {language === 'hi' ? 'आपको क्या करना होगा' : 'What You Need To Do'}
                </h2>
                <p className="mt-1 text-[18px] text-slate-600">
                  {sortedActionItems.length} sequential action {sortedActionItems.length === 1 ? 'step' : 'steps'}:
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {sortedActionItems.map((item, index) => {
                  const isItemSpeaking = activeSpeakingText === item.text;
                  const itemUrgency = item.urgency;
                  // Reserve red/amber/green strictly for urgency signals
                  const urgencyBadgeClass =
                    itemUrgency === 'high'
                      ? 'bg-[#DC2626] text-white'
                      : itemUrgency === 'medium'
                      ? 'bg-[#F59E0B] text-slate-950 font-bold'
                      : 'bg-[#059669] text-white';

                  return (
                    <div
                      key={index}
                      className="card-surface p-5 sm:p-6 text-left flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Left side: Icon + Step number + Step Text */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#312E81]/10 text-[#312E81]">
                            {getActionItemIcon(item.text)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#312E81] text-[14px] font-bold text-white">
                                {index + 1}
                              </span>
                              <span className="text-[16px] font-bold uppercase tracking-wider text-slate-500">
                                Step {index + 1}
                              </span>
                            </div>

                            <p className="mt-2 text-[18px] sm:text-[20px] font-bold text-[#312E81] leading-snug">
                              {item.text}
                            </p>
                          </div>
                        </div>

                        {/* Right side: Urgency badge */}
                        <div className="shrink-0 flex flex-col items-end gap-2">
                          <span className={`rounded-[6px] px-2.5 py-1 text-[14px] font-bold uppercase tracking-wide ${urgencyBadgeClass}`}>
                            {itemUrgency}
                          </span>
                        </div>
                      </div>

                      {/* Deadline Tag & Listen Step Button */}
                      <div className="mt-2 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        {item.deadline ? (
                          <div className="flex items-center gap-2 text-[16px] font-bold text-slate-700">
                            <Calendar className="h-4 w-4 text-[#312E81]" strokeWidth={2.2} />
                            <span>Deadline: {item.deadline}</span>
                          </div>
                        ) : (
                          <div className="text-[16px] text-slate-500">Standard timeline</div>
                        )}

                        <button
                          onClick={() => speakText(item.text)}
                          className={`flex items-center gap-1.5 rounded-[8px] px-3.5 py-1.5 text-[16px] font-bold transition-all duration-150 active:scale-95 ${
                            isItemSpeaking
                              ? 'bg-[#0D9488] text-white'
                              : 'border border-[#312E81]/20 bg-white text-[#312E81] hover:bg-[#312E81]/5'
                          }`}
                        >
                          {isItemSpeaking ? (
                            <>
                              <VolumeX className="h-4 w-4" strokeWidth={2} />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-4 w-4" strokeWidth={2} />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION C: Key Terms Decoded — Clean white cards, no glassmorphism */}
            <section className="flex flex-col gap-4 text-left">
              <div>
                <h2 className="text-[22px] font-bold text-[#312E81]">
                  {language === 'hi' ? 'कठिन शब्दों का सरल अर्थ' : 'Key Terms Decoded'}
                </h2>
                <p className="mt-1 text-[18px] text-slate-600">
                  {result.glossary.length} legal terms decoded into plain language:
                </p>
              </div>

              {result.glossary.length === 0 ? (
                <div className="card-surface p-5 text-left">
                  <p className="text-[18px] text-slate-600">No complex legal jargon detected in this notice.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {result.glossary.map((entry, idx) => {
                    const isExpanded = expandedGlossary[idx] ?? true;
                    const feedback = feedbackGiven[entry.term];

                    return (
                      <div key={idx} className="card-surface overflow-hidden text-left">
                        <button
                          onClick={() => setExpandedGlossary(prev => ({ ...prev, [idx]: !isExpanded }))}
                          className="flex w-full items-center justify-between p-5 text-left font-bold text-[#312E81] hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-[18px]">"{entry.term}"</span>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-slate-400" strokeWidth={2} />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400" strokeWidth={2} />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-slate-100 bg-slate-50/70 p-5 text-left">
                            <span className="text-[16px] font-bold text-[#312E81] block mb-1">
                              Everyday Plain Meaning:
                            </span>
                            <p className="text-[18px] text-slate-700 leading-relaxed">
                              {entry.plainMeaning}
                            </p>

                            {/* Glossary Feedback 👍 / 👎 */}
                            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[16px] text-slate-600">
                              <span>Was this explanation clear?</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleFeedback(entry.term, entry.plainMeaning, true)}
                                  className={`flex items-center gap-1 rounded-[6px] px-2.5 py-1 text-[16px] font-semibold transition-all ${
                                    feedback === 'up'
                                      ? 'bg-[#0D9488] text-white'
                                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <ThumbsUp className="h-4 w-4" strokeWidth={2} />
                                  <span>Clear</span>
                                </button>
                                <button
                                  onClick={() => handleFeedback(entry.term, entry.plainMeaning, false)}
                                  className={`flex items-center gap-1 rounded-[6px] px-2.5 py-1 text-[16px] font-semibold transition-all ${
                                    feedback === 'down'
                                      ? 'bg-slate-700 text-white'
                                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <ThumbsDown className="h-4 w-4" strokeWidth={2} />
                                  <span>Confusing</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* SECTION D: Grounded Document Follow-up Q&A */}
            <section className="card-surface p-6 sm:p-8 text-left">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="h-6 w-6 text-[#312E81]" strokeWidth={2.2} />
                <h3 className="text-[22px] font-bold text-[#312E81]">
                  Ask a Question About This Document
                </h3>
              </div>
              <p className="mt-1 text-[18px] text-slate-600 leading-relaxed">
                Answers are strictly grounded in the verified text of this specific notice.
              </p>

              {/* Q&A Thread */}
              {qaHistory.length > 0 && (
                <div className="mt-5 flex flex-col gap-3">
                  {qaHistory.map((item, i) => (
                    <div key={i} className="rounded-[12px] bg-slate-50 border border-slate-200 p-4 text-left">
                      <div className="text-[18px] font-bold text-[#312E81]">Q: {item.q}</div>
                      <div className="mt-1 text-[18px] text-slate-700 leading-relaxed">A: {item.a}</div>
                    </div>
                  ))}
                </div>
              )}

              {qaError && (
                <div className="mt-4 rounded-[12px] border border-[#DC2626]/30 bg-red-50 p-4 text-[16px] text-[#DC2626]">
                  {qaError}
                </div>
              )}

              <form onSubmit={handleAskQuestion} className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What is the deadline to file a reply?"
                  className="flex-1 rounded-[12px] border-2 border-slate-300 bg-white px-4 py-3.5 text-[18px] text-slate-900 placeholder:text-slate-400 focus:border-[#312E81] focus:outline-none min-h-[56px]"
                />
                <button
                  type="submit"
                  disabled={isAnswering || !question.trim()}
                  className="btn-primary sm:w-auto shrink-0"
                >
                  {isAnswering ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.2} />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" strokeWidth={2.2} />
                      <span>Ask Question</span>
                    </>
                  )}
                </button>
              </form>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
