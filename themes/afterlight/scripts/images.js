'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const manifest = require('../source/afterlight/images/manifest.json');
const images = new Map();
for (const [source, entry] of Object.entries(manifest)) {
  const original = path.join(hexo.source_dir, source);
  // If the author replaces an original, show the new photo immediately rather
  // than silently retaining outdated derivatives. Regenerate to optimize it.
  if (fs.existsSync(original) && crypto.createHash('sha256').update(fs.readFileSync(original)).digest('hex') === entry.sha256) images.set(source, entry);
}
hexo.extend.helper.register('afterlight_image', source => images.get(source));
