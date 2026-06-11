'use client';

import { useState, useSyncExternalStore } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { Note, getNotes, addNote, deleteNote } from '@/lib/storage';

interface NotesSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export default function NotesSection({ isOpen, onClose }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window === 'undefined') return [];
    return getNotes();
  });
  const [newNote, setNewNote] = useState('');
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updated = addNote(newNote.trim());
    setNotes(updated);
    setNewNote('');
  };

  const handleDeleteNote = (id: string) => {
    const updated = deleteNote(id);
    setNotes(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

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
        <FileText className="w-5 h-5 text-zinc-400" />
        <h2 className="text-white font-arabic font-bold">ملاحظاتي</h2>
        <span className="text-zinc-600 text-xs font-arabic">({notes.length})</span>
      </div>

      {/* Add note input */}
      <div className="p-4 border-b border-zinc-800/30">
        <div className="flex gap-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب ملاحظة..."
            className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 resize-none font-arabic focus:outline-none focus:border-zinc-600 min-h-[44px]"
            rows={2}
            dir="rtl"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white rounded-xl p-3 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center self-end"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {!mounted && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
          </div>
        )}
        {mounted && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
            <FileText className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-arabic text-sm">لا توجد ملاحظات بعد</p>
            <p className="font-arabic text-xs mt-1">اكتب أول ملاحظة فوق!</p>
          </div>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4 group"
          >
            <div className="flex justify-between items-start gap-2">
              <p className="text-sm text-zinc-200 font-arabic leading-relaxed whitespace-pre-wrap flex-1">
                {note.content}
              </p>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-zinc-700 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[9px] text-zinc-700 mt-2 block font-arabic">
              {new Date(note.createdAt).toLocaleDateString('ar-EG', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
