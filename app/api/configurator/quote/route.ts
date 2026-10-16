import { NextRequest, NextResponse } from 'next/server';
import { saveConfigurationRecord } from '@/data/configuratorStore';
import { saveInquiry } from '@/data/orderStore';
import { ProductConfiguration, calculateIndicativePrice } from '@/data/configuratorData';
import { checkRateLimit } from '@/lib/rateLimit';
import { broadcastRealtimeEvent } from '@/lib/realtime';

export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 6 quote requests per 10 minutes per IP
    const rateLimit = checkRateLimit(req, 'config_quote', 6, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: `Quote request limit reached. Please retry in ${rateLimit.retryAfterSeconds}s.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      config,
      customerName,
      email,
      phone,
      studio,
      city,
      projectNotes,
      firm_url,
      honeypot,
    } = body;

    // Silent honeypot drop
    if (firm_url || honeypot) {
      return NextResponse.json({
        success: true,
        message: 'Specification brief received.',
        quoteNumber: `ACE-CFG-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }

    if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Specifier contact name is required.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Valid architectural correspondence email is required.' },
        { status: 400 }
      );
    }

    const cfg = config as ProductConfiguration;
    if (!cfg) {
      return NextResponse.json(
        { success: false, error: 'Product configuration specification is missing.' },
        { status: 400 }
      );
    }

    const pricing = calculateIndicativePrice(cfg);

    // Save formal 3D configuration record
    const savedConfig = saveConfigurationRecord(cfg, {
      customerName: customerName.trim(),
      email: email.trim(),
      phone: typeof phone === 'string' ? phone.trim() : undefined,
      studio: typeof studio === 'string' ? studio.trim() : undefined,
      notes: typeof projectNotes === 'string' ? projectNotes.trim() : undefined,
      status: 'inquiry',
    });

    // Format itemized technical specification brief
    const itemizedBrief = `
[3D CONFIGURATOR SPECIFICATION QUOTATION]
Reference Code: ${savedConfig.configNumber}
Product Preset: ${cfg.title} (Qty: ${cfg.quantity || 1})
Material: ${cfg.materialName} (${cfg.materialFinish})
Dimensions: ${cfg.width} mm (W) × ${cfg.depth} mm (D) × ${cfg.thickness} mm (Slab)
Apron Drop: ${cfg.frontApronHeight} mm (Left: ${cfg.hasLeftApron ? 'Yes' : 'No'}, Right: ${cfg.hasRightApron ? 'Yes' : 'No'})
Splashback: ${cfg.rearUpstandHeight} mm (${cfg.isCovedUpstand ? '10mm Coved Hygiene Transition' : 'Standard 90°'})
Basin Model: ${cfg.basinModelId.toUpperCase()} (Placement: ${cfg.basinPlacement.toUpperCase()})
Tap Holes: ${cfg.tapHoles} (${cfg.tapPosition || cfg.tapLocation})
Edge Profile: ${cfg.edgeProfileId.toUpperCase()}
Corner Detail: ${(cfg.cornerProfileId || cfg.cornerLeft?.type || 'SHARP').toUpperCase()}

Commercial Estimate:
• Base Mineral Substrate: ₹${pricing.baseSubstrate.toLocaleString('en-IN')}
• Thickness / Reinforcement: ₹${pricing.thicknessSurcharge.toLocaleString('en-IN')}
• Apron Downstand Drop: ₹${pricing.apronDownstand.toLocaleString('en-IN')}
• Coved Splashback Upstand: ₹${pricing.upstandSplashback.toLocaleString('en-IN')}
• CNC Edge Tooling & Polish: ₹${pricing.edgeTooling.toLocaleString('en-IN')}
• Integrated Coved Basin(s): ₹${pricing.basinIntegration.toLocaleString('en-IN')}
• Tap Cutouts: ₹${pricing.tapCutouts.toLocaleString('en-IN')}
• Total Indicative Specification: ₹${pricing.totalIndicative.toLocaleString('en-IN')} (Excl. Taxes & Logistics)

Client Reference:
Project: ${cfg.projectName || 'Bespoke Project'}
Architecture Studio: ${studio || 'Private Specifier'}
Location: ${city || cfg.locationCity || 'Bengaluru'}
Client Notes: ${projectNotes || cfg.specialInstructions || 'None'}
    `.trim();

    // Persist into Studio Inquiries Pipeline
    const inquiry = saveInquiry({
      name: studio ? `${customerName.trim()} (${studio.trim()})` : customerName.trim(),
      email: email.trim(),
      phone: typeof phone === 'string' ? phone.trim() : undefined,
      projectType: `3D Configurator: ${cfg.title}`,
      message: itemizedBrief,
    });

    // Instant Real-Time Studio Alert
    broadcastRealtimeEvent('INQUIRY_CREATED', {
      name: customerName.trim(),
      email: email.trim(),
      projectType: `3D Configurator Quote (${savedConfig.configNumber})`,
      inquiryNumber: inquiry.inquiryNumber,
    });

    return NextResponse.json({
      success: true,
      quoteNumber: savedConfig.configNumber,
      inquiryNumber: inquiry.inquiryNumber,
      pricing,
      message: 'Your 3D configuration brief has been submitted directly to the Ace Spaces architectural engineering desk.',
    });
  } catch (err) {
    console.error('Error submitting configurator quote:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while submitting specification quote.' },
      { status: 500 }
    );
  }
}
