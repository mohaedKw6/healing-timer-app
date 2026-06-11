'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';

// Target date: May 6, 2026 at 3:53 AM Cairo time (Africa/Cairo)
const TARGET_DATE = new Date('2026-05-06T03:53:00+02:00');

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

function calculateElapsed(): TimeElapsed {
  const now = new Date();
  const diff = now.getTime() - TARGET_DATE.getTime();

  if (diff < 0) {
    return {
      years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0,
      totalDays: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  let years = now.getFullYear() - TARGET_DATE.getFullYear();
  let months = now.getMonth() - TARGET_DATE.getMonth();
  let days = now.getDate() - TARGET_DATE.getDate();
  let hours = now.getHours() - TARGET_DATE.getHours();
  let minutes = now.getMinutes() - TARGET_DATE.getMinutes();
  let seconds = now.getSeconds() - TARGET_DATE.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }

  return {
    years, months, days, hours, minutes, seconds,
    totalDays, totalHours, totalMinutes, totalSeconds,
  };
}

const emptySubscribe = () => () => {};

export default function Timer() {
  const [elapsed, setElapsed] = useState<TimeElapsed>(calculateElapsed);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(calculateElapsed());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-zinc-500 text-sm mb-2 font-arabic">مرّ من الوقت</div>
        <div className="flex gap-2 items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-14 bg-zinc-900 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const timeUnits = [
    { value: elapsed.years, label: 'سنة' },
    { value: elapsed.months, label: 'شهر' },
    { value: elapsed.days, label: 'يوم' },
    { value: elapsed.hours, label: 'ساعة' },
    { value: elapsed.minutes, label: 'دقيقة' },
    { value: elapsed.seconds, label: 'ثانية' },
  ];

  const stats = [
    { value: elapsed.totalDays.toLocaleString('ar-EG'), label: 'إجمالي الأيام' },
    { value: elapsed.totalHours.toLocaleString('ar-EG'), label: 'إجمالي الساعات' },
    { value: elapsed.totalMinutes.toLocaleString('ar-EG'), label: 'إجمالي الدقائق' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      <h1 className="text-zinc-400 text-lg mb-1 font-arabic tracking-wide">مرّ من الوقت</h1>
      <p className="text-zinc-600 text-xs mb-4 font-arabic">منذ ٦ مايو ٢٠٢٦ - ٣:٥٣ صباحاً</p>

      {/* Main timer display */}
      <div className="flex gap-2 sm:gap-3 items-center flex-wrap justify-center mb-4" dir="rtl">
        {timeUnits.map((unit, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="relative w-14 sm:w-16 h-16 sm:h-18 bg-black/60 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/20 to-transparent" />
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white glow-text relative z-10">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-zinc-500 mt-1 font-arabic">{unit.label}</span>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex gap-4 sm:gap-6 flex-wrap justify-center" dir="rtl">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-sm sm:text-base font-mono text-zinc-300">{stat.value}</span>
            <span className="text-[9px] sm:text-[10px] text-zinc-600 font-arabic">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
