import fs from 'fs';
import path from 'path';

const links = new Set();
function scanDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (item === 'node_modules' || item === '.next' || item === '.git') continue;
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
    } else if (/\.(tsx|ts|jsx|js)$/.test(item)) {
      const content = fs.readFileSync(full, 'utf8');
      const regex = /href=['"]([^'"]+)['"]/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const link = match[1];
        if (link.startsWith('/') && !link.startsWith('//')) {
          links.add(link);
        }
      }
    }
  }
}

scanDir('app');
scanDir('components');

async function testAll() {
  console.log('Testing', links.size, 'internal links found across codebase:\n');
  const broken = [];
  for (const l of Array.from(links).sort()) {
    try {
      const res = await fetch('http://localhost:3000' + l);
      if (res.status === 404 || res.status >= 500) {
        broken.push({ link: l, status: res.status });
        console.log(`[BROKEN] ${l.padEnd(35)} -> Status ${res.status}`);
      } else {
        console.log(`[OK]     ${l.padEnd(35)} -> Status ${res.status}`);
      }
    } catch (e) {
      broken.push({ link: l, status: e.message });
      console.log(`[ERROR]  ${l.padEnd(35)} -> Error: ${e.message}`);
    }
  }

  console.log('\n========================================');
  console.log(`Scan Complete: ${broken.length} broken links found out of ${links.size} total.`);
  if (broken.length > 0) {
    console.log('Broken links to fix:');
    broken.forEach(b => console.log(` - ${b.link} (${b.status})`));
  }
  console.log('========================================');
}

testAll();
