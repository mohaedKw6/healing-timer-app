'use client';

import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { AppSettings, getSettings, saveSettings } from '@/lib/storage';

interface MusicPlayerProps {
  mode: 'encourage' | 'sad' | 'endtime' | null;
}

const emptySubscribe = () => () => {};

export default function MusicPlayer({ mode }: MusicPlayerProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') return { volume: 0.3, muted: true };
    return getSettings();
  });
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const initializedRef = useRef(false);

  const createAmbientSound = useCallback(() => {
    if (!audioContextRef.current) return;

    // Clean up existing oscillators
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    oscillatorsRef.current = [];

    const ctx = audioContextRef.current;
    const masterGain = gainNodeRef.current!;
    
    const currentMode = mode || 'sad';

    const configs: Record<string, { freqs: number[]; type: OscillatorType; detune: number }> = {
      encourage: {
        freqs: [220, 277.18, 329.63, 440],
        type: 'sine',
        detune: 5,
      },
      sad: {
        freqs: [196, 233.08, 293.66, 392],
        type: 'sine',
        detune: 3,
      },
      endtime: {
        freqs: [174.61, 207.65, 261.63, 349.23],
        type: 'triangle',
        detune: 7,
      },
    };

    const config = configs[currentMode];

    config.freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = config.type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.setValueAtTime(config.detune * (i + 1), ctx.currentTime);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1 + i * 0.05, ctx.currentTime);
      lfoGain.gain.setValueAtTime(2 + i, ctx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(0.06 / (i + 1), ctx.currentTime + 3);
      
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      
      oscillatorsRef.current.push(osc, lfo);
    });

    // Subtle noise layer
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.003;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, ctx.currentTime);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();
  }, [mode]);

  const initAudio = useCallback(() => {
    if (initializedRef.current) return;
    
    const ctx = new AudioContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(settings.muted ? 0 : settings.volume, ctx.currentTime);
    
    audioContextRef.current = ctx;
    gainNodeRef.current = gainNode;
    initializedRef.current = true;
    
    createAmbientSound();
  }, [settings.muted, settings.volume, createAmbientSound]);

  useEffect(() => {
    if (initializedRef.current && audioContextRef.current) {
      createAmbientSound();
    }
  }, [mode, createAmbientSound]);

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        settings.muted ? 0 : settings.volume,
        audioContextRef.current.currentTime
      );
    }
  }, [settings.volume, settings.muted]);

  const toggleMute = () => {
    if (!initializedRef.current) {
      initAudio();
      const newSettings = { ...settings, muted: false };
      setSettings(newSettings);
      saveSettings(newSettings);
      return;
    }
    
    const newSettings = { ...settings, muted: !settings.muted };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    const newSettings = { ...settings, volume, muted: volume === 0 };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="text-zinc-500 hover:text-zinc-300 transition-colors p-2 rounded-lg hover:bg-zinc-900/50"
        aria-label={settings.muted ? 'تشغيل الصوت' : 'كتم الصوت'}
      >
        {settings.muted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4 text-zinc-300" />
        )}
      </button>
      {!settings.muted && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-zinc-400 [&::-webkit-slider-thumb]:rounded-full"
        />
      )}
    </div>
  );
}
