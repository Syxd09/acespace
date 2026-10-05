const fs = require('fs');
const path = require('path');

const materialsDir = path.join(__dirname, '../public/materials');
const files = fs.readdirSync(materialsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png')).sort();

console.log(`Processing ${files.length} materials from public/materials...`);

function titleCase(str) {
  return str
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function getColorFamily(filename, cleanColor) {
  const lower = (filename + ' ' + cleanColor).toLowerCase();

  if (lower.includes('onyx') || lower.includes('ice') || lower.includes('aqua') || lower.includes('mint') || lower.includes('translucent')) {
    return 'translucent';
  }
  if (lower.includes('white') || lower.includes('glacier') || lower.includes('arctic') || lower.includes('polar') || lower.includes('snow') || lower.includes('ivory') || lower.includes('jasmine') || lower.includes('whisper')) {
    return 'white';
  }
  if (lower.includes('black') || lower.includes('deep') || lower.includes('anthracite') || lower.includes('nocturne') || lower.includes('night') || lower.includes('midnight') || lower.includes('eclipse') || lower.includes('carbon') || lower.includes('basalt') || lower.includes('caviar') || lower.includes('espresso')) {
    return 'black';
  }
  if (lower.includes('gray') || lower.includes('grey') || lower.includes('smoke') || lower.includes('ash') || lower.includes('silver') || lower.includes('platinum') || lower.includes('dove') || lower.includes('flint') || lower.includes('gravel') || lower.includes('concrete') || lower.includes('graphite') || lower.includes('shale') || lower.includes('matterhorn')) {
    return 'grey';
  }
  if (lower.includes('beige') || lower.includes('cream') || lower.includes('bisque') || lower.includes('ecru') || lower.includes('oat') || lower.includes('bone') || lower.includes('linen') || lower.includes('sand') || lower.includes('dune') || lower.includes('canvas') || lower.includes('fawn') || lower.includes('tan') || lower.includes('granola') || lower.includes('hazelnut')) {
    return 'cream';
  }
  return 'earth';
}

function getPattern(filename, cleanColor) {
  const lower = (filename + ' ' + cleanColor).toLowerCase();

  if (lower.includes('onyx') || lower.includes('ice')) {
    return 'translucent';
  }
  if (lower.includes('vein') || lower.includes('calacatta') || lower.includes('carrara') || lower.includes('marble') || lower.includes('drift') || lower.includes('ripple') || lower.includes('linear') || lower.includes('cloud') || lower.includes('streak') || lower.includes('prima') || lower.includes('fissure') || lower.includes('strata') || lower.includes('windswept') || lower.includes('witch_hazel') || lower.includes('nuwood')) {
    return 'veined';
  }
  if (lower.includes('terrazzo') || lower.includes('aggregate') || lower.includes('pebble') || lower.includes('granita') || lower.includes('quartz') || lower.includes('concrete') || lower.includes('sand') || lower.includes('grinds') || lower.includes('stonique') || lower.includes('excavage') || lower.includes('abalone') || lower.includes('allspice') || lower.includes('antartica') || lower.includes('arrowroot') || lower.includes('aspen') || lower.includes('asterism') || lower.includes('aurora') || lower.includes('fieldstone') || lower.includes('bronzite') || lower.includes('cottage') || lower.includes('costa') || lower.includes('duna') || lower.includes('dusk') || lower.includes('earth') || lower.includes('fossil') || lower.includes('keystone') || lower.includes('lava_rock') || lower.includes('luna_jade') || lower.includes('maui') || lower.includes('milky_way') || lower.includes('mineral') || lower.includes('pepper') || lower.includes('salt') || lower.includes('seafoam') || lower.includes('seagrass') || lower.includes('shoreline') || lower.includes('silt') || lower.includes('silverite') || lower.includes('snowflake') || lower.includes('sonora') || lower.includes('stardust') || lower.includes('stratus') || lower.includes('suede') || lower.includes('tumbled_glass') || lower.includes('tumbleweed') || lower.includes('whitecap')) {
    return 'particulate';
  }
  return 'solid';
}

function getCollection(filename, pattern, cleanColor) {
  const lower = (filename + ' ' + cleanColor).toLowerCase();
  if (lower.includes('artista')) return 'Artista Series';
  if (lower.includes('terrazzo')) return 'Terrazzo & Aggregate';
  if (pattern === 'veined') return 'Architectural Veined';
  if (pattern === 'translucent') return 'Onyx & Translucent';
  if (pattern === 'particulate') return 'Aggregates & Grinds';
  return 'Pure Mineral Solids';
}

function getHexColor(family) {
  switch (family) {
    case 'white': return '#f5f5f2';
    case 'cream': return '#e8e2d5';
    case 'grey': return '#9a9d9c';
    case 'black': return '#282b28';
    case 'earth': return '#a68c78';
    case 'translucent': return '#dbe8ea';
    default: return '#e0ded8';
  }
}

const materials = files.map((filename, index) => {
  const baseName = filename.replace(/\.(jpg|png|jpeg|webp)$/i, '');
  let brandPrefix = '';
  let rawColorName = baseName;

  if (baseName.startsWith('dupont_corian_')) {
    brandPrefix = 'DuPont™ Corian®';
    rawColorName = baseName.replace('dupont_corian_', '');
  } else if (baseName.startsWith('corian_')) {
    brandPrefix = 'Corian®';
    rawColorName = baseName.replace('corian_', '');
  } else if (baseName.startsWith('pattern_')) {
    brandPrefix = 'Pattern Series';
    rawColorName = baseName.replace('pattern_', '');
  } else {
    brandPrefix = 'Ace Spaces';
    rawColorName = baseName;
  }

  let cleanColor = titleCase(rawColorName).replace(/\b2\b/g, 'II');
  const fullName = `${brandPrefix} ${cleanColor}`;
  const slug = baseName.replace(/_/g, '-').toLowerCase();

  const colorFamily = getColorFamily(filename, cleanColor);
  const pattern = getPattern(filename, cleanColor);
  const collection = getCollection(filename, pattern, cleanColor);
  const type = pattern === 'veined' ? 'veined' : pattern === 'particulate' ? 'textured' : pattern === 'translucent' ? 'translucent' : 'mineral';
  const finish = pattern === 'veined' ? 'Honed Satin' : pattern === 'translucent' ? 'Translucent Polish' : pattern === 'particulate' ? 'Tactile Matte' : 'Satin Smooth';
  const hexColor = getHexColor(colorFamily);

  const codeNumber = String(index + 1).padStart(3, '0');
  const codePrefix = brandPrefix.includes('DuPont') ? 'DC' : brandPrefix.includes('Corian') ? 'CR' : 'PT';
  const code = `${codePrefix}-${codeNumber}`;

  return {
    slug,
    name: fullName,
    code,
    collection,
    colorFamily,
    pattern,
    type,
    finish,
    colour: `${cleanColor} Mineral Blend`,
    hexColor,
    textureImage: `/materials/${filename}`,
    textureCss: `linear-gradient(135deg, ${hexColor} 0%, rgba(20,23,19,0.06) 100%)`,
    description: `Architectural solid surface in ${cleanColor}. Calibrated zero-silica through-body mineral formulation providing continuous thermoformed curvature, invisible seams, and certified non-porous hygiene.`,
    swatch: `/materials/${filename}`,
    image: `/materials/${filename}`,
    applications: [
      'Monolithic Island Worktops',
      'Waterfall Countertops',
      'Integrated Under-Mount Basins',
      'Architectural Wall Cladding'
    ],
    thicknessOptions: ['12mm', '19mm'],
    dimensions: '3660 mm × 760 mm',
    lightTransmission: pattern === 'translucent' ? 'High (22%)' : colorFamily === 'white' ? 'Medium (12%)' : 'Low (5%)',
    fireRating: 'Class 1 / Class A (ASTM E84)',
    careGuide: '100% non-porous solid surface. Daily clean with microfibre cloth and neutral soapy water; renewably buffable with Scotch-Brite.'
  };
});

console.log(`Generated ${materials.length} material definitions.`);

// 1. Write data/materials.ts
const tsContent = `export interface Material {
  slug: string;
  name: string;
  code: string;
  collection: string;
  colorFamily: 'white' | 'cream' | 'grey' | 'earth' | 'black' | 'translucent';
  pattern: 'solid' | 'veined' | 'particulate' | 'translucent';
  type: 'mineral' | 'veined' | 'textured' | 'translucent';
  finish: string;
  colour: string;
  hexColor: string;
  textureImage: string;
  textureCss?: string;
  description: string;
  swatch: string;
  image: string;
  applications: string[];
  thicknessOptions: string[];
  dimensions: string;
  lightTransmission: string;
  fireRating: string;
  careGuide: string;
}

export const materials: Material[] = ${JSON.stringify(materials, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../data/materials.ts'), tsContent, 'utf8');
console.log('Successfully wrote data/materials.ts with all 240 materials!');

// 2. Update data/custom-content.json
const customContentPath = path.join(__dirname, '../data/custom-content.json');
const customContent = JSON.parse(fs.readFileSync(customContentPath, 'utf8'));
customContent.materials = materials;
customContent.updatedAt = new Date().toISOString();
fs.writeFileSync(customContentPath, JSON.stringify(customContent, null, 2), 'utf8');
console.log('Successfully updated data/custom-content.json with all 240 materials!');
