import React, { useState } from 'react';
import { Camera, History, Settings, Wifi, WifiOff, Download, HelpCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface NavbarProps {
  currentScreen: 'home' | 'history' | 'settings';
  onNavigate: (screen: 'home' | 'history' | 'settings') => void;
  isOnline: boolean;
  historyCount: number;
  onOpenPitchGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  isOnline,
  historyCount,
  onOpenPitchGuide,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 w-full bg-[#FAF7F2] border-b border-[#312E81]/10">
        <div className="mx-auto flex h-18 max-w-2xl items-center justify-between px-5">
          {/* Brand Logo & Name */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left focus:outline-none active:scale-[0.98] transition-transform duration-150"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#312E81] text-white shadow-sm">
              <span className="text-[20px] font-bold">स</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[22px] font-bold tracking-tight text-[#312E81]">
                  Saral
                </span>
                <span className="rounded-[6px] bg-[#312E81]/10 px-2 py-0.5 text-[16px] font-semibold text-[#312E81]">
                  Offline
                </span>
              </div>
            </div>
          </button>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Online Status: Neutral / Teal - no green/amber to avoid conflicting with risk signals */}
            <div
              className={`flex items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-[16px] font-medium border ${
                isOnline
                  ? 'border-[#0D9488]/30 bg-[#0D9488]/10 text-[#0D9488]'
                  : 'border-[#312E81]/20 bg-[#312E81]/5 text-[#312E81]'
              }`}
              title={isOnline ? 'Online' : 'Offline Mode (Local OCR)'}
            >
              {isOnline ? <Wifi className="h-4 w-4" strokeWidth={2} /> : <WifiOff className="h-4 w-4" strokeWidth={2} />}
              <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* PWA Install */}
            {!isInstalled && isInstallable && (
              <button
                onClick={install}
                className="flex items-center gap-1.5 rounded-[8px] bg-[#312E81] px-3 py-1.5 text-[16px] font-semibold text-white active:scale-95 transition-all duration-150"
              >
                <Download className="h-4 w-4" strokeWidth={2} />
                <span className="hidden sm:inline">Install</span>
              </button>
            )}

            {!isInstalled && isIOS && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="flex items-center gap-1.5 rounded-[8px] border border-[#312E81] bg-white px-3 py-1.5 text-[16px] font-semibold text-[#312E81] active:scale-95 transition-all duration-150"
              >
                <Download className="h-4 w-4" strokeWidth={2} />
                <span className="hidden sm:inline">Install</span>
              </button>
            )}

            {/* Pitch Guide */}
            <button
              onClick={onOpenPitchGuide}
              className="flex items-center gap-1.5 rounded-[8px] border border-[#312E81]/20 bg-white px-3 py-1.5 text-[16px] font-semibold text-[#312E81] hover:bg-[#312E81]/5 active:scale-95 transition-all duration-150"
              title="View Hackathon Demo Guide"
            >
              <HelpCircle className="h-4 w-4" strokeWidth={2} />
              <span className="hidden sm:inline">Demo Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* iOS Install Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-none">
          <div className="card-surface w-full max-w-sm p-6 text-left">
            <h3 className="text-[20px] font-bold text-[#312E81]">
              Install Saral on iOS
            </h3>
            <p className="mt-3 text-[16px] text-slate-700 leading-relaxed">
              1. Tap the Share button in Safari.<br />
              2. Scroll down and choose <strong>Add to Home Screen</strong>.<br />
              3. Tap <strong>Add</strong> to use Saral offline anytime.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="btn-primary mt-5 w-full text-[16px] justify-center"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar */}
      {/* 3 icons — Capture (center, largest), History, Settings — each with a text label beneath the icon, never icon-only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#312E81]/15 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="mx-auto flex max-w-2xl items-end justify-around px-4 py-2">
          {/* 1. History */}
          <button
            onClick={() => onNavigate('history')}
            className={`group relative flex flex-1 flex-col items-center justify-center py-1.5 transition-all duration-150 active:scale-95 ${
              currentScreen === 'history' ? 'text-[#312E81]' : 'text-slate-500 hover:text-[#312E81]'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <History className="h-6 w-6" strokeWidth={currentScreen === 'history' ? 2.5 : 2} />
              {historyCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#312E81] px-1 text-[11px] font-bold text-white">
                  {historyCount}
                </span>
              )}
            </div>
            <span
              className={`mt-1 text-[16px] leading-tight ${
                currentScreen === 'history' ? 'font-bold text-[#312E81]' : 'font-normal text-slate-500'
              }`}
            >
              History
            </span>
          </button>

          {/* 2. Capture (Center, Largest) */}
          <button
            onClick={() => onNavigate('home')}
            className="group relative -mt-5 flex flex-1 flex-col items-center justify-center transition-all duration-150 active:scale-95"
          >
            <div
              className={`flex h-15 w-15 items-center justify-center rounded-[16px] shadow-md transition-colors duration-150 ${
                currentScreen === 'home'
                  ? 'bg-[#312E81] text-white'
                  : 'bg-[#312E81] text-white hover:bg-[#26236b]'
              }`}
            >
              <Camera className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <span
              className={`mt-1 text-[16px] leading-tight ${
                currentScreen === 'home' ? 'font-bold text-[#312E81]' : 'font-bold text-slate-700'
              }`}
            >
              Capture
            </span>
          </button>

          {/* 3. Settings */}
          <button
            onClick={() => onNavigate('settings')}
            className={`group relative flex flex-1 flex-col items-center justify-center py-1.5 transition-all duration-150 active:scale-95 ${
              currentScreen === 'settings' ? 'text-[#312E81]' : 'text-slate-500 hover:text-[#312E81]'
            }`}
          >
            <div className="flex items-center justify-center">
              <Settings className="h-6 w-6" strokeWidth={currentScreen === 'settings' ? 2.5 : 2} />
            </div>
            <span
              className={`mt-1 text-[16px] leading-tight ${
                currentScreen === 'settings' ? 'font-bold text-[#312E81]' : 'font-normal text-slate-500'
              }`}
            >
              Settings
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
