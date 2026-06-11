'use client';

import { useState, useEffect } from 'react';
import { X, Shield, Heart, AlertTriangle, Sparkles } from 'lucide-react';

interface RemindersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const reminders = [
  {
    icon: '🛡️',
    title: 'أنت أقوى مما تتخيل',
    text: 'كل يوم بتعدي بيزيدك قوة. الفراق مش نهاية، ده بداية لحياة أفضل.',
  },
  {
    icon: '💔',
    title: 'مش هترجع للي ضايقك',
    text: 'اللي مش بيشوف قيمتك مش يستاهل مكانك. أنت كنز واللي مش عارف خسارته.',
  },
  {
    icon: '⚡',
    title: 'عنادك هو سلاحك',
    text: 'عشانك عنيد، هتفضل ماشي. العناد مش عيب، العناد قوة لما بتستخدمه صح.',
  },
  {
    icon: '🌟',
    title: 'أنت تستحق الأفضل',
    text: 'مش لازم تقبل بأقل منك. الكون هيديك اللي تستحقه بس الصبر مطلوب.',
  },
  {
    icon: '🔥',
    title: 'الجرح بيلحم',
    text: 'كل ألم بتعيشه بيقويك. بعد سنة هتبص ورا وهتقول الحمد لله.',
  },
  {
    icon: '💪',
    title: 'ماحدش هيعوضك عن نفسك',
    text: 'أنت مش محتاج حد عشان تكمل. أنت كافي لوحدك.',
  },
  {
    icon: '🎯',
    title: 'ركز على نفسك',
    text: 'الطاقة اللي بتصرفها في التفكير فيهم، صرفها في نفسك. النتيجة هتكون مذهلة.',
  },
  {
    icon: '🌹',
    title: 'الحب الحقيقي جاي',
    text: 'لما تحب نفسك الأول، الكون هيبعتلك حد يحبك زي ما تستحق.',
  },
];

const hurtfulReminders = [
  'اللي مش بيقدر وجودك، مش هيفيدك لما ترجعله',
  'الجرح اللي حصل مكان يتنسى، بس ممكن يتعلم منه',
  'رجوعك معناها إنك موافق على الأذن تاني',
  'مفيش حد بيغير، اللي آذك مرة هيأذيك تاني',
  'الفراق كان قرار صح حتى لو كان مؤلم',
  'أنت مش جرب غلط، أنت جرب واتعلم',
];

export default function RemindersPanel({ isOpen, onClose }: RemindersPanelProps) {
  const [showHurtful, setShowHurtful] = useState(false);
  const [aiReminder, setAiReminder] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAiReminder = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'ذكرني ليه لازم أفضل قوي ومش أرجع للي آذاني. اكتب كلام قوي ومؤثر ومختصر.',
          mode: 'endtime',
          history: [],
        }),
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setAiReminder(data.response);
    } catch {
      setAiReminder('أنت أقوى مما تتخيل. لا تنسى أبداً 🛡️');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-900/30 to-black border-b border-red-900/30 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors p-1"
        >
          →
        </button>
        <AlertTriangle className="w-5 h-5 text-red-400" />
        <h2 className="text-white font-arabic font-bold">انهاء الوقت - تذكيرات</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* AI-generated reminder */}
        <div className="bg-gradient-to-br from-red-950/30 to-zinc-950 border border-red-900/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm font-arabic font-bold">تذكير ذكي</span>
          </div>
          {aiReminder ? (
            <p className="text-zinc-200 text-sm font-arabic leading-relaxed whitespace-pre-wrap">{aiReminder}</p>
          ) : (
            <button
              onClick={generateAiReminder}
              disabled={loading}
              className="w-full bg-red-900/30 hover:bg-red-900/50 border border-red-800/30 text-red-300 rounded-xl py-3 text-sm font-arabic transition-all disabled:opacity-50"
            >
              {loading ? 'بولّد تذكير...' : 'ولّد تذكير بالذكاء الاصطناعي ✨'}
            </button>
          )}
          {aiReminder && (
            <button
              onClick={() => { setAiReminder(''); }}
              className="mt-3 text-red-400/60 text-xs font-arabic hover:text-red-400 transition-colors"
            >
              ولّد تذكير جديد ←
            </button>
          )}
        </div>

        {/* Reasons to stay strong */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-emerald-300 font-arabic font-bold text-sm">أسباب تفضل قوي</h3>
          </div>
          <div className="space-y-2">
            {reminders.map((reminder, i) => (
              <div
                key={i}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-3"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{reminder.icon}</span>
                  <div>
                    <h4 className="text-zinc-200 text-sm font-arabic font-bold">{reminder.title}</h4>
                    <p className="text-zinc-400 text-xs font-arabic leading-relaxed mt-1">{reminder.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hurtful reminders */}
        <div>
          <button
            onClick={() => setShowHurtful(!showHurtful)}
            className="flex items-center gap-2 mb-3 text-red-400 hover:text-red-300 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <h3 className="font-arabic font-bold text-sm">اللي نسيته ⚠️</h3>
            <span className="text-[10px] text-red-600">اضغط بحذر</span>
          </button>
          {showHurtful && (
            <div className="space-y-2 animate-in fade-in duration-300">
              {hurtfulReminders.map((text, i) => (
                <div
                  key={i}
                  className="bg-red-950/20 border border-red-900/20 rounded-xl p-3"
                >
                  <p className="text-red-300/80 text-xs font-arabic leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
