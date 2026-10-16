'use strict';

// Offline asset preparation only. Generated files are committed; Hexo builds do
// not need Sharp and never modify original photographs.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require(process.env.AFTERLIGHT_SHARP_MODULE || 'sharp');
const base = path.resolve(__dirname, '..');
const output = path.join(base, 'themes/afterlight/source/afterlight/images');
const inputs = [
  { source: 'img/selfie2.jpg', name: 'hero', widths: [800, 1200, 1600, 2000], quality: 90 },
  { source: '_posts/日光之下，有一只白猫/1.jpg', name: 'white-cat', widths: [480, 800, 1200, 1600], quality: 88 }
];

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const manifest = {};
  for (const { source, name, widths, quality } of inputs) {
    const original = fs.readFileSync(path.join(base, 'source', source));
    const entry = { sha256: crypto.createHash('sha256').update(original).digest('hex'), originalBytes: original.length, webp: [], jpeg: [] };
    for (const width of widths) {
      for (const format of ['webp', 'jpeg']) {
        const file = `${name}-${width}.${format === 'jpeg' ? 'jpg' : format}`;
        let pipeline = sharp(original).rotate().resize({ width, withoutEnlargement: true }).withIccProfile('srgb');
        pipeline = format === 'webp' ? pipeline.webp({ quality, effort: 6 }) : pipeline.jpeg({ quality: 90, mozjpeg: true });
        const info = await pipeline.toFile(path.join(output, file));
        entry[format].push({ url: '/afterlight/images/' + file, width: info.width, height: info.height, bytes: info.size });
      }
    }
    manifest[source] = entry;
    console.log(`${source}: ${original.length} bytes -> WebP ${entry.webp.map(item => `${item.width}w:${item.bytes}`).join(', ')}`);
  }
  fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
})().catch(error => { console.error(error); process.exitCode = 1; });
