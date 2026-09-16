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

const localDir = path.join(process.cwd(), 'data');
const localDataPath = path.join(localDir, 'chats.json');
const vercelTmpPath = path.join('/tmp', 'acespaces-chats.json');

function getChatsFilePath(): string {
  if (process.env.VERCEL) {
    if (fs.existsSync(vercelTmpPath)) return vercelTmpPath;
    if (fs.existsSync(localDataPath)) return localDataPath;
    return vercelTmpPath;
  }
  return localDataPath;
}

function writeChatsData(data: AIChatSession[]): void {
  const payload = JSON.stringify(data, null, 2);
  let written = false;

  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.writeFileSync(localDataPath, payload, 'utf8');
    written = true;
  } catch {
    // Read-only filesystem on Vercel Serverless
  }

  if (!written || process.env.VERCEL) {
    try {
      fs.writeFileSync(vercelTmpPath, payload, 'utf8');
    } catch (err) {
      console.warn('Failed to write /tmp backup for chats.json:', err);
    }
  }
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

    writeChatsData(sessions);
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
  const VALID_STATUSES: AIChatSession['status'][] = ['new', 'reviewed', 'contacted', 'archived'];
  if (!VALID_STATUSES.includes(status)) {
    return null;
  }

  try {
    let sessions = getAllChatSessions();
    const session = sessions.find((s) => s.id === id);
    if (session) {
      session.status = status;
      session.lastUpdated = new Date().toISOString();
      writeChatsData(sessions);
      return session;
    }
  } catch (err) {
    console.error('Error updating chat status:', err);
  }
  return null;
}

export function deleteChatSession(id: string): boolean {
  try {
    let sessions = getAllChatSessions();
    const filtered = sessions.filter((s) => s.id !== id);
    if (filtered.length !== sessions.length) {
      writeChatsData(filtered);
      return true;
    }
  } catch (err) {
    console.error('Error deleting chat session:', err);
  }
  return false;
}
