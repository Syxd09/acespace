import { NextRequest, NextResponse } from 'next/server';
import { saveChatSession, AIChatSession, AIChatMessage } from '@/data/chatStore';
import { broadcastRealtimeEvent } from '@/lib/realtime';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getEnvValue(keyName: string): string | null {
  if (process.env[keyName]) return process.env[keyName]!;
  try {
    const candidates = [
      path.join(process.cwd(), '.env.local'),
      path.join(process.cwd(), '.env'),
    ];
    for (const file of candidates) {
      if (fs.existsSync(file)) {
        const text = fs.readFileSync(file, 'utf8');
        const match = text.match(new RegExp(`^${keyName}=(.*)$`, 'm'));
        if (match && match[1]) {
          return match[1].trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  } catch (e) {}
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: AIChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];
    const sessionId: string = body?.sessionId || `chat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const startedAt: string = body?.startedAt || new Date().toISOString();
    const endedAt: string = body?.endedAt || new Date().toISOString();
    const durationSeconds: number = body?.durationSeconds || 0;

    // Filter out welcome-only chats with no user inquiries
    const userMessages = messages.filter((m) => m.role === 'user');
    if (userMessages.length === 0) {
      return NextResponse.json({ skipped: true, reason: 'No user messages' });
    }

    const groqKey = getEnvValue('GROQ_API_KEY') || getEnvValue('AI_API_KEY');
    const groqModel = getEnvValue('AI_MODEL') || 'openai/gpt-oss-120b';

    let summary = '';
    let intent = 'General Architectural Surface Inquiry';
    let materialsDiscussed: string[] = [];
    let materialsSuggested: string[] = [];
    let customerContact: { name?: string; phone?: string; email?: string } = {};
    let followUpRecommendation = 'Review project requirements and connect via WhatsApp.';

    // Try AI-Powered Summarization using Groq
    if (groqKey) {
      try {
        const transcriptText = messages
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join('\n\n');

        const summaryPrompt = `You are the lead architectural specifier analyzing a completed client chat session with Ace Spaces Studio AI in Bengaluru.

Analyze this conversation transcript and extract structured data:
1. Intent: A concise 3-5 word title of the client's goal (e.g., "Kitchen Waterfall Island", "Coro Showroom & Maps Location", "Zero-Silica Safety Query", "Sample Box Request", "Bathroom Vanity Ramp").
2. Summary: A 2-sentence executive summary summarizing what the client asked, what the AI explained, and any specific architectural recommendation provided.
3. Materials Discussed: Array of materials, brands, or collections mentioned (e.g. ["DuPont Corian", "Italian Marble", "Alto Ivory Vein"]).
4. Materials Suggested: Array of better/recommended materials or edge profiles suggested by the AI (e.g. ["Alto / Ivory Vein (12mm)", "Integrated Coved Sink"]).
5. Customer Contact: Any name, phone number, or email detected in the transcript.
6. Follow Up: 1 concise actionable next step for the Ace Spaces studio team.

Output ONLY valid JSON in this exact structure with no extra markdown formatting:
{
  "intent": "string",
  "summary": "string",
  "materialsDiscussed": ["string"],
  "materialsSuggested": ["string"],
  "customerContact": { "name": "string", "phone": "string", "email": "string" },
  "followUp": "string"
}

TRANSCRIPT:
${transcriptText}`;

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: groqModel,
            temperature: 0.1,
            max_tokens: 450,
            messages: [{ role: 'user', content: summaryPrompt }],
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const content = data.choices?.[0]?.message?.content?.trim() || '';
          const cleanedJson = content.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
          const parsed = JSON.parse(cleanedJson);

          if (parsed.intent) intent = parsed.intent;
          if (parsed.summary) summary = parsed.summary;
          if (Array.isArray(parsed.materialsDiscussed)) materialsDiscussed = parsed.materialsDiscussed;
          if (Array.isArray(parsed.materialsSuggested)) materialsSuggested = parsed.materialsSuggested;
          if (parsed.customerContact) customerContact = parsed.customerContact;
          if (parsed.followUp) followUpRecommendation = parsed.followUp;
        }
      } catch (aiErr) {
        console.warn('Groq AI summarization fallback triggered:', aiErr);
      }
    }

    // Rule-based fallback if summary was not generated
    if (!summary) {
      const fullText = messages.map((m) => m.content).join(' ').toLowerCase();

      if (fullText.includes('map') || fullText.includes('location') || fullText.includes('address') || fullText.includes('directions')) {
        intent = 'Coro Collective Showroom & Maps Location';
        summary = 'Visitor inquired about the physical location and directions to the Coro Collective and Ace Spaces studio in Bengaluru. AI provided the Indiranagar address and direct Google Maps link.';
        followUpRecommendation = 'Confirm appointment at the Indiranagar studio showroom.';
      } else if (fullText.includes('founder') || fullText.includes('syed') || fullText.includes('started')) {
        intent = 'Founders & Studio Leadership Inquiry';
        summary = 'Visitor asked about the founders of Ace Spaces and Coro Collective. AI provided leadership background detailing Syed Matheen and the architectural collective.';
        followUpRecommendation = 'Share studio capability portfolio.';
      } else if (fullText.includes('kitchen') || fullText.includes('island') || fullText.includes('marble')) {
        intent = 'Kitchen Monolith & Material Comparison';
        summary = 'Client discussed kitchen countertop specifications. AI advised on zero-silica solid surfaces over porous marble and suggested seamless 12mm Alto Ivory Vein with integrated coved sink.';
        materialsSuggested = ['Alto / Ivory Vein (12mm)', 'Integrated Corian Coved Sink'];
        followUpRecommendation = 'Follow up via WhatsApp to review CAD / DWG drawings.';
      } else if (fullText.includes('sample') || fullText.includes('swatch')) {
        intent = 'Specimen Sample Box Request';
        summary = 'Client inquired about physical material specimens. AI guided them on curating up to 6 true 100mm swatches via the website Sample Tray.';
        followUpRecommendation = 'Prepare curated sample box for courier dispatch.';
      } else {
        intent = 'Architectural Surface Advisory';
        summary = `Client engaged in material advisory session with ${messages.length} messages regarding solid surfaces, CNC tolerances, and bespoke fabrication in Bengaluru.`;
        followUpRecommendation = 'Connect via WhatsApp Specifier Desk.';
      }

      // Check for phone or email in text
      const phoneMatch = fullText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,5}/);
      if (phoneMatch) customerContact.phone = phoneMatch[0];
      const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) customerContact.email = emailMatch[0];
    }

    const sessionNumber = `ACE-CHAT-${Math.floor(100 + Math.random() * 900)}`;

    const newSession: AIChatSession = {
      id: sessionId,
      sessionNumber,
      startedAt,
      endedAt,
      durationSeconds,
      messageCount: messages.length,
      intent,
      summary,
      materialsDiscussed,
      materialsSuggested,
      customerContact,
      followUpRecommendation,
      status: 'new',
      messages,
      lastUpdated: new Date().toISOString(),
    };

    saveChatSession(newSession);

    // Instant real-time broadcast to Admin Console
    broadcastRealtimeEvent('CHAT_SESSION_CREATED', newSession);

    return NextResponse.json({
      success: true,
      session: newSession,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/session:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to record chat session' },
      { status: 500 }
    );
  }
}
