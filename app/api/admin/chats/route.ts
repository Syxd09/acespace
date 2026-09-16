import { NextRequest, NextResponse } from 'next/server';
import {
  getAllChatSessions,
  updateChatSessionStatus,
  deleteChatSession,
} from '@/data/chatStore';
import { broadcastRealtimeEvent } from '@/lib/realtime';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessions = getAllChatSessions();

    const metrics = {
      total: sessions.length,
      new: sessions.filter((s) => s.status === 'new').length,
      reviewed: sessions.filter((s) => s.status === 'reviewed').length,
      contacted: sessions.filter((s) => s.status === 'contacted').length,
      withRecommendations: sessions.filter(
        (s) => s.materialsSuggested && s.materialsSuggested.length > 0
      ).length,
    };

    return NextResponse.json({
      sessions,
      metrics,
    });
  } catch (err: any) {
    console.error('Error fetching admin chat sessions:', err);
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'id and status are required' },
        { status: 400 }
      );
    }
    const VALID_STATUSES: ('new' | 'reviewed' | 'contacted' | 'archived')[] = [
      'new',
      'reviewed',
      'contacted',
      'archived',
    ];
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = updateChatSessionStatus(id, status);
    if (updated) {
      broadcastRealtimeEvent('CHAT_SESSION_UPDATED', updated);
      return NextResponse.json({ success: true, session: updated });
    }

    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update session' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id parameter is required' },
        { status: 400 }
      );
    }

    const deleted = deleteChatSession(id);
    if (deleted) {
      broadcastRealtimeEvent('CHAT_SESSION_DELETED', { id });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Session not found or already deleted' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete session' },
      { status: 500 }
    );
  }
}
