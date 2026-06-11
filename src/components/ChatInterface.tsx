'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Message, ChatSession, addMessageToChat, createChatSession, getChats, saveChats } from '@/lib/storage';

interface ChatInterfaceProps {
  mode: 'encourage' | 'sad' | 'endtime';
  onClose: () => void;
  onBack: () => void;
}

const modeConfig = {
  encourage: {
    title: 'تشجيع',
    emoji: '💪',
    accentColor: 'from-emerald-500/20 to-emerald-900/20',
    borderColor: 'border-emerald-800/50',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
    userBubble: 'bg-emerald-900/40 border border-emerald-800/30',
    aiBubble: 'bg-zinc-900/60 border border-zinc-800/50',
    headerBg: 'from-emerald-900/30 to-black',
  },
  sad: {
    title: 'زعلان',
    emoji: '💔',
    accentColor: 'from-blue-500/20 to-blue-900/20',
    borderColor: 'border-blue-800/50',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    userBubble: 'bg-blue-900/40 border border-blue-800/30',
    aiBubble: 'bg-zinc-900/60 border border-zinc-800/50',
    headerBg: 'from-blue-900/30 to-black',
  },
  endtime: {
    title: 'انهاء الوقت',
    emoji: '🔴',
    accentColor: 'from-red-500/20 to-red-900/20',
    borderColor: 'border-red-800/50',
    buttonColor: 'bg-red-600 hover:bg-red-700',
    userBubble: 'bg-red-900/40 border border-red-800/30',
    aiBubble: 'bg-zinc-900/60 border border-zinc-800/50',
    headerBg: 'from-red-900/30 to-black',
  },
};

export default function ChatInterface({ mode, onClose, onBack }: ChatInterfaceProps) {
  const config = modeConfig[mode];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const session = createChatSession(mode);
    setSessionId(session.id);

    // Add initial AI message
    const initialMessages: Record<string, string> = {
      encourage: 'أهلاً يا صديقي 💪 أنا هنا عشانك. أنت إنسان قوي وبتستحق الأفضل. قولي إيه اللي في قلبك وهشجعك وأديك مهمات تخليك أقوى! 🌟',
      sad: 'أهلاً... أنا هنا معاك 💙 لو حاسس بزعل أو حاجة قلقانك، قولي ومحدش هيحكم عليك. أنا سامعك وقلبي معاك. 🤍',
      endtime: '🔴 لا تنسى أبداً ليه وصلت لهنا. أنت أقوى مما تتخيل. لو فكرت ترجع، افتح الشات ده وأنا هذكرك بكل حاجة. قولي إيه اللي بيحصل؟',
    };

    const aiMsg: Message = {
      id: `ai-init-${Date.now()}`,
      role: 'assistant',
      content: initialMessages[mode],
      timestamp: Date.now(),
    };

    setMessages([aiMsg]);
    const updatedSession = { ...session, messages: [aiMsg], updatedAt: Date.now() };
    const chats = getChats();
    const idx = chats.findIndex((c: ChatSession) => c.id === session.id);
    if (idx !== -1) {
      chats[idx] = updatedSession;
      saveChats(chats);
    }
  }, [mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          mode,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMsg]);
      addMessageToChat(sessionId, userMsg);
      addMessageToChat(sessionId, aiMsg);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'آسف، حصلت مشكلة. حاول تاني 🙏',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black" dir="rtl">
      {/* Header */}
      <div className={`bg-gradient-to-b ${config.headerBg} border-b border-zinc-800/50 px-4 py-3 flex items-center gap-3`}>
        <button
          onClick={onBack}
          className="text-zinc-400 hover:text-white transition-colors p-1"
        >
          →
        </button>
        <span className="text-2xl">{config.emoji}</span>
        <div>
          <h2 className="text-white font-arabic font-bold">{config.title}</h2>
          <p className="text-zinc-500 text-xs font-arabic">شات ذكي - أنا معاك</p>
        </div>
        <button
          onClick={onClose}
          className="mr-auto text-zinc-500 hover:text-white transition-colors text-xl"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' ? config.userBubble : config.aiBubble
              }`}
            >
              <p className="text-sm text-zinc-100 font-arabic leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
              <span className="text-[9px] text-zinc-600 mt-1 block font-arabic">
                {new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-end">
            <div className={`rounded-2xl px-4 py-3 ${config.aiBubble}`}>
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800/50 p-3 bg-black/80">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالتك..."
            className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 resize-none font-arabic focus:outline-none focus:border-zinc-600 min-h-[44px] max-h-32"
            rows={1}
            dir="rtl"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={`${config.buttonColor} disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 rotate-180" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
