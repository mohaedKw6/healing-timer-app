export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  mode: 'encourage' | 'sad' | 'endtime';
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Note {
  id: string;
  content: string;
  createdAt: number;
}

export interface Mission {
  id: string;
  content: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

const CHATS_KEY = 'healing-app-chats';
const NOTES_KEY = 'healing-app-notes';
const MISSIONS_KEY = 'healing-app-missions';
const SETTINGS_KEY = 'healing-app-settings';

export interface AppSettings {
  volume: number;
  muted: boolean;
}

// Chat storage
export function getChats(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CHATS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveChats(chats: ChatSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  } catch (e) {
    console.error('Failed to save chats:', e);
  }
}

export function addMessageToChat(sessionId: string, message: Message): ChatSession[] {
  const chats = getChats();
  const session = chats.find(c => c.id === sessionId);
  if (session) {
    session.messages.push(message);
    session.updatedAt = Date.now();
  }
  saveChats(chats);
  return chats;
}

export function createChatSession(mode: 'encourage' | 'sad' | 'endtime'): ChatSession {
  const session: ChatSession = {
    id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    mode,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const chats = getChats();
  chats.unshift(session);
  saveChats(chats);
  return session;
}

export function clearAllChats(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CHATS_KEY);
}

export function exportChats(): string {
  const chats = getChats();
  return JSON.stringify(chats, null, 2);
}

// Notes storage
export function getNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes:', e);
  }
}

export function addNote(content: string): Note[] {
  const notes = getNotes();
  const note: Note = {
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content,
    createdAt: Date.now(),
  };
  notes.unshift(note);
  saveNotes(notes);
  return notes;
}

export function deleteNote(id: string): Note[] {
  const notes = getNotes().filter(n => n.id !== id);
  saveNotes(notes);
  return notes;
}

// Missions storage
export function getMissions(): Mission[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(MISSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMissions(missions: Mission[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
  } catch (e) {
    console.error('Failed to save missions:', e);
  }
}

export function addMission(content: string): Mission[] {
  const missions = getMissions();
  const mission: Mission = {
    id: `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content,
    completed: false,
    createdAt: Date.now(),
  };
  missions.unshift(mission);
  saveMissions(missions);
  return missions;
}

export function toggleMission(id: string): Mission[] {
  const missions = getMissions();
  const mission = missions.find(m => m.id === id);
  if (mission) {
    mission.completed = !mission.completed;
    mission.completedAt = mission.completed ? Date.now() : undefined;
  }
  saveMissions(missions);
  return missions;
}

export function deleteMission(id: string): Mission[] {
  const missions = getMissions().filter(m => m.id !== id);
  saveMissions(missions);
  return missions;
}

// Settings storage
export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return { volume: 0.3, muted: true };
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { volume: 0.3, muted: true };
  } catch {
    return { volume: 0.3, muted: true };
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
