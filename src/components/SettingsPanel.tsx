'use client';

import { useState, useSyncExternalStore } from 'react';
import { Settings, Volume2, Download, Trash2, X } from 'lucide-react';
import { getSettings, saveSettings, clearAllChats, exportChats, AppSettings } from '@/lib/storage';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') return { volume: 0.3, muted: true };
    return getSettings();
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const handleVolumeChange = (volume: number) => {
    const newSettings = { ...settings, volume, muted: volume === 0 };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleExport = () => {
    const data = exportChats();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healing-app-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearChats = () => {
    clearAllChats();
    setShowConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-zinc-400" />
            <h2 className="text-white font-arabic font-bold">الإعدادات</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Volume */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-zinc-400" />
              <label className="text-sm text-zinc-300 font-arabic">مستوى الصوت</label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={mounted ? settings.volume : 0.3}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-zinc-400 [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>

          {/* Export chats */}
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl text-zinc-300 hover:bg-zinc-800/50 transition-all text-sm font-arabic"
            >
              <Download className="w-4 h-4" />
              تصدير سجل المحادثات
            </button>
          </div>

          {/* Clear chats */}
          <div className="space-y-2">
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center gap-3 p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 hover:bg-red-950/40 transition-all text-sm font-arabic"
              >
                <Trash2 className="w-4 h-4" />
                مسح كل المحادثات
              </button>
            ) : (
              <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-3 space-y-2">
                <p className="text-red-300 text-sm font-arabic">متأكد؟ ده مش هيترجع!</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearChats}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white rounded-lg py-2 text-sm font-arabic transition-all"
                  >
                    أيه، امسح
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg py-2 text-sm font-arabic transition-all"
                  >
                    لا، خلاص
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* App info */}
          <div className="text-center pt-2 border-t border-zinc-800/30">
            <p className="text-zinc-600 text-xs font-arabic">مرّ من الوقت v1.0</p>
            <p className="text-zinc-700 text-[10px] font-arabic mt-1">أنت أقوى مما تتخيل 💪</p>
          </div>
        </div>
      </div>
    </div>
  );
}
