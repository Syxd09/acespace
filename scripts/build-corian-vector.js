const fs = require('fs');
const path = require('path');

// Generate precise vector paths for CORIAN and SOLID SURFACE
// Coordinate space:
// viewBox = "0 0 240 68"
// Top bracket: y = 6 to 14, x = 12 to 228
// CORIAN: cap height 24, from y = 14 to y = 38
// SOLID SURFACE: cap height 8, from y = 46 to y = 54
// Bottom bracket: y = 54 to 62, x = 12 to 228

// Let's create high-fidelity vector definitions for CORIAN
// Cap height: 24, stroke: 3.4
function getCorianPaths(startX, startY) {
  // Letters: C, O, R, I, A, N
  const h = 24; // cap height
  const sw = 3.4; // stroke width
  
  // C: x=0, width=22
  // Outer: arc from (20, 5) -> (11, 0) -> (0, 12) -> (11, 24) -> (20, 19)
  const C = `M ${startX + 20} ${startY + 5} 
             C ${startX + 18} ${startY + 2}, ${startX + 14.5} ${startY}, ${startX + 11} ${startY} 
             C ${startX + 4.8} ${startY}, ${startX} ${startY + 5.2}, ${startX} ${startY + 12} 
             C ${startX} ${startY + 18.8}, ${startX + 4.8} ${startY + 24}, ${startX + 11} ${startY + 24} 
             C ${startX + 14.5} ${startY + 24}, ${startX + 18} ${startY + 22}, ${startX + 20} ${startY + 19} 
             L ${startX + 18.2} ${startY + 16.2} 
             C ${startX + 16.5} ${startY + 18.5}, ${startX + 14} ${startY + 20.6}, ${startX + 11} ${startY + 20.6} 
             C ${startX + 6.6} ${startY + 20.6}, ${startX + 3.4} ${startY + 16.8}, ${startX + 3.4} ${startY + 12} 
             C ${startX + 3.4} ${startY + 7.2}, ${startX + 6.6} ${startY + 3.4}, ${startX + 11} ${startY + 3.4} 
             C ${startX + 14} ${startY + 3.4}, ${startX + 16.5} ${startY + 5.5}, ${startX + 18.2} ${startY + 7.8} Z`;

  // O: x=26, width=24
  const ox = startX + 26;
  const O = `M ${ox + 12} ${startY} 
             C ${ox + 5.2} ${startY}, ${ox} ${startY + 5.2}, ${ox} ${startY + 12} 
             C ${ox} ${startY + 18.8}, ${ox + 5.2} ${startY + 24}, ${ox + 12} ${startY + 24} 
             C ${ox + 18.8} ${startY + 24}, ${ox + 24} ${startY + 18.8}, ${ox + 24} ${startY + 12} 
             C ${ox + 24} ${startY + 5.2}, ${ox + 18.8} ${startY}, ${ox + 12} ${startY} Z 
             M ${ox + 12} ${startY + 3.4} 
             C ${ox + 17} ${startY + 3.4}, ${ox + 20.6} ${startY + 7.2}, ${ox + 20.6} ${startY + 12} 
             C ${ox + 20.6} ${startY + 16.8}, ${ox + 17} ${startY + 20.6}, ${ox + 12} ${startY + 20.6} 
             C ${ox + 7} ${startY + 20.6}, ${ox + 3.4} ${startY + 16.8}, ${ox + 3.4} ${startY + 12} 
             C ${ox + 3.4} ${startY + 7.2}, ${ox + 7} ${startY + 3.4}, ${ox + 12} ${startY + 3.4} Z`;

  // R: x=55, width=21
  const rx = startX + 55;
  const R = `M ${rx} ${startY} 
             L ${rx + 13} ${startY} 
             C ${rx + 17.5} ${startY}, ${rx + 20.5} ${startY + 2.8}, ${rx + 20.5} ${startY + 7.2} 
             C ${rx + 20.5} ${startY + 11.2}, ${rx + 17.8} ${startY + 13.8}, ${rx + 13.8} ${startY + 14.2} 
             L ${rx + 21} ${startY + 24} 
             L ${rx + 16.8} ${startY + 24} 
             L ${rx + 10.4} ${startY + 14.6} 
             L ${rx + 3.4} ${startY + 14.6} 
             L ${rx + 3.4} ${startY + 24} 
             L ${rx} ${startY + 24} Z 
             M ${rx + 3.4} ${startY + 3.4} 
             L ${rx + 12.5} ${startY + 3.4} 
             C ${rx + 15} ${startY + 3.4}, ${rx + 17.1} ${startY + 4.8}, ${rx + 17.1} ${startY + 7.2} 
             C ${rx + 17.1} ${startY + 9.6}, ${rx + 15} ${startY + 11.2}, ${rx + 12.5} ${startY + 11.2} 
             L ${rx + 3.4} ${startY + 11.2} Z`;

  // I: x=81, width=3.4
  const ix = startX + 81;
  const I = `M ${ix} ${startY} L ${ix + 3.4} ${startY} L ${ix + 3.4} ${startY + 24} L ${ix} ${startY + 24} Z`;

  // A: x=89, width=23
  const ax = startX + 89;
  const A = `M ${ax + 11.5} ${startY} 
             L ${ax + 23} ${startY + 24} 
             L ${ax + 19.2} ${startY + 24} 
             L ${ax + 15.6} ${startY + 16.5} 
             L ${ax + 7.4} ${startY + 16.5} 
             L ${ax + 3.8} ${startY + 24} 
             L ${ax} ${startY + 24} Z 
             M ${ax + 11.5} ${startY + 5.5} 
             L ${ax + 8.8} ${startY + 13.5} 
             L ${ax + 14.2} ${startY + 13.5} Z`;

  // N: x=117, width=21
  const nx = startX + 117;
  const N = `M ${nx} ${startY} 
             L ${nx + 3.4} ${startY} 
             L ${nx + 17.6} ${startY + 19.5} 
             L ${nx + 17.6} ${startY} 
             L ${nx + 21} ${startY} 
             L ${nx + 21} ${startY + 24} 
             L ${nx + 17.6} ${startY + 24} 
             L ${nx + 3.4} ${startY + 4.5} 
             L ${nx + 3.4} ${startY + 24} 
             L ${nx} ${startY + 24} Z`;

  // Registered mark ®: x=141, y=startY, diameter=6.5
  const mx = startX + 141;
  const my = startY + 1;
  const Reg = `M ${mx + 3.5} ${my} 
               C ${mx + 5.4} ${my}, ${mx + 7} ${my + 1.6}, ${mx + 7} ${my + 3.5} 
               C ${mx + 7} ${my + 5.4}, ${mx + 5.4} ${my + 7}, ${mx + 3.5} ${my + 7} 
               C ${mx + 1.6} ${my + 7}, ${mx} ${my + 5.4}, ${mx} ${my + 3.5} 
               C ${mx} ${my + 1.6}, ${mx + 1.6} ${my}, ${mx + 3.5} ${my} Z 
               M ${mx + 3.5} ${my + 0.8} 
               C ${mx + 2} ${my + 0.8}, ${mx + 0.8} ${my + 2}, ${mx + 0.8} ${my + 3.5} 
               C ${mx + 0.8} ${my + 5}, ${mx + 2} ${my + 6.2}, ${mx + 3.5} ${my + 6.2} 
               C ${mx + 5} ${my + 6.2}, ${mx + 6.2} ${my + 5}, ${mx + 6.2} ${my + 3.5} 
               C ${mx + 6.2} ${my + 2}, ${mx + 5} ${my + 0.8}, ${mx + 3.5} ${my + 0.8} Z 
               M ${mx + 2.2} ${my + 2} 
               L ${mx + 3.8} ${my + 2} 
               C ${mx + 4.6} ${my + 2}, ${mx + 5} ${my + 2.4}, ${mx + 5} ${my + 3} 
               C ${mx + 5} ${my + 3.6}, ${mx + 4.5} ${my + 4}, ${mx + 3.8} ${my + 4} 
               L ${mx + 5.1} ${my + 5.4} 
               L ${mx + 4.3} ${my + 5.4} 
               L ${mx + 3.2} ${my + 4.1} 
               L ${mx + 2.8} ${my + 4.1} 
               L ${mx + 2.8} ${my + 5.4} 
               L ${mx + 2.2} ${my + 5.4} Z 
               M ${mx + 2.8} ${my + 2.6} 
               L ${mx + 3.7} ${my + 2.6} 
               C ${mx + 4.1} ${my + 2.6}, ${mx + 4.3} ${my + 2.8}, ${mx + 4.3} ${my + 3.1} 
               C ${mx + 4.3} ${my + 3.4}, ${mx + 4.1} ${my + 3.6}, ${mx + 3.7} ${my + 3.6} 
               L ${mx + 2.8} ${my + 3.6} Z`;

  return `${C} ${O} ${R} ${I} ${A} ${N} ${Reg}`;
}

