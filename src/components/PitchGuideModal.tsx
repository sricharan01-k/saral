import React from 'react';
import { X, CheckCircle2, Award, Zap, Shield, ArrowRight } from 'lucide-react';

interface PitchGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchGuideModal: React.FC<PitchGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="card-surface relative w-full max-w-xl p-6 sm:p-8 text-left">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-[8px] p-2 text-slate-400 hover:text-slate-800 transition active:scale-95"
          title="Close guide"
        >
          <X className="h-6 w-6" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-2 text-[16px] font-bold text-[#312E81]">
          <Award className="h-5 w-5" strokeWidth={2.2} />
          <span className="uppercase tracking-wider">Hackathon Demo Cheatsheet</span>
        </div>

        <h2 className="mt-2 text-[26px] font-bold text-[#312E81] leading-snug">
          The 60-Second Pitch for Saral
        </h2>

        <div className="mt-5 space-y-4 text-[18px] text-slate-700 leading-relaxed max-h-[65vh] overflow-y-auto pr-1">
          {/* Beat 1 */}
          <div className="rounded-[12px] border-2 border-slate-200 bg-[#FAF7F2] p-4 text-left">
            <div className="flex items-center gap-2 text-[16px] font-bold text-[#312E81] uppercase tracking-wider">
              <Zap className="h-4 w-4" strokeWidth={2.2} />
              <span>Beat 1: The Everyday Hook (30s)</span>
            </div>
            <p className="mt-2 text-slate-900 font-medium">
              "Everyone receives intimidating mail — electricity bills with opaque surcharges, confusing municipal property notices, or disconnection threats. Most people freeze or pay blindly."
            </p>
            <p className="mt-2 text-[16px] text-slate-600">
              <strong>Demo action:</strong> Tap the <strong>State Electricity Board</strong> sample notice. Highlight the instant decode: ₹6,800 penalty breakdown, strict 7-day cutoff deadline, and the immediate payment action item.
            </p>
          </div>

          {/* Beat 2 */}
          <div className="rounded-[12px] border-2 border-slate-200 bg-[#FAF7F2] p-4 text-left">
            <div className="flex items-center gap-2 text-[16px] font-bold text-[#312E81] uppercase tracking-wider">
              <Shield className="h-4 w-4" strokeWidth={2.2} />
              <span>Beat 2: The Bigger Impact — Legal Literacy (30s)</span>
            </div>
            <p className="mt-2 text-slate-900 font-medium">
              "Now scale this to underserved citizens facing Section 138 cheque dishonor court summons or RTI appeal rejections. Legalese is a barrier to justice. Saral turns fear into actionable confidence with spoken audio."
            </p>
            <p className="mt-2 text-[16px] text-slate-600">
              <strong>Demo action:</strong> Tap the <strong>Court Legal Notice</strong> sample. Listen to the auto-read <strong>Text-to-Speech</strong> summary so judges hear the low-literacy plain language spoken aloud.
            </p>
          </div>

          {/* Beat 3 */}
          <div className="rounded-[12px] border-2 border-slate-200 bg-[#FAF7F2] p-4 text-left">
            <div className="flex items-center gap-2 text-[16px] font-bold text-[#312E81] uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
              <span>Beat 3: Honest Offline Architecture (30s)</span>
            </div>
            <p className="mt-2 text-slate-900 font-medium">
              "Why PWA? In rural areas or basements, connectivity drops constantly. Camera capture, Tesseract.js OCR, and IndexedDB local cache run 100% offline on the device. Model inference targets on-device Gemini Nano with cloud fallback."
            </p>
            <ul className="mt-2 space-y-1.5 text-[16px] text-slate-600">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#312E81]" />
                <span>Zero cloud lock-in: stored locally in IndexedDB</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#312E81]" />
                <span>Installable as an offline PWA on Android &amp; iOS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#312E81]" />
                <span>Original vs. Simplified view guarantees ground truth &amp; trust</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Primary Action Button: solid indigo, 56px height, 12px radius, icon to left */}
        <button
          onClick={onClose}
          className="btn-primary mt-6 w-full"
        >
          <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
          <span>Close &amp; Return to App</span>
        </button>
      </div>
    </div>
  );
};
