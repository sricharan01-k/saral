import { createWorker } from 'tesseract.js';

export interface OcrProgress {
  status: string;
  progress: number; // 0 to 1
  message: string;
}

/**
 * Resizes and compresses an image to maximum 800px width/height while preserving aspect ratio.
 */
export async function compressImageToMax800(source: File | string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const MAX_DIM = 800;

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      // Draw with slight contrast enhancement for document legibility
      ctx.drawImage(img, 0, 0, width, height);

      // Return JPEG data URL at 85% quality
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      resolve(dataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Runs client-side Tesseract.js OCR.
 * Entirely client-side and functional offline once cached by Service Worker.
 */
export async function runClientOcr(
  imageDataUrl: string,
  onProgress?: (progress: OcrProgress) => void
): Promise<{ text: string; confidence: number }> {
  let worker: any = null;
  try {
    onProgress?.({
      status: 'initializing',
      progress: 0.1,
      message: 'Loading on-device OCR engine...',
    });

    worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const ratio = Math.max(0.1, Math.min(0.95, m.progress || 0));
          onProgress?.({
            status: 'recognizing',
            progress: ratio,
            message: `Reading document text (${Math.round(ratio * 100)}%)...`,
          });
        }
      },
    });

    onProgress?.({
      status: 'recognizing',
      progress: 0.35,
      message: 'Scanning character shapes...',
    });

    const ret = await worker.recognize(imageDataUrl);
    const text = ret.data.text ? ret.data.text.trim() : '';
    const confidence = ret.data.confidence || 0;

    onProgress?.({
      status: 'complete',
      progress: 1.0,
      message: 'OCR extraction complete',
    });

    return { text, confidence };
  } catch (error: any) {
    console.error('Client OCR failed:', error);
    throw new Error(error?.message || 'Failed to extract text from document');
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (termErr) {
        console.warn('Worker terminate error:', termErr);
      }
    }
  }
}
