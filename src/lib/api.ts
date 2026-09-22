import { SimplifyResult } from '../types';
import { getOrCreateDeviceId } from './storage';

export interface SimplifyApiResponse {
  result: SimplifyResult;
  requestLatencyMs?: number;
  warning?: string;
}

export async function requestDocumentSimplification(
  ocrText: string,
  language: 'en' | 'hi' = 'en'
): Promise<SimplifyApiResponse> {
  // Verify online connection first
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('OFFLINE_NETWORK_ERROR: You are currently offline. Document saved to local queue.');
  }

  const deviceId = getOrCreateDeviceId();
  const response = await fetch('/api/simplify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-device-id': deviceId,
    },
    body: JSON.stringify({
      ocrText,
      language,
    }),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to simplify document';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.error || errorJson.details || errorMsg;
    } catch {
      errorMsg = `Server returned status ${response.status}`;
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  if (!data.success || !data.result) {
    throw new Error(data.error || 'Invalid response from simplification server');
  }

  return {
    result: data.result as SimplifyResult,
    requestLatencyMs: data.requestLatencyMs,
    warning: data.warning,
  };
}

export async function submitGlossaryFeedback(
  term: string,
  plainMeaning: string,
  wasHelpful: boolean
): Promise<boolean> {
  try {
    const deviceId = getOrCreateDeviceId();
    const response = await fetch('/api/glossary/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': deviceId,
      },
      body: JSON.stringify({ term, plainMeaning, wasHelpful }),
    });
    return response.ok;
  } catch (err) {
    console.warn('Could not submit feedback:', err);
    return false;
  }
}

export interface ImpactStats {
  totalDocumentsSimplified: number;
  totalUniqueGlossaryTerms: number;
  topRiskReasons: Array<{ reason: string; count: number }>;
  feedbackHelpfulCount: number;
  cachedAt: string;
}

export async function fetchImpactStats(): Promise<ImpactStats | null> {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function syncHistoryToCloud(scans: any[], authToken?: string): Promise<{ success: boolean; syncedCount: number }> {
  const deviceId = getOrCreateDeviceId();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-device-id': deviceId,
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch('/api/history/sync', {
    method: 'POST',
    headers,
    body: JSON.stringify({ scans }),
  });

  if (!res.ok) {
    throw new Error('Sync failed with status ' + res.status);
  }

  return await res.json();
}

export async function askDocumentFollowUp(
  question: string,
  ocrText: string,
  tldr: string,
  language: 'en' | 'hi' = 'en'
): Promise<string> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('You are currently offline. Connect to internet to ask questions.');
  }

  const response = await fetch('/api/ask-followup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      ocrText,
      tldr,
      language,
    }),
  });

  if (!response.ok) {
    let msg = 'Failed to get answer';
    try {
      const err = await response.json();
      msg = err.error || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const data = await response.json();
  return data.answer || 'No response available.';
}
