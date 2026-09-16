import fs from 'fs';
import path from 'path';

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIChatSession {
  id: string;
  sessionNumber: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  messageCount: number;
  intent: string;
  summary: string;
  materialsDiscussed: string[];
  materialsSuggested: string[];
  customerContact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  followUpRecommendation: string;
  status: 'new' | 'reviewed' | 'contacted' | 'archived';
  messages: AIChatMessage[];
  lastUpdated: string;
}

const CHATS_FILE_PATHS = [
  path.join(process.cwd(), 'data', 'chats.json'),
  'e:/acespaces/data/chats.json',
  'e:/ace-spaces-recreate-a-premium-architectural/data/chats.json',
];

function getChatsFilePath(): string {
  for (const p of CHATS_FILE_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  return CHATS_FILE_PATHS[0];
}

export function getAllChatSessions(): AIChatSession[] {
  try {
    const filePath = getChatsFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) || [];
    }
  } catch (err) {
    console.error('Error reading chats.json:', err);
  }
  return [];
}

export function saveChatSession(session: AIChatSession): AIChatSession {
  try {
    const filePath = getChatsFilePath();
    let sessions = getAllChatSessions();

    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = {
        ...sessions[existingIndex],
        ...session,
        lastUpdated: new Date().toISOString(),
      };
    } else {
      sessions.unshift({
        ...session,
        lastUpdated: new Date().toISOString(),
      });
    }

    fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2), 'utf8');
    return session;
  } catch (err) {
    console.error('Error saving chat session:', err);
    return session;
  }
}

export function updateChatSessionStatus(
  id: string,
  status: AIChatSession['status']
): AIChatSession | null {
  try {
    const filePath = getChatsFilePath();
    let sessions = getAllChatSessions();
    const session = sessions.find((s) => s.id === id);
    if (session) {
      session.status = status;
      session.lastUpdated = new Date().toISOString();
      fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2), 'utf8');
      return session;
    }
  } catch (err) {
    console.error('Error updating chat status:', err);
  }
  return null;
}

export function deleteChatSession(id: string): boolean {
  try {
    const filePath = getChatsFilePath();
    let sessions = getAllChatSessions();
    const filtered = sessions.filter((s) => s.id !== id);
    if (filtered.length !== sessions.length) {
      fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf8');
      return true;
    }
  } catch (err) {
    console.error('Error deleting chat session:', err);
  }
  return false;
}
