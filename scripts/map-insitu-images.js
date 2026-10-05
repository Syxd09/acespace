const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../public/images/images');
const customContentPath = path.join(__dirname, '../data/custom-content.json');
const materialsTsPath = path.join(__dirname, '../data/materials.ts');

const files = fs.readdirSync(imgDir);
const customData = JSON.parse(fs.readFileSync(customContentPath, 'utf8'));
const materials = customData.materials || [];

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function cleanSlug(slug) {
  return slug
    .replace(/^dupont-corian-/, '')
    .replace(/^corian-/, '')
    .replace(/^pattern-/, '')
    .replace(/^pattern-grinds-/, '')
    .replace(/^grinds-/, '')
    .replace(/^css-/, '')
    .replace(/-sheet$/, '')
    .replace(/travertin\b/, 'travertine')
    .replace(/-prima$/, '');
}

function cleanName(name) {
  return name
    .replace(/^dupont™?\s*/i, '')
    .replace(/^corian®?\s*/i, '')
    .replace(/^pattern series\s*/i, '')
    .replace(/^grinds\s*/i, '')
    .replace(/travertin\b/i, 'travertine')
    .replace(/\s*prima$/i, '')
    .trim();
}

function cleanFilename(file) {
  let name = file.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  name = name.replace(/^app_(commercial|residential)_grinds_/, '');
  name = name.replace(/^app_(commercial|residential)_/, '');
  name = name.replace(/^application_/, '');
  name = name.replace(/^coriansolidsurface-/, '');
  name = name.replace(/^corian-colors-/, '');
  name = name.replace(/^corian-colours-kitchen-/, '');
  name = name.replace(/-application(-[0-9]+)?$/, '');
  name = name.replace(/_application(-[0-9]+)?$/, '');
  name = name.replace(/(-|_)[0-9]+(-[0-9]+)?$/, '');
  name = name.replace(/-hospitality$/, '');
  return name;
}

const materialToImages = new Map();
const unmatchedFiles = [];

for (const file of files) {
  const core = cleanFilename(file);
  const normCore = normalize(core);

  let matched = null;

  // 1. Exact match against cleaned slug or name
  for (const mat of materials) {
    const normSlug = normalize(cleanSlug(mat.slug));
    const normName = normalize(cleanName(mat.name));

    if (normSlug === normCore || normName === normCore) {
      matched = mat;
      break;
    }
  }

  // 2. Terrazzo / word permutation match (e.g. laguna_terrazzo vs terrazzo-laguna)
  if (!matched) {
    for (const mat of materials) {
      const normSlug = normalize(cleanSlug(mat.slug));
      if (
        (normCore.includes('laguna') && normCore.includes('terrazzo') && normSlug.includes('laguna') && normSlug.includes('terrazzo')) ||
        (normCore.includes('peppered') && normCore.includes('terrazzo') && normSlug.includes('peppered') && normSlug.includes('terrazzo'))
      ) {
        matched = mat;
        break;
      }
    }
  }

  // 3. Travertine spelling match
  if (!matched && normCore.includes('travertine')) {
    for (const mat of materials) {
      if (normCore.includes('firenze') && mat.slug.includes('firenze')) matched = mat;
      if (normCore.includes('roma') && mat.slug.includes('roma')) matched = mat;
    }
  }

  // 4. Grinds prefix or substring match
  if (!matched) {
    for (const mat of materials) {
      const normSlug = normalize(cleanSlug(mat.slug));
      if (normCore === normSlug || (normCore.length >= 4 && normSlug.includes(normCore)) || (normSlug.length >= 4 && normCore.includes(normSlug))) {
        matched = mat;
        break;
      }
    }
  }

  if (matched) {
    if (!materialToImages.has(matched.slug)) {
      materialToImages.set(matched.slug, []);
    }
    materialToImages.get(matched.slug).push('/images/images/' + file);
  } else {
    unmatchedFiles.push({ file, core });
  }
}

// Sort each material's image list so primary / angle 1 comes first
for (const [slug, imgs] of materialToImages.entries()) {
  imgs.sort((a, b) => {
    // Prefer _1 or -1 or residential
    const aRes = a.includes('residential') ? 1 : 0;
    const bRes = b.includes('residential') ? 1 : 0;
    if (aRes !== bRes) return bRes - aRes;

    const a1 = a.includes('1.') || a.includes('_1') || a.includes('-1') ? 1 : 0;
    const b1 = b.includes('1.') || b.includes('_1') || b.includes('-1') ? 1 : 0;
    if (a1 !== b1) return b1 - a1;

    return a.localeCompare(b);
  });
}

console.log('Total files in public/images/images:', files.length);
console.log('Total matched image files:', files.length - unmatchedFiles.length);
console.log('Unmatched files count:', unmatchedFiles.length);
console.log('Unique materials matched:', materialToImages.size);

// Update materials in memory
let updatedCount = 0;
for (const mat of materials) {
  if (materialToImages.has(mat.slug)) {
    const imgs = materialToImages.get(mat.slug);
    mat.image = imgs[0]; // Set primary in-situ image
    mat.inSituImage = imgs[0];
    mat.inSituImages = imgs;
    updatedCount++;
  }
}

console.log(`Updated ${updatedCount} materials with authentic in-situ images.`);

// 1. Write back to custom-content.json
customData.materials = materials;
customData.updatedAt = new Date().toISOString();
fs.writeFileSync(customContentPath, JSON.stringify(customData, null, 2), 'utf8');
console.log('Successfully wrote to data/custom-content.json');

// 2. Also update data/materials.ts
let materialsTs = fs.readFileSync(materialsTsPath, 'utf8');

// Ensure Material interface has inSituImage and inSituImages
if (!materialsTs.includes('inSituImage?: string;')) {
  materialsTs = materialsTs.replace(
    'image: string;',
    'image: string;\n  inSituImage?: string;\n  inSituImages?: string[];'
  );
}

// Replace the materials export array in materials.ts
const exportRegex = /(export const materials: Material\[\] = )(\[[\s\S]*?\]);(\s*)$/;
if (exportRegex.test(materialsTs)) {
  materialsTs = materialsTs.replace(exportRegex, `$1${JSON.stringify(materials, null, 2)};$3`);
  fs.writeFileSync(materialsTsPath, materialsTs, 'utf8');
  console.log('Successfully updated data/materials.ts');
} else {
  console.error('Could not find export const materials array in materials.ts');
}