// Letter definitions for SOLID SURFACE
// Height = 6.5px, stroke width = 1.0px
function getSolidSurfacePaths(startX, startY) {
  const letters = 'SOLID SURFACE';
  // Let's create an accurate renderer for each letter
  let x = startX;
  let paths = [];
  const h = 6.5;
  const sw = 0.95;

  for (let char of letters) {
    if (char === ' ') {
      x += 6.5;
      continue;
    }

    if (char === 'S') {
      const w = 4.6;
      paths.push(`M ${x + 4.2} ${startY + 1.4} 
                  C ${x + 3.8} ${startY + 0.4}, ${x + 2.9} ${startY}, ${x + 2.2} ${startY} 
                  C ${x + 1} ${startY}, ${x} ${startY + 0.8}, ${x} ${startY + 1.8} 
                  C ${x} ${startY + 2.8}, ${x + 0.8} ${startY + 3.2}, ${x + 2} ${startY + 3.5} 
                  C ${x + 3.4} ${startY + 3.8}, ${x + 4.6} ${startY + 4.3}, ${x + 4.6} ${startY + 5.3} 
                  C ${x + 4.6} ${startY + 6.3}, ${x + 3.5} ${startY + 7.1}, ${x + 2.2} ${startY + 7.1} 
                  C ${x + 1.1} ${startY + 7.1}, ${x + 0.4} ${startY + 6.5}, ${x} ${startY + 5.6} 
                  L ${x + 0.9} ${startY + 5.2} 
                  C ${x + 1.1} ${startY + 5.8}, ${x + 1.6} ${startY + 6.2}, ${x + 2.2} ${startY + 6.2} 
                  C ${x + 2.9} ${startY + 6.2}, ${x + 3.6} ${startY + 5.7}, ${x + 3.6} ${startY + 5.2} 
                  C ${x + 3.6} ${startY + 4.5}, ${x + 3} ${startY + 4.1}, ${x + 1.8} ${startY + 3.8} 
                  C ${x + 0.6} ${startY + 3.5}, ${x} ${startY + 2.8}, ${x} ${startY + 1.8} 
                  C ${x} ${startY + 0.8}, ${x + 0.9} ${startY}, ${x + 2.2} ${startY} 
                  C ${x + 3.2} ${startY}, ${x + 3.9} ${startY + 0.6}, ${x + 4.1} ${startY + 1.3} Z`);
      x += w + 4.2;
    } else if (char === 'O') {
      const w = 5.2;
      paths.push(`M ${x + 2.6} ${startY} 
                  C ${x + 1.1} ${startY}, ${x} ${startY + 1.6}, ${x} ${startY + 3.55} 
                  C ${x} ${startY + 5.5}, ${x + 1.1} ${startY + 7.1}, ${x + 2.6} ${startY + 7.1} 
                  C ${x + 4.1} ${startY + 7.1}, ${x + 5.2} ${startY + 5.5}, ${x + 5.2} ${startY + 3.55} 
                  C ${x + 5.2} ${startY + 1.6}, ${x + 4.1} ${startY}, ${x + 2.6} ${startY} Z 
                  M ${x + 2.6} ${startY + sw} 
                  C ${x + 3.5} ${startY + sw}, ${x + 4.2} ${startY + 2.2}, ${x + 4.2} ${startY + 3.55} 
                  C ${x + 4.2} ${startY + 4.9}, ${x + 3.5} ${startY + 6.1}, ${x + 2.6} ${startY + 6.1} 
                  C ${x + 1.7} ${startY + 6.1}, ${x + 1} ${startY + 4.9}, ${x + 1} ${startY + 3.55} 
                  C ${x + 1} ${startY + 2.2}, ${x + 1.7} ${startY + sw}, ${x + 2.6} ${startY + sw} Z`);
      x += w + 4.2;
    } else if (char === 'L') {
      const w = 4.2;
      paths.push(`M ${x} ${startY} L ${x + sw} ${startY} L ${x + sw} ${startY + 6.1} L ${x + w} ${startY + 6.1} L ${x + w} ${startY + 7.1} L ${x} ${startY + 7.1} Z`);
      x += w + 4.2;
    } else if (char === 'I') {
      const w = sw;
      paths.push(`M ${x} ${startY} L ${x + sw} ${startY} L ${x + sw} ${startY + 7.1} L ${x} ${startY + 7.1} Z`);
      x += w + 4.2;
    } else if (char === 'D') {
      const w = 5.0;
      paths.push(`M ${x} ${startY} 
                  L ${x + 2.8} ${startY} 
                  C ${x + 4.2} ${startY}, ${x + 5.0} ${startY + 1.4}, ${x + 5.0} ${startY + 3.55} 
                  C ${x + 5.0} ${startY + 5.7}, ${x + 4.2} ${startY + 7.1}, ${x + 2.8} ${startY + 7.1} 
                  L ${x} ${startY + 7.1} Z 
                  M ${x + sw} ${startY + sw} 
                  L ${x + 2.7} ${startY + sw} 
                  C ${x + 3.6} ${startY + sw}, ${x + 4.0} ${startY + 2.1}, ${x + 4.0} ${startY + 3.55} 
                  C ${x + 4.0} ${startY + 5.0}, ${x + 3.6} ${startY + 6.1}, ${x + 2.7} ${startY + 6.1} 
                  L ${x + sw} ${startY + 6.1} Z`);
      x += w + 4.2;
    } else if (char === 'U') {
      const w = 4.8;
      paths.push(`M ${x} ${startY} 
                  L ${x + sw} ${startY} 
                  L ${x + sw} ${startY + 4.5} 
                  C ${x + sw} ${startY + 5.7}, ${x + 1.7} ${startY + 6.1}, ${x + 2.4} ${startY + 6.1} 
                  C ${x + 3.1} ${startY + 6.1}, ${x + w - sw} ${startY + 5.7}, ${x + w - sw} ${startY + 4.5} 
                  L ${x + w - sw} ${startY} 
                  L ${x + w} ${startY} 
                  L ${x + w} ${startY + 4.5} 
                  C ${x + w} ${startY + 6.3}, ${x + 3.5} ${startY + 7.1}, ${x + 2.4} ${startY + 7.1} 
                  C ${x + 1.3} ${startY + 7.1}, ${x} ${startY + 6.3}, ${x} ${startY + 4.5} Z`);
      x += w + 4.2;
    } else if (char === 'R') {
      const w = 4.8;
      paths.push(`M ${x} ${startY} 
                  L ${x + 3.2} ${startY} 
                  C ${x + 4.3} ${startY}, ${x + 4.8} ${startY + 0.9}, ${x + 4.8} ${startY + 2.2} 
                  C ${x + 4.8} ${startY + 3.3}, ${x + 4.2} ${startY + 4.1}, ${x + 3.2} ${startY + 4.2} 
                  L ${x + 4.9} ${startY + 7.1} 
                  L ${x + 3.7} ${startY + 7.1} 
                  L ${x + 2.3} ${startY + 4.3} 
                  L ${x + sw} ${startY + 4.3} 
                  L ${x + sw} ${startY + 7.1} 
                  L ${x} ${startY + 7.1} Z 
                  M ${x + sw} ${startY + sw} 
                  L ${x + 3.1} ${startY + sw} 
                  C ${x + 3.6} ${startY + sw}, ${x + 3.9} ${startY + 1.5}, ${x + 3.9} ${startY + 2.2} 
                  C ${x + 3.9} ${startY + 2.9}, ${x + 3.6} ${startY + 3.3}, ${x + 3.1} ${startY + 3.3} 
                  L ${x + sw} ${startY + 3.3} Z`);
      x += w + 4.2;
    } else if (char === 'F') {
      const w = 4.2;
      paths.push(`M ${x} ${startY} L ${x + w} ${startY} L ${x + w} ${startY + sw} L ${x + sw} ${startY + sw} L ${x + sw} ${startY + 3.1} L ${x + 3.5} ${startY + 3.1} L ${x + 3.5} ${startY + 4.0} L ${x + sw} ${startY + 4.0} L ${x + sw} ${startY + 7.1} L ${x} ${startY + 7.1} Z`);
      x += w + 4.2;
    } else if (char === 'A') {
      const w = 5.2;
      paths.push(`M ${x + 2.6} ${startY} 
                  L ${x + 5.2} ${startY + 7.1} 
                  L ${x + 4.1} ${startY + 7.1} 
                  L ${x + 3.3} ${startY + 4.9} 
                  L ${x + 1.9} ${startY + 4.9} 
                  L ${x + 1.1} ${startY + 7.1} 
                  L ${x} ${startY + 7.1} Z 
                  M ${x + 2.6} ${startY + 1.9} 
                  L ${x + 2.1} ${startY + 4.0} 
                  L ${x + 3.1} ${startY + 4.0} Z`);
      x += w + 4.2;
    } else if (char === 'C') {
      const w = 4.8;
      paths.push(`M ${x + 4.5} ${startY + 1.6} 
                  C ${x + 4.0} ${startY + 0.6}, ${x + 3.4} ${startY}, ${x + 2.4} ${startY} 
                  C ${x + 1.0} ${startY}, ${x} ${startY + 1.6}, ${x} ${startY + 3.55} 
                  C ${x} ${startY + 5.5}, ${x + 1.0} ${startY + 7.1}, ${x + 2.4} ${startY + 7.1} 
                  C ${x + 3.4} ${startY + 7.1}, ${x + 4.1} ${startY + 6.5}, ${x + 4.5} ${startY + 5.5} 
                  L ${x + 3.6} ${startY + 5.0} 
                  C ${x + 3.4} ${startY + 5.6}, ${x + 3.0} ${startY + 6.1}, ${x + 2.4} ${startY + 6.1} 
                  C ${x + 1.5} ${startY + 6.1}, ${x + sw} ${startY + 5.0}, ${x + sw} ${startY + 3.55} 
                  C ${x + sw} ${startY + 2.1}, ${x + 1.5} ${startY + sw}, ${x + 2.4} ${startY + sw} 
                  C ${x + 3.0} ${startY + sw}, ${x + 3.4} ${startY + 1.5}, ${x + 3.6} ${startY + 2.0} Z`);
      x += w + 4.2;
    } else if (char === 'E') {
      const w = 4.2;
      paths.push(`M ${x} ${startY} L ${x + w} ${startY} L ${x + w} ${startY + sw} L ${x + sw} ${startY + sw} L ${x + sw} ${startY + 3.0} L ${x + 3.6} ${startY + 3.0} L ${x + 3.6} ${startY + 3.9} L ${x + sw} ${startY + 3.9} L ${x + sw} ${startY + 6.1} L ${x + w} ${startY + 6.1} L ${x + w} ${startY + 7.1} L ${x} ${startY + 7.1} Z`);
      x += w + 4.2;
    }
  }

  return { path: paths.join(' '), endX: x };
}

// Calculate widths and centers
const corianPath = getCorianPaths(46, 15);
const solidSurface = getSolidSurfacePaths(48, 45);

const corianSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 68" fill="none" role="img" aria-label="Corian Solid Surface Official Trademark Logo">
  <!-- Top Red Bracket -->
  <path d="M 20 18 L 20 6 L 220 6 L 220 18" stroke="#E51E25" stroke-width="2.5" stroke-linecap="square" fill="none"/>
  
  <!-- CORIAN Brand Wordmark (Pure Vector Paths) -->
  <path d="${corianPath}" fill="#E51E25" fill-rule="evenodd"/>
  
  <!-- SOLID SURFACE Subtitle (Pure Vector Paths) -->
  <path d="${solidSurface.path}" fill="#6E766C" fill-rule="evenodd"/>
  
  <!-- Bottom Red Bracket -->
  <path d="M 20 50 L 20 62 L 220 62 L 220 50" stroke="#E51E25" stroke-width="2.5" stroke-linecap="square" fill="none"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, '../public/images/corian-solid-surface-logo.svg'), corianSvg.trim(), 'utf8');
console.log('Saved corian-solid-surface-logo.svg');
