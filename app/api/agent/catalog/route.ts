import { NextRequest, NextResponse } from 'next/server';
import { materials } from '@/data/materials';
import { productsData } from '@/data/products';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'full';
  const format = searchParams.get('format');
  const acceptHeader = request.headers.get('accept') || '';
  const wantsMarkdown = format === 'md' || format === 'markdown' || acceptHeader.includes('text/markdown');

  const studioData = {
    brand: 'Ace Spaces Private Limited',
    role: 'Primary Architectural Raw Material Hub & Authorized DuPont™ Corian® Master Distributor',
    sisterBrand: 'Coro Collective (Spatial Interiors & Collectible Furniture)',
    headquarters: '#42/1, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038, India',
    cncPlant: 'Whitefield-Hoskote Industrial Corridor, Bengaluru, Karnataka 560067, India',
    contact: {
      phone: '+91 98450 12345',
      whatsapp: '+91 98450 12345',
      email: 'studio@acespaces.in',
      website: 'https://acespacesindia.vercel.app',
    },
    guarantees: {
      zeroSilica: '100% Zero Crystalline Silica (0.00% SiO2). Silicosis-safe.',
      warranty: 'DuPont™ 10-Year Installed Manufacturer Warranty',
      certifications: ['NSF/ANSI 51 (Food Contact Safe)', 'GREENGUARD Gold (Ultra-Low VOC)', 'ASTM E84 Class 1 / Class A Fire Rating'],
      slabFormats: '3660 mm × 760 mm (12.0 ft × 2.5 ft) in 12 mm & 19 mm thickness',
      fabricationTolerances: '5-axis CNC < 0.2mm tolerance; vacuum thermoforming down to 25mm radius',
    },
  };

  if (type === 'materials') {
    const materialsSummary = materials.map((m) => ({
      code: m.code,
      name: m.name,
      collection: m.collection,
      colorFamily: m.colorFamily,
      finish: m.finish,
      thicknessOptions: m.thicknessOptions,
      dimensions: m.dimensions,
      description: m.description,
      fireRating: m.fireRating,
      applications: m.applications,
      url: `https://acespacesindia.vercel.app/materials/${m.slug}`,
    }));

    if (wantsMarkdown) {
      const md = [
        '# Ace Spaces — Materials & Colour Catalog',
        `> ${studioData.brand} | ${studioData.role}`,
        '',
        '## Material Formats & Guarantee',
        `- **Zero-Silica**: ${studioData.guarantees.zeroSilica}`,
        `- **Dimensions**: ${studioData.guarantees.slabFormats}`,
        `- **Certifications**: ${studioData.guarantees.certifications.join(', ')}`,
        '',
        '## Curated Architectural Slabs',
        ...materialsSummary.map((m) => `### ${m.name} (${m.code})\n- **Collection**: ${m.collection}\n- **Thickness**: ${m.thicknessOptions.join(', ')}\n- **Finish**: ${m.finish}\n- **Profile**: ${m.description}\n- **Direct Link**: ${m.url}\n`),
      ].join('\n');

      return new NextResponse(md, {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      });
    }

    return NextResponse.json({ studio: studioData, totalMaterials: materialsSummary.length, materials: materialsSummary });
  }

  if (type === 'products') {
    const productsSummary = productsData.map((p) => ({
      code: p.code,
      name: p.name,
      category: p.categoryName,
      tagline: p.tagline,
      keyFeatures: p.keyFeatures,
      specifications: p.specifications,
      applications: p.applications,
      url: `https://acespacesindia.vercel.app/products/${p.slug}`,
    }));

    if (wantsMarkdown) {
      const md = [
        '# Ace Spaces — Precision Architectural Products',
        `> ${studioData.brand} | Monolithic Solid Surface Systems`,
        '',
        '## Product Catalog',
        ...productsSummary.map((p) => `### ${p.name} [${p.code}]\n- **Category**: ${p.category}\n- **Tagline**: ${p.tagline}\n- **Key Features**: ${p.keyFeatures.join('; ')}\n- **Direct Link**: ${p.url}\n`),
      ].join('\n');

      return new NextResponse(md, {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      });
    }

    return NextResponse.json({ studio: studioData, totalProducts: productsSummary.length, products: productsSummary });
  }

  if (type === 'fabrication') {
    const fabricationSpecs = {
      capabilities: [
        '5-Axis CNC Milling (<0.2mm tolerance, nested CAD cutouts, Qi charger cavities)',
        'Vacuum Membrane Thermoforming (calibrated platen heating to 160°C, tight 25mm radii)',
        'Inconspicuous Molecular Seaming (two-part color-matched acrylic resins, zero dirt lines)',
        'Integral Coved Junctions (10mm internal radii eliminating mold traps)',
        'On-Site Seam Honing & In-Situ Repair by Master Fabricators',
      ],
      drawingFormatsAccepted: ['.dwg', '.dxf', '.step', '.iges', '.rvt', '.pdf'],
      warranty: studioData.guarantees.warranty,
    };

    if (wantsMarkdown) {
      const md = [
        '# Ace Spaces — Digital Fabrication Technical Specifications',
        `> Automated 5-Axis CNC & Thermoforming Facility in Bengaluru, India`,
        '',
        '## Machinery & Capabilities',
        ...fabricationSpecs.capabilities.map((c) => `- ${c}`),
        '',
        `## Drawing Submissions`,
        `Accepted formats: ${fabricationSpecs.drawingFormatsAccepted.join(', ')}`,
        `Submit drawings: ${studioData.contact.website}/contact or via WhatsApp ${studioData.contact.whatsapp}`,
      ].join('\n');

      return new NextResponse(md, {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      });
    }

    return NextResponse.json({ studio: studioData, fabrication: fabricationSpecs });
  }

  // Full Overview
  const fullOverview = {
    studio: studioData,
    materialsCount: materials.length,
    productsCount: productsData.length,
    quickLinks: {
      materials: 'https://acespacesindia.vercel.app/materials',
      products: 'https://acespacesindia.vercel.app/products',
      fabrication: 'https://acespacesindia.vercel.app/fabrication',
      sampleTray: 'https://acespacesindia.vercel.app/materials#sample-tray',
      llmsTxt: 'https://acespacesindia.vercel.app/llms.txt',
      llmsFull: 'https://acespacesindia.vercel.app/llms-full.txt',
    },
    topMaterials: materials.slice(0, 6).map((m) => ({ code: m.code, name: m.name, collection: m.collection })),
    topProducts: productsData.slice(0, 6).map((p) => ({ code: p.code, name: p.name, category: p.categoryName })),
  };

  if (wantsMarkdown) {
    const md = [
      '# Ace Spaces — Studio Material Intelligence API',
      `> ${studioData.role}`,
      '',
      `- **Headquarters**: ${studioData.headquarters}`,
      `- **WhatsApp / Phone**: ${studioData.contact.phone}`,
      `- **Website**: ${studioData.contact.website}`,
      `- **Zero-Silica**: ${studioData.guarantees.zeroSilica}`,
      `- **Warranty**: ${studioData.guarantees.warranty}`,
      '',
      '## Specifier Actions',
      '- Query Materials: `GET /api/agent/catalog?type=materials`',
      '- Query Products: `GET /api/agent/catalog?type=products`',
      '- Query Fabrication: `GET /api/agent/catalog?type=fabrication`',
      '- Specifier Sample Box: Up to 6 physical specimens dispatched across India via website or WhatsApp.',
    ].join('\n');

    return new NextResponse(md, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  return NextResponse.json(fullOverview, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
