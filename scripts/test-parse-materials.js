const fs = require('fs');
const path = require('path');

const materialsDir = path.join(__dirname, '../public/materials');
const files = fs.readdirSync(materialsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

console.log('Total material files found:', files.length);

function titleCase(str) {
  return str
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function parseFileInfo(filename) {
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

  // Clean color name
  let cleanColor = titleCase(rawColorName);

  // Handle common suffixes like "-2"
  cleanColor = cleanColor.replace(/\b2\b/g, 'II');

  const fullName = `${brandPrefix} ${cleanColor}`;
  const slug = baseName.replace(/_/g, '-').toLowerCase();

  return {
    filename,
    slug,
    brandPrefix,
    cleanColor,
    fullName
  };
}

const parsedList = files.map(parseFileInfo);
console.log('Sample parsed:');
parsedList.slice(0, 10).forEach(p => console.log(`[${p.brandPrefix}] ${p.cleanColor} -> Slug: ${p.slug}`));
console.log('...');
parsedList.slice(-5).forEach(p => console.log(`[${p.brandPrefix}] ${p.cleanColor} -> Slug: ${p.slug}`));
