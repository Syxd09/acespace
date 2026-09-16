'use client';

export const REALTIME_CHANNEL_NAME = 'acespaces_realtime_leads';

export interface RealtimeEvent {
  type:
    | 'ORDER_UPDATED'
    | 'ORDER_SUBMITTED'
    | 'ORDER_DELETED'
    | 'INQUIRY_CREATED'
    | 'INQUIRY_UPDATED'
    | 'INQUIRY_DELETED'
    | 'DISPATCH_CREATED'
    | 'DISPATCH_DELETED'
    | 'CONTENT_UPDATED'
    | 'CHAT_SESSION_CREATED'
    | 'CHAT_SESSION_UPDATED'
    | 'CHAT_SESSION_DELETED';
  payload?: any;
  timestamp: number;
}

export function broadcastRealtimeEvent(type: RealtimeEvent['type'], payload?: any): void {
  if (typeof window === 'undefined') return;

  const event: RealtimeEvent = {
    type,
    payload,
    timestamp: Date.now(),
  };

  try {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(REALTIME_CHANNEL_NAME);
      channel.postMessage(event);
      channel.close();
    }
  } catch (err) {
    console.debug('BroadcastChannel send error:', err);
  }

  try {
    localStorage.setItem('acespaces_realtime_event', JSON.stringify(event));
  } catch (err) {
    console.debug('localStorage event error:', err);
  }
}
