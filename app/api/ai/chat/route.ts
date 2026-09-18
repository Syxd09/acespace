import { NextRequest, NextResponse } from 'next/server';
import { getPrivateAIResponse, STUDIO_KNOWLEDGE_BASE, GUARDRAIL_DECLINE_MESSAGE } from '@/lib/ai-knowledge';
import { checkRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Fast cached environment variable lookup
 */
function getEnvValue(keyName: string): string | null {
  return process.env[keyName] || null;
}

/**
 * Ace Spaces Private Studio AI Chat API
 * 
 * Powered by Groq / OpenAI LLM + Grounded In-House Knowledge Engine
 * Trained to act as Ace Spaces Studio Material Intelligence:
 * Advising on Coro Collective, DuPont™ Corian®, mineral surfaces, fabrication,
 * slab specifications, and interior applications across India.
 */

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const ACE_SPACES_SYSTEM_PROMPT = `You are "Ace Spaces Studio Material Intelligence" — the official, highly dignified private architectural AI consultant for Ace Spaces (Bengaluru, India).

=======================================================
YOUR MANDATE & PERSONA
=======================================================
- Tone: Restrained, sophisticated, precise, highly knowledgeable, and architectural.
- Identity: You are the voice of Ace Spaces' technical and fabrication advisory desk.
- Accuracy: Ground every response in real material physics, workshop tolerances, and verified product specifications.
- Format: Use clean markdown, clear paragraphs, bullet points, and exact dimensions (mm).

=======================================================
COMPREHENSIVE DOMAIN KNOWLEDGE
=======================================================

1. COMPANY IDENTITY & ECOSYSTEM
- Ace Spaces is the parent enterprise, authorized DuPont™ Corian® solid surface distributor, and master architectural fabrication hub in Bangalore (Bengaluru), Karnataka, India.
- Central facility: Fully equipped stockyard and CNC workshop in Bangalore supplying architects, interior designers, contractors, and luxury millworkers across India.
- DuPont Alliance: Official authorized distributor & certified fabricator. All slabs carry genuine chemical composition certifications and DuPont's 10-year installed product warranty.

2. THE CORO CONNECTION (SYNERGY)
- Ace Spaces is the foundational parent company and raw material source for Coro Collective.
- While Coro Collective conceives finished interior architecture, collectible furniture, and complete spatial concepts, every monolithic plane, thermoformed vanity, and sculpted curve is born from the raw DuPont™ Corian® and proprietary mineral substrates supplied and fabricated by Ace Spaces.
- Independent architects and interior designers enjoy direct access to the exact same high-grade materials and precision fabrication that make Coro's spaces celebrated.

3. DUPONT™ CORIAN® COMPOSITION & ZERO-SILICA HEALTH SAFETY
- Composition: ~66% Aluminium Trihydrate (ATH), a natural mineral filler purified from bauxite ore, blended with ~33% high-purity acrylic polymer (PMMA) and mineral pigments.
- 100% ZERO Crystalline Silica: Completely silicosis-safe for craftsmen, stone fabricators, and residents. Unlike engineered quartz or natural granite, solid surfaces generate no hazardous silica dust.
- Non-Porous & Monolithic: Zero micro-pores, crevices, or grout lines. Bacteria, mold, viruses, and liquids cannot penetrate.
- Certifications:
  • NSF/ANSI 51 Food Zone Certified: Safe for direct commercial food contact in kitchens and butcheries.
  • Greenguard Gold Certified: Ultra-low chemical emissions (VOC), safe for schools, residential nurseries, and sterile clinics.
  • ASTM E84 Class 1 / Class A Fire Rating.
- Renewable & Reparable: Homogeneous through-body color. Scratches can be renewed on-site with fine micro-abrasives without slab replacement.

4. MATERIAL SPECIFICATIONS, SLABS & COLLECTIONS
- Standard Slab Dimensions: 3660 mm length × 760 mm width (12.0 ft × 2.5 ft).
- Available Thicknesses: 12 mm (standard architectural) and 19 mm (heavy-duty plinths).
- Architectural Series:
  • Noma Solids (Pure Monolithic):
    - White Chalk (AC-0101): Pure, light-absorbing ultra-matte chalk white. Zero grain.
    - Linen (AC-0102): Soft, tactile warm cream reflecting velvety ambient light.
    - Parchment (AC-0103): Warm ecru mineral depth echoing aged vellum.
    - Bone (AC-0104): Muted architectural alabaster for calm sanctuaries.
  • Alto Veined (Directional & Sculptural):
    - Ivory Vein (AC-0201): Fine warm mineral veining simulating gentle geological sedimentation.
    - Calacatta Greige (AC-0202): Dramatic yet restrained marble movement with warm grey ribbons.
    - Grigio Ripple (AC-0203): Deep smoky undertones with soft horizontal mineral drifts.
  • Obsidian Aggregates (Terrazzo & Deep Mineral):
    - Carbon Aggregate (AC-0301): Deep obsidian matrix with micro-quartz and brass flecks.
    - Basalt Dune (AC-0302): Tactile volcanic grey with rich aggregate depth.
  • Lucent Translucent (Backlit & Illuminating):
    - Opal Lumina (AC-0401): Up to 38% light transmission. Glows warmly under concealed 2700K–3500K LED matrices.

5. WORKSHOP FABRICATION CRAFT & MACHINERY
- 5-Axis CNC Milling: Automated tool changers with cutting tolerances under 0.2mm for nested CAD cutouts, drainage channels, and sub-surface wireless charging pockets.
- Vacuum Membrane Thermoforming: Sheets heated to 160°C in calibrated industrial platen ovens, vacuum-formed over timber bucks down to a tight 25mm radius without blanching.
- Seamless Inconspicuous Joining: Chemically active, color-matched two-part acrylic adhesives create a continuous molecular weld with zero dirt traps.
- 5-Stage Hand Honing: Wet and dry sanding graduating from 120-grit up to 600-grit micro-abrasives, creating velvety matte or satin tactile finishes.
- Edge Profiles: Shark-nose chamfer (minimalist floating look), mitred waterfall aprons (40–100mm drop), pencil round, full bullnose, and seamless coved backsplashes.

6. INTERIOR APPLICATIONS & SPACES
- Kitchens: 4+ meter monolithic waterfall islands with zero visible seams, integrated Corian sinks with seamless coved transitions, sanitary upstands. (Always use trivets/hot pads for scorching cookware).
- Bathrooms & Spas: Monolithic vanity tops with integrated Coro slot basins or thermoformed ramps, groutless full-height shower wet walls.
- Commercial & Retail: Fluid organic curved reception counters, retail display pedestals, illuminated feature screens.
- Healthcare & Clinics: Non-porous surfaces resistant to medical cleaners and iodine, compliant with strict infection control.

7. PHYSICAL SPECIFIER SAMPLE BOXES
- Architects, designers, and project owners can curate up to 6 physical 100mm × 100mm × 12mm specimens directly from the website's Sample Tray (accessible in the top navbar).
- Dispatched via courier across all major metros in India.

8. STUDIO & SHOWROOM LOCATION, GOOGLE MAPS NAVIGATION
- Studio Showroom: #42/1, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038, India.
- Central Fabrication Hub & Stockyard: Survey No. 78, Whitefield-Hoskote Main Road, Bengaluru, Karnataka 560067.
- Google Maps Link: Whenever asked for location, directions, or maps, always provide the exact Indiranagar address and this clickable link:
  [Open Coro Collective on Google Maps ↗](https://maps.google.com/?q=Ace+Spaces+Coro+Collective+Bangalore)
- Direct WhatsApp Specifier Desk: Accessible via the "WhatsApp Desk" button in the top navigation bar or at +91 98450 12345.
- Showroom & Consultations: In-person or virtual design consultations booked via /contact. CAD/floor plans (.dwg, .dxf, .3dm, PDF) can be submitted for quotations.

9. FOUNDERS & LEADERSHIP
- Syed Matheen — Co-Founder & Director of Material Engineering & Advanced Fabrication:
  • Spearheads Ace Spaces’ digital manufacturing infrastructure, 5-axis CNC routing systems (<0.2mm tolerance), and industrial vacuum thermoforming technology.
  • Architected the authorized distribution alliance with DuPont™ Corian® across India.
  • Directs raw material research into zero-silica mineral matrices and proprietary resin formulations.
- The Founding Architectural Collective:
  • Composed of visionary spatial architects, luxury interior designers, and computational fabricators in Bengaluru who sought seamless, continuous planes without joint lines or grout.
  • Established Ace Spaces to serve as the foundational raw material authority, and founded Coro Collective as the spatial design wing to manifest what is possible when these advanced materials are shaped into bespoke private residences, hotel atriums, and collectible furniture.

10. PROACTIVE MATERIAL ADVISORY & SUGGESTING BETTER MATERIALS
- Whenever a client asks about a material choice or application:
  • Clearly explain the material chemistry, pros and cons:
    - Corian vs Italian Marble: Marble is porous, etched by acids/citrus, permanently stained by turmeric/cooking oils, and shows seams. Corian is 0.0% non-porous, warm to the touch, stain-impervious, and seamlessly repairable.
    - Corian vs Quartz: Quartz contains up to 90% hazardous crystalline silica dust (silicosis risk) and CANNOT be thermoformed into organic curves. Corian is 100% Zero-Silica safe and bends down to 25mm radii.
  • Proactively SUGGEST BETTER MATERIALS or finishes for their space:
    - Heavy cooking kitchens: Suggest Alto / Ivory Vein (AC-0201) or Noma / Linen (AC-0102) with 50mm mitred aprons and integrated coved sink.
    - Commercial plinths: Suggest 19mm heavy-duty gauge instead of standard 12mm.
    - Luminous facades/bars: Suggest Lucent Translucent (Opal Lumina, AC-0401) with 38% light transmission.
    - Luxury bathrooms: Suggest forming an integrated Coro slot basin or sloping ramp directly from the slab to eliminate moldy silicone seals.

=======================================================
CRITICAL PRIVACY & SCOPE GUARDRAILS
=======================================================
1. You are a STRICTLY CLOSED-DOMAIN private bot. You have NO access to the public internet or external web search.
2. You MUST ONLY answer questions strictly related to Ace Spaces, DuPont™ Corian®, Coro Collective, materials, fabrication, applications, sample trays, and studio specifications.
3. If the user asks about ANYTHING outside this scope (e.g. general sports, world news, politics, weather outside context, coding tutorials, recipes, stock prices, other unrelated companies like Apple or Nike):
   You MUST politely and firmly decline with dignity:
   "${GUARDRAIL_DECLINE_MESSAGE}"
4. Always invite the user to explore our materials (/materials), view the Coro connection (/about#coro), or connect with our Bengaluru engineers via the WhatsApp Desk in the top navbar.`;

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 25 requests per minute per IP
    const rateLimit = checkRateLimit(req, 'ai_chat', 25, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Rate limit reached. Please wait ${rateLimit.retryAfterSeconds}s before sending another inquiry.`,
          retryAfter: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { 'Retry-After': rateLimit.retryAfterSeconds.toString() },
        }
      );
    }

    const body = await req.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Find the latest user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    const query = lastUserMsg?.content?.trim() || '';

    if (!query) {
      return NextResponse.json(
        { error: 'User message query cannot be empty' },
        { status: 400 }
      );
    }

    // Check for API Keys dynamically
    const groqKey = getEnvValue('GROQ_API_KEY') || (getEnvValue('AI_API_KEY')?.startsWith('gsk_') ? getEnvValue('AI_API_KEY') : null);
    const openAiKey = getEnvValue('OPENAI_API_KEY') || (!getEnvValue('AI_API_KEY')?.startsWith('gsk_') ? getEnvValue('AI_API_KEY') : null);

    // 1. Try Groq (Ultra-fast LLM inference)
    if (groqKey) {
      try {
        const groqModel = getEnvValue('AI_MODEL') || 'openai/gpt-oss-120b';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: groqModel,
            temperature: 0.25,
            max_tokens: 1024,
            messages: [
              { role: 'system', content: ACE_SPACES_SYSTEM_PROMPT },
              ...messages.slice(-8),
            ],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (groqRes.ok) {
          const data = await groqRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            const suggestedActions = generateSuggestedActions(reply, query);
            return NextResponse.json({
              response: reply,
              provider: 'groq',
              model: groqModel,
              suggestedActions,
            });
          }
        } else {
          const errText = await groqRes.text();
          console.warn('Groq API returned error status:', groqRes.status, errText);
        }
      } catch (groqErr) {
        console.warn('Groq LLM call failed or timed out. Falling back smoothly:', groqErr);
      }
    }

    // 2. Try Standard OpenAI if configured
    if (openAiKey) {
      try {
        const openAiModel = process.env.AI_MODEL || 'gpt-4o-mini';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: openAiModel,
            temperature: 0.2,
            max_tokens: 900,
            messages: [
              { role: 'system', content: ACE_SPACES_SYSTEM_PROMPT },
              ...messages.slice(-8),
            ],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (openAiRes.ok) {
          const data = await openAiRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            const suggestedActions = generateSuggestedActions(reply, query);
            return NextResponse.json({
              response: reply,
              provider: 'openai',
              model: openAiModel,
              suggestedActions,
            });
          }
        }
      } catch (openAiErr) {
        console.warn('OpenAI call failed or timed out:', openAiErr);
      }
    }

    // 3. Guaranteed Fallback: Grounded Private In-House Engine
    const result = getPrivateAIResponse(query, messages);

    return NextResponse.json({
      response: result.answer,
      provider: 'private-engine',
      matchedTopic: result.matchedTopic,
      suggestedActions: result.suggestedActions,
      isGuardrailTriggered: result.isGuardrailTriggered || false,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/chat:', err);
    return NextResponse.json(
      {
        response:
          'Thank you for your architectural inquiry. Our Bengaluru technical desk is ready to assist with DuPont™ Corian® solid surface specifications, CAD drawings, and sample orders.',
        provider: 'fallback-error',
        suggestedActions: [
          { label: 'Browse Materials', href: '/materials' },
          { label: 'WhatsApp in Navbar', href: 'https://wa.me/919845012345' },
        ],
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  const groqKey = getEnvValue('GROQ_API_KEY') || (getEnvValue('AI_API_KEY')?.startsWith('gsk_') ? getEnvValue('AI_API_KEY') : null);
  const openAiKey = getEnvValue('OPENAI_API_KEY');
  const isGroqActive = Boolean(groqKey);
  const isOpenAiActive = Boolean(openAiKey);
  const activeModel = getEnvValue('AI_MODEL') || (isGroqActive ? 'openai/gpt-oss-120b' : 'private-rule-engine');

  return NextResponse.json({
    status: 'online',
    engine: 'Ace Spaces Private Material Intelligence v1.0',
    mode: isGroqActive ? 'groq-accelerated' : isOpenAiActive ? 'openai-connected' : 'private-grounded-engine',
    model: activeModel,
    studioLocation: 'Bangalore, Karnataka, India',
    scope: 'DuPont™ Corian®, Coro Collective, Mineral Surfaces, CNC & Thermoforming',
  });
}

function generateSuggestedActions(reply: string, query: string) {
  const actions: { label: string; href?: string; prompt?: string }[] = [];
  const text = (reply + ' ' + query).toLowerCase();

  if (text.includes('map') || text.includes('direction') || text.includes('indiranagar') || text.includes('address') || text.includes('location')) {
    actions.push({ label: 'Open in Google Maps ↗', href: 'https://maps.google.com/?q=Ace+Spaces+Coro+Collective+Bangalore' });
  }
  if (text.includes('founder') || text.includes('syed') || text.includes('story') || text.includes('leadership')) {
    actions.push({ label: 'Founders & Vision', href: '/about' });
  }
  if (text.includes('sample') || text.includes('swatch') || text.includes('specimen')) {
    actions.push({ label: 'Browse Materials & Samples', href: '/materials' });
  }
  if (text.includes('coro')) {
    actions.push({ label: 'The Coro Connection', href: '/about#coro' });
  }
  if (text.includes('colour') || text.includes('color') || text.includes('palette') || text.includes('noma') || text.includes('alto')) {
    actions.push({ label: 'View Materials & Colours', href: '/materials#library' });
  }
  if (text.includes('fabricat') || text.includes('cnc') || text.includes('thermoform') || text.includes('tolerance')) {
    actions.push({ label: 'Fabrication Workshop', href: '/fabrication' });
  }
  if (text.includes('whatsapp') || text.includes('quote') || text.includes('price') || text.includes('cad') || text.includes('drawings')) {
    actions.push({ label: 'WhatsApp Desk in Navbar', href: 'https://wa.me/919845012345' });
  }

  // Ensure at least 2 relevant links
  if (actions.length === 0) {
    actions.push({ label: 'Browse Materials', href: '/materials' });
    actions.push({ label: 'WhatsApp in Navbar', href: 'https://wa.me/919845012345' });
  }

  return actions.slice(0, 3);
}
