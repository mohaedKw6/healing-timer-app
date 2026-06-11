'use client';

import { useState, useSyncExternalStore } from 'react';
import { Target, Trash2, Check, Plus, Sparkles } from 'lucide-react';
import { Mission, getMissions, addMission, toggleMission, deleteMission } from '@/lib/storage';

interface MissionsSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export default function MissionsSection({ isOpen, onClose }: MissionsSectionProps) {
  const [missions, setMissions] = useState<Mission[]>(() => {
    if (typeof window === 'undefined') return [];
    return getMissions();
  });
  const [newMission, setNewMission] = useState('');
  const [generating, setGenerating] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const handleAddMission = () => {
    if (!newMission.trim()) return;
    const updated = addMission(newMission.trim());
    setMissions(updated);
    setNewMission('');
  };

  const handleToggle = (id: string) => {
    const updated = toggleMission(id);
    setMissions(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteMission(id);
    setMissions(updated);
  };

  const handleGenerateMissions = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'أعطني 3 مهمات يومية تشجيعية لشخص بيمر بفترة صعبة بعد فراق. المهمات لازم تكون عملية ومفيدة. اكتب كل مهمة في سطر منفصل وابدأ كل سطر برقم.',
          mode: 'encourage',
          history: [],
        }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      const lines = data.response.split('\n').filter((l: string) => l.trim());
      let updated = getMissions();
      for (const line of lines) {
        const clean = line.replace(/^\d+[\.\)\-]\s*/, '').trim();
        if (clean) {
          updated = addMission(clean);
        }
      }
      setMissions(updated);
    } catch (error) {
      console.error('Generate missions error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const completedCount = missions.filter(m => m.completed).length;
  const totalCount = missions.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-b from-zinc-900/30 to-black border-b border-zinc-800/50 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors p-1"
        >
          →
        </button>
        <Target className="w-5 h-5 text-emerald-400" />
        <h2 className="text-white font-arabic font-bold">مهماتي</h2>
        {totalCount > 0 && (
          <span className="text-zinc-600 text-xs font-arabic">
            ({completedCount}/{totalCount})
          </span>
        )}
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="px-4 pt-3">
          <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-emerald-500 to-emerald-700 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {completedCount === totalCount && totalCount > 0 && (
            <p className="text-emerald-400 text-xs font-arabic mt-2 text-center">
              🎉 ماشاء الله! خلصت كل المهمات! أنت بطل!
            </p>
          )}
        </div>
      )}

      {/* Add mission + Generate */}
      <div className="p-4 border-b border-zinc-800/30 space-y-2">
        <div className="flex gap-2">
          <input
            value={newMission}
            onChange={(e) => setNewMission(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddMission()}
            placeholder="أضف مهمة..."
            className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 font-arabic focus:outline-none focus:border-zinc-600 min-h-[44px]"
            dir="rtl"
          />
          <button
            onClick={handleAddMission}
            disabled={!newMission.trim()}
            className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white rounded-xl p-3 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={handleGenerateMissions}
          disabled={generating}
          className="w-full bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-800/30 text-emerald-300 rounded-xl py-2 px-4 text-sm font-arabic transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {generating ? 'بولّد مهمات...' : 'ولّد مهمات بالذكاء الاصطناعي ✨'}
        </button>
      </div>

      {/* Missions list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {!mounted && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
          </div>
        )}
        {mounted && missions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
            <Target className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-arabic text-sm">لا توجد مهمات بعد</p>
            <p className="font-arabic text-xs mt-1">أضف مهمة أو ولّد مهمات بالذكاء الاصطناعي</p>
          </div>
        )}
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`rounded-xl p-3 flex items-center gap-3 border transition-all group ${
              mission.completed
                ? 'bg-emerald-900/10 border-emerald-800/20'
                : 'bg-zinc-900/60 border-zinc-800/50'
            }`}
          >
            <button
              onClick={() => handleToggle(mission.id)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all min-w-[24px] ${
                mission.completed
                  ? 'bg-emerald-600 border-emerald-500'
                  : 'border-zinc-700 hover:border-emerald-500'
              }`}
            >
              {mission.completed && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
            <span className={`text-sm font-arabic flex-1 leading-relaxed ${
              mission.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'
            }`}>
              {mission.content}
            </span>
            <button
              onClick={() => handleDelete(mission.id)}
              className="text-zinc-700 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
