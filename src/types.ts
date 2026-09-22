export type RiskLevel = 'low' | 'medium' | 'high';

export interface ActionItem {
  text: string;
  deadline: string | null;
  urgency: RiskLevel;
}

export interface GlossaryEntry {
  term: string;
  plainMeaning: string;
}

export interface SimplifyResult {
  tldr: string;
  actionItems: ActionItem[];
  glossary: GlossaryEntry[];
  riskLevel: RiskLevel;
  riskReason: string;
}

export type ScanStatus = 'captured' | 'ocr_done' | 'simplifying' | 'done' | 'error';

export interface ScanRecord {
  id: string;
  timestamp: number;
  imageDataUrl: string; // compressed, max 800px wide
  ocrText: string;
  language: 'en' | 'hi';
  result: SimplifyResult | null;
  status: ScanStatus;
  errorMessage?: string;
  title?: string;
}

export interface UserSettings {
  language: 'en' | 'hi';
  largeText: boolean;
}

export interface SampleDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  imageDataUrl: string;
  ocrText: string;
  sampleResultEn: SimplifyResult;
  sampleResultHi: SimplifyResult;
}
