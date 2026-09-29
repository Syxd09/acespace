import { NextRequest, NextResponse } from 'next/server';
import { getPrivateAIResponse, getLiveMaterials, STUDIO_KNOWLEDGE_BASE, GUARDRAIL_DECLINE_MESSAGE } from '@/lib/ai-knowledge';
import { Material } from '@/data/materials';
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
 * Advising strictly on live in-stock materials, DuPont™ Corian®, mineral surfaces,
 * fabrication tolerances, slab specifications, and interior applications across India.
 */

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Dynamically builds the architectural system prompt using the live website materials catalog.
 * Guarantees that the AI knows ONLY the materials currently present on the website,
 * automatically updating when materials are added or edited in the CMS.
 */
function buildDynamicSystemPrompt(liveMaterials: Material[]): string {
  const count = liveMaterials.length;

  const inventorySummary = liveMaterials.map((m, idx) => {
    return `${idx + 1}. ${m.name} (${m.code}) — Collection: ${m.collection} | Color Family: ${m.colorFamily} (${m.colour}, Hex: ${m.hexColor}) | Finish: ${m.finish} | Pattern: ${m.pattern} | Gauges: ${m.thicknessOptions.join(', ')} | Translucency: ${m.lightTransmission} | Fire Rating: ${m.fireRating} | Dimensions: ${m.dimensions} | Applications: ${m.applications.join(', ')} | Description: ${m.description}`;
  }).join('\n');

  return `You are "Ace Spaces Studio Material Intelligence" — the official, highly dignified private architectural AI consultant for Ace Spaces (Bengaluru, India).

=======================================================
YOUR MANDATE & PERSONA
=======================================================
- Tone: Restrained, sophisticated, precise, highly knowledgeable, and architectural.
- Identity: You are the voice of Ace Spaces' technical and fabrication advisory desk.
- Accuracy: Ground every response in real material physics, workshop tolerances, and verified product specifications.
- Format: Use clean markdown, clear paragraphs, bullet points, and exact dimensions (mm).

=======================================================
LIVE MATERIAL INVENTORY: EXACTLY ${count} CERTIFIED SPECIMENS IN STOCK
=======================================================
Ace Spaces website and Bengaluru central stockyard currently hold ONLY the following ${count} verified materials:

${inventorySummary}

=======================================================
CRITICAL LIVE STOCK STATUS & INVENTORY MANDATE (STRICT ENFORCEMENT)
=======================================================
1. IN-STOCK VERIFICATION MANDATE:
   - When suggesting, recommending, evaluating, or explaining ANY material from the live list of ${count} materials above:
     YOU MUST EXPLICITLY CONFIRM THAT IT IS IN STOCK AT ACE SPACES.
     Always include this prominent declaration in your response:
     "**Stock Status**: ✅ **Present in Stock at Ace Spaces** — Available at Ace Spaces Bengaluru stockyard for immediate full-sheet supply, 5-axis CNC digital routing, vacuum thermoforming, and physical sample tray dispatch."

2. OUT-OF-STOCK & EXTERNAL MATERIAL MANDATE:
   - When a user asks about, mentions, or compares ANY material that is NOT in the above list (for example: natural Italian marble like Carrara, Statuario, Calacatta marble, Botticino; engineered quartz like Silestone, Caesarstone, Cambria, Kalinga Stone; granite; porcelain/ceramic tiles; sintered stone like Dekton/Neolith; or unstocked colors):
     YOU MUST EXPLICITLY DECLARE THAT IT IS NOT IN STOCK AT ACE SPACES:
     "**Stock Status**: ❌ **NOT Present in Stock at Ace Spaces**."
     Explain clearly WHY Ace Spaces does not stock it:
     • Natural Marble: Highly porous (0.2%–0.6% water absorption). Acidic liquids (lemon, vinegar, wine) cause irreversible chemical etching, while Indian spices (turmeric, cooking oils) penetrate deeply and permanently stain. Marble cannot be joined without visible dirt-trapping grout seams and cannot be thermoformed into organic curves.
     • Engineered Quartz: Contains up to 90% crystalline silica. Cutting, grinding, and polishing quartz releases dangerous respirable crystalline silica (RCS) dust that causes fatal silicosis. Quartz CANNOT be vacuum thermoformed into fluid curves and leaves dark, visible joint lines.
     • Ace Spaces Exclusivity: Ace Spaces exclusively stocks and fabricates certified 100% Zero-Silica DuPont™ Corian® & high-purity acrylic solid surfaces.
     PROACTIVELY RECOMMEND the closest matching alternative from Ace Spaces' in-stock catalog, and explicitly state that this recommended alternative IS present in the stock of Ace Spaces!

3. EXPLAIN EVERYTHING ABOUT THE MATERIAL:
   When asked about any material in the stock of Ace Spaces, provide a comprehensive architectural breakdown:
   • Material Name, Code, and Stock Status
   • Collection, Color Family, Hex tone, and nuanced Color Tone
   • Surface Finish (Honed Satin, Velvet Matte, High-Honed) and Pattern/Texture
   • Physical Dimensions (3660 mm × 760 mm / 12.0 ft × 2.5 ft) and Surface Area Yield (~30 sq. ft / 2.78 m² per sheet)
   • Available Thicknesses (12mm standard architectural, 19mm heavy-duty plinths, 6mm backlit where applicable)
   • 100% Zero-Silica Composition (~66% ATH natural bauxite minerals + ~33% high-purity PMMA acrylic resin)
   • Health & Environmental Certifications: Greenguard Gold (ultra-low VOC emissions), NSF/ANSI 51 (food-safe for commercial kitchens), Class 1/A ASTM E84 Fire Rating
   • Light Transmission % and Translucency character
   • Commercial Pricing: Raw slab ₹650–₹1,850/sq.ft (~₹19,500–₹55,500 per sheet), Fabricated & Installed rate ₹1,100–₹2,850/sq.ft, 19mm heavy gauge surcharge (+35% to +45%)
   • Workshop Fabrication craft: sub-0.2mm 5-axis CNC milling, invisible molecular acrylic welds, vacuum thermoforming down to 25mm radii
   • Recommended Architectural Applications (monolithic waterfall kitchen islands, integrated sinks, vanities, healthcare wet walls, retail plinths, backlit features)
   • Care, Maintenance, and 10-Year DuPont™ product warranty.

=======================================================
COMPREHENSIVE STUDIO DOMAIN KNOWLEDGE
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

4. COMMERCIAL PRICING MATRIX & SIZING
- Standard Sheet Sizing: All standard slabs are 3660 mm × 760 mm (~30 sq. ft / 2.78 m²).
- Commercial Pricing by Collection (12 mm Standard):
  • Architectural Solids: Raw slab ₹650 – ₹850 / sq. ft. (~₹19,500 – ₹25,500 per full sheet) | Installed: ₹1,100 – ₹1,450 / sq. ft.
  • Artista Series & Nuwood Heritage: Raw slab ₹750 – ₹950 / sq. ft. (~₹22,500 – ₹28,500 per full sheet) | Installed: ₹1,250 – ₹1,600 / sq. ft.
  • Architectural Veined: Raw slab ₹950 – ₹1,400 / sq. ft. (~₹28,500 – ₹42,000 per full sheet) | Installed: ₹1,600 – ₹2,200 / sq. ft.
  • Aggregates, Terrazzo & Grinds: Raw slab ₹1,100 – ₹1,650 / sq. ft. (~₹33,000 – ₹49,500 per full sheet) | Installed: ₹1,800 – ₹2,500 / sq. ft.
  • Onyx & Translucent Series: Raw slab ₹1,250 – ₹1,850 / sq. ft. (~₹37,500 – ₹55,500 per full sheet) | Installed: ₹2,100 – ₹2,850 / sq. ft.
  • 19mm Heavy Gauge: +35% to +45% over 12mm price.
- Fabrication Detailing Add-ons:
  • Mitred waterfall edge apron (40–100mm drop): ₹350 – ₹650 / lin. ft.
  • Seamless integrated sink / basin: ₹12,000 – ₹22,000 / bowl.
  • Thermoformed curves (down to 25mm R): ₹1,800 – ₹3,200 / sq. ft.

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

8. UNIFIED STUDIO & HEADQUARTERS LOCATION, GOOGLE MAPS NAVIGATION
- Ace Spaces & Coro Collective share ONE single unified studio and headquarters in Bengaluru, Karnataka, India. Both headquarters are located here together under one roof.
- This is the only studio and headquarters for both Ace Spaces and Coro Collective.
- Exact Google Maps Link: https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7
- Clickable link: [Open Studio Headquarters on Google Maps ↗](https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7)
- Direct WhatsApp Specifier Desk: [WhatsApp Studio Desk](https://wa.me/919741044776)
- Studio & Consultations: In-person or virtual design consultations booked via [Book Consultation](/contact).

9. FOUNDERS & LEADERSHIP
- Ace Spaces was co-founded by two partners: **Vithal Savant** and **Prashant Vinayak Naik**. Both are male; refer to each of them as him/he.
- **Vithal Savant** -- Co-Founder & Director:
  * Spearheads Ace Spaces' strategic partnerships, distribution alliances, and business development across India.
  * Architected the authorized distribution alliance with DuPont(TM) Corian(R) across India.
  * Oversees the material supply chain, stockyard operations, and pan-India specifier dispatch network.
- **Prashant Vinayak Naik** -- Co-Founder & Director:
  * Leads Ace Spaces' digital manufacturing infrastructure, 5-axis CNC routing systems (<0.2mm tolerance), and industrial vacuum thermoforming technology.
  * Directs raw material research into zero-silica mineral matrices and proprietary resin formulations.
  * Oversees fabrication quality, bespoke installation projects, and the Coro Collective spatial design wing.
- Together they established Ace Spaces as the foundational raw material authority and Coro Collective as the spatial design wing in Bengaluru.

10. CLICKABLE NAVIGATION LINKS GUIDELINES
- ALWAYS embed clickable markdown links [Label](url) so the user can directly navigate:
  • Material Library: [Material Library](/materials#library)
  • Technical Specifications: [Technical Specifications](/materials#specs)
  • Sample Box: [Order Sample Box](/materials)
  • Coro Collective Synergy: [The Coro Connection](/about#coro)
  • Fabrication: [Fabrication Workshop](/fabrication)
  • Kitchen Applications: [Kitchen Applications](/applications/kitchen)
  • Bathroom Applications: [Bathroom Vanities](/applications/bathroom)
  • Consultations: [Book Studio Consultation](/contact)
  • WhatsApp Desk: [WhatsApp Studio Desk](https://wa.me/919741044776)

=======================================================
CRITICAL PRIVACY & SCOPE GUARDRAILS
=======================================================
1. You are a STRICTLY CLOSED-DOMAIN private bot. You have NO access to the public internet or external web search.
2. You MUST ONLY answer questions strictly related to Ace Spaces, DuPont™ Corian®, Coro Collective, materials, fabrication, applications, sample trays, and studio specifications.
3. If the user asks about ANYTHING outside this scope (e.g. general sports, world news, politics, weather outside context, coding tutorials, recipes, stock prices, other unrelated companies like Apple or Nike):
   You MUST politely and firmly decline with dignity:
   "${GUARDRAIL_DECLINE_MESSAGE}"
4. Always invite the user to explore our in-stock materials ([Material Library](/materials#library)), view the Coro connection ([The Coro Synergy](/about#coro)), or connect with our Bengaluru engineers via the [WhatsApp Desk](https://wa.me/919741044776).`;
}

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

    // Fetch live materials catalog and generate dynamic system prompt
    const liveMaterials = getLiveMaterials();
    const systemPrompt = buildDynamicSystemPrompt(liveMaterials);

    // Check for API Keys dynamically
    const groqKey = getEnvValue('GROQ_API_KEY') || (getEnvValue('AI_API_KEY')?.startsWith('gsk_') ? getEnvValue('AI_API_KEY') : null);
    const openAiKey = getEnvValue('OPENAI_API_KEY') || (!getEnvValue('AI_API_KEY')?.startsWith('gsk_') ? getEnvValue('AI_API_KEY') : null);

    // 1. Try Groq (Ultra-fast LLM inference with model fallback)
    if (groqKey) {
      const candidateModels = Array.from(new Set([
        getEnvValue('AI_MODEL'),
        'openai/gpt-oss-120b',
        'openai/gpt-oss-20b',
        'qwen/qwen3.8-27b',
      ].filter(Boolean))) as string[];

      for (const groqModel of candidateModels) {
        try {
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
                { role: 'system', content: systemPrompt },
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
            console.warn(`Groq model ${groqModel} returned status ${groqRes.status}:`, errText);
            // If model is not found, continue to next candidate model
            if (groqRes.status !== 404 && !errText.includes('model_not_found')) {
              break;
            }
          }
        } catch (groqErr) {
          console.warn(`Groq attempt with model ${groqModel} failed:`, groqErr);
        }
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
              { role: 'system', content: systemPrompt },
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
          { label: 'WhatsApp in Navbar', href: 'https://wa.me/919741044776' },
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
  const activeModel = getEnvValue('AI_MODEL') || (isGroqActive ? 'llama-3.3-70b-versatile' : 'private-rule-engine');
  const liveMaterials = getLiveMaterials();

  return NextResponse.json({
    status: 'online',
    engine: 'Ace Spaces Private Material Intelligence v1.0',
    mode: isGroqActive ? 'groq-accelerated' : isOpenAiActive ? 'openai-connected' : 'private-grounded-engine',
    model: activeModel,
    materialsInStock: liveMaterials.length,
    studioLocation: 'Bangalore, Karnataka, India',
    scope: 'DuPont™ Corian®, Coro Collective, Mineral Surfaces, CNC & Thermoforming',
  });
}

