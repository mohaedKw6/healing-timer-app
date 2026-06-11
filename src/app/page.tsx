'use client';

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';
import { Settings, FileText, Target } from 'lucide-react';
import Timer from '@/components/Timer';
import ChatInterface from '@/components/ChatInterface';
import NotesSection from '@/components/NotesSection';
import MissionsSection from '@/components/MissionsSection';
import MusicPlayer from '@/components/MusicPlayer';
import SettingsPanel from '@/components/SettingsPanel';
import RemindersPanel from '@/components/RemindersPanel';

// Rain drops component - generate drops with useMemo to avoid setState in effect
function RainEffect() {
  const drops = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${0.8 + Math.random() * 1.2}s`,
      delay: `${Math.random() * 3}s`,
      height: `${15 + Math.random() * 25}px`,
      opacity: 0.1 + Math.random() * 0.2,
    })),
  []);

  return (
    <div className="rain-container">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="raindrop"
          style={{
            left: drop.left,
            animationDuration: drop.duration,
            animationDelay: drop.delay,
            height: drop.height,
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  );
}

const emptySubscribe = () => () => {};

type ActiveView = 'home' | 'chat-encourage' | 'chat-sad' | 'endtime' | 'notes' | 'missions';

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [bgImage, setBgImage] = useState(1);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    // Rotate background images slowly
    const interval = setInterval(() => {
      setBgImage(prev => (prev % 3) + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleClose = useCallback(() => {
    setActiveView('home');
  }, []);

  const handleBack = useCallback(() => {
    setActiveView('home');
  }, []);

  // Determine current mode for music
  const currentMode = activeView === 'chat-encourage' ? 'encourage'
    : activeView === 'chat-sad' ? 'sad'
    : activeView === 'endtime' ? 'endtime'
    : null;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden" dir="rtl">
      {/* Background image */}
      <div
        className="bg-image-overlay transition-opacity duration-[5000ms]"
        style={{
          backgroundImage: `url(/bg${bgImage}.png)`,
          opacity: 0.06,
        }}
      />

      {/* Rain effect */}
      {mounted && <RainEffect />}

      {/* Fog overlay */}
      <div className="fog-overlay" />

      {/* Main content */}
      <div className="relative z-10">
        {/* Music player - always visible */}
        <div className="fixed top-3 left-3 z-40">
          <MusicPlayer mode={currentMode} />
        </div>

        {/* Settings button - always visible */}
        <div className="fixed top-3 right-3 z-40">
          <SettingsButton />
        </div>

        {/* Home view */}
        {activeView === 'home' && (
          <div className="flex flex-col min-h-screen animate-fade-in">
            {/* Timer at top */}
            <header className="pt-12 pb-4 px-4">
              <Timer />
            </header>

            {/* Main content area */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
              {/* Three main action buttons */}
              <div className="w-full max-w-md space-y-4 mt-4">
                {/* Encourage button */}
                <button
                  onClick={() => setActiveView('chat-encourage')}
                  className="w-full btn-glow-green bg-gradient-to-l from-emerald-900/40 to-emerald-950/60 border border-emerald-800/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:from-emerald-900/50 hover:to-emerald-950/70 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-14 h-14 rounded-xl bg-emerald-900/50 border border-emerald-700/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    💪
                  </div>
                  <div className="text-right flex-1">
                    <h2 className="text-lg font-bold text-emerald-300 font-arabic glow-text-green">تشجيع</h2>
                    <p className="text-xs text-emerald-500/70 font-arabic mt-0.5">كلمات قوية ومهمات يومية عشان تفضل ماشي</p>
                  </div>
                  <div className="text-emerald-600/30 text-3xl group-hover:text-emerald-500/50 transition-colors">←</div>
                </button>

                {/* Sad button */}
                <button
                  onClick={() => setActiveView('chat-sad')}
                  className="w-full btn-glow-blue bg-gradient-to-l from-blue-900/40 to-blue-950/60 border border-blue-800/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:from-blue-900/50 hover:to-blue-950/70 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-900/50 border border-blue-700/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    💔
                  </div>
                  <div className="text-right flex-1">
                    <h2 className="text-lg font-bold text-blue-300 font-arabic glow-text-blue">زعلان</h2>
                    <p className="text-xs text-blue-500/70 font-arabic mt-0.5">شات آمن تعبر فيه عن زعلك من غير حكم</p>
                  </div>
                  <div className="text-blue-600/30 text-3xl group-hover:text-blue-500/50 transition-colors">←</div>
                </button>

                {/* End Time button */}
                <button
                  onClick={() => setActiveView('endtime')}
                  className="w-full btn-glow-red bg-gradient-to-l from-red-900/40 to-red-950/60 border border-red-800/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:from-red-900/50 hover:to-red-950/70 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="w-14 h-14 rounded-xl bg-red-900/50 border border-red-700/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🔴
                  </div>
                  <div className="text-right flex-1">
                    <h2 className="text-lg font-bold text-red-300 font-arabic glow-text-red">انهاء الوقت</h2>
                    <p className="text-xs text-red-500/70 font-arabic mt-0.5">تذكيرات قوية ليه لازم تفضل قوي ومش ترجع</p>
                  </div>
                  <div className="text-red-600/30 text-3xl group-hover:text-red-500/50 transition-colors">←</div>
                </button>
              </div>

              {/* Quick action buttons */}
              <div className="w-full max-w-md flex gap-3 mt-8">
                <button
                  onClick={() => setActiveView('notes')}
                  className="flex-1 bg-zinc-900/40 border border-zinc-800/30 rounded-xl p-3 flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-arabic">ملاحظات</span>
                </button>
                <button
                  onClick={() => setActiveView('missions')}
                  className="flex-1 bg-zinc-900/40 border border-zinc-800/30 rounded-xl p-3 flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-all"
                >
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-arabic">مهمات</span>
                </button>
              </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center">
              <p className="text-zinc-800 text-[10px] font-arabic">مرّ من الوقت — أنت أقوى مما تتخيل 🖤</p>
            </footer>
          </div>
        )}

        {/* Chat views */}
        {activeView === 'chat-encourage' && (
          <ChatInterface mode="encourage" onClose={handleClose} onBack={handleBack} />
        )}
        {activeView === 'chat-sad' && (
          <ChatInterface mode="sad" onClose={handleClose} onBack={handleBack} />
        )}
        {activeView === 'endtime' && (
          <RemindersPanel isOpen={true} onClose={handleClose} />
        )}
        {activeView === 'notes' && (
          <NotesSection isOpen={true} onClose={handleClose} />
        )}
        {activeView === 'missions' && (
          <MissionsSection isOpen={true} onClose={handleClose} />
        )}
      </div>
    </div>
  );
}

// Settings button component
function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-zinc-500 hover:text-zinc-300 transition-colors p-2 rounded-lg hover:bg-zinc-900/50"
        aria-label="الإعدادات"
      >
        <Settings className="w-4 h-4" />
      </button>
      <SettingsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
