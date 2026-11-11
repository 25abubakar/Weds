/**
 * Full-frame HD only — one saved photo = one carousel slide (no zoom/crop duplicates).
 * Drop new files as src/assets/slide-8.jpg etc. then: npm run gallery:build
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

const OUT_DIR = 'src/assets/gallery';
const ASSETS = 'src/assets';
const W = 1600;
const H = 1067;
const jpeg = { quality: 93, mozjpeg: true };

function fileHash(file) {
  return crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
}

function discoverSources() {
  const list = [];

  const slides = fs
    .readdirSync(ASSETS)
    .filter((f) => /^slide-\d+\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => {
      const na = Number(a.match(/\d+/)?.[0] ?? 0);
      const nb = Number(b.match(/\d+/)?.[0] ?? 0);
      return na - nb;
    })
    .map((f) => path.join(ASSETS, f));

  list.push(...slides);
  return list;
}

async function toHdFullFrame(input, output) {
  await sharp(input)
    .rotate()
    .resize(W, H, {
      fit: 'cover',
      position: 'centre',
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 0.35 })
    .jpeg(jpeg)
    .toFile(output);
}

async function hdifyOriginal(input) {
  const meta = await sharp(input).metadata();
  const long = Math.max(meta.width ?? 0, meta.height ?? 0);
  if (long >= 1550) return;

  const tmp = `${input}.hd-tmp`;
  await sharp(input)
    .rotate()
    .resize({
      width: (meta.width ?? 0) >= (meta.height ?? 0) ? W : undefined,
      height: (meta.height ?? 0) > (meta.width ?? 0) ? W : undefined,
      fit: 'inside',
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.6 })
    .jpeg({ ...jpeg, quality: 90 })
    .toFile(tmp);
  fs.renameSync(tmp, input);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const old of fs.readdirSync(OUT_DIR)) {
  if (old.startsWith('walima-') && old.endsWith('.jpg')) {
    fs.unlinkSync(path.join(OUT_DIR, old));
  }
}

const seenHash = new Set();
let index = 0;

for (const file of discoverSources()) {
  const hash = fileHash(file);
  if (seenHash.has(hash)) {
    console.warn('SKIP duplicate', file);
    continue;
  }
  seenHash.add(hash);

  try {
    await hdifyOriginal(file);
    index += 1;
    const out = path.join(OUT_DIR, `walima-${String(index).padStart(2, '0')}.jpg`);
    await toHdFullFrame(file, out);
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log('OK', path.basename(out), '<-', file, kb, 'KB');
  } catch (err) {
    console.error('FAIL', file, err.message);
  }
}

console.log(`\nGallery: ${index} full-frame HD slides (add slide-8.jpg, slide-9.jpg… then re-run).`);