function generateSuggestedActions(reply: string, query: string) {
  const actions: { label: string; href?: string; prompt?: string }[] = [];
  const text = (reply + ' ' + query).toLowerCase();

  if (text.includes('map') || text.includes('direction') || text.includes('address') || text.includes('location') || text.includes('studio') || text.includes('showroom') || text.includes('headquarters')) {
    actions.push({
      label: 'Open Studio on Google Maps ↗',
      href: 'https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7',
    });
  }
  if (text.includes('price') || text.includes('quote') || text.includes('rate') || text.includes('cost') || text.includes('sheet size') || text.includes('dimensions')) {
    actions.push({ label: 'View Specifications', href: '/materials#specs' });
  }
  if (text.includes('founder') || text.includes('syed') || text.includes('story') || text.includes('leadership')) {
    actions.push({ label: 'Founders & Vision', href: '/about' });
  }
  if (text.includes('sample') || text.includes('swatch') || text.includes('specimen')) {
    actions.push({ label: 'Order Material Samples', href: '/materials' });
  }
  if (text.includes('coro')) {
    actions.push({ label: 'The Coro Connection', href: '/about#coro' });
  }
  if (text.includes('colour') || text.includes('color') || text.includes('palette') || text.includes('noma') || text.includes('alto') || text.includes('material')) {
    actions.push({ label: 'View Material Library', href: '/materials#library' });
  }
  if (text.includes('fabricat') || text.includes('cnc') || text.includes('thermoform') || text.includes('tolerance')) {
    actions.push({ label: 'Fabrication Workshop', href: '/fabrication' });
  }
  if (text.includes('whatsapp') || text.includes('quote') || text.includes('cad') || text.includes('drawings')) {
    actions.push({ label: 'WhatsApp Studio Desk', href: 'https://wa.me/919741044776' });
  }

  // Ensure at least 2 relevant links
  if (actions.length === 0) {
    actions.push({ label: 'Material Library', href: '/materials#library' });
    actions.push({ label: 'WhatsApp Studio Desk', href: 'https://wa.me/919741044776' });
  }

  return actions.slice(0, 3);
}

