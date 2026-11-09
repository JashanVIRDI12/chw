// Builds the Vitantra herbal range for the campaign page from the main site's data.
// Run from the repo root:  node scripts/export-campaign-herbal.mjs
//  - campaign/src/data/herbal.json      (names, botanicals, taglines, key points)
//  - campaign/assets/img/herbal/*.webp  (pack shot 640px + lifestyle shot 480/800px)
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(await readFile(path.join(root, 'js/single-herb-data.js'), 'utf8'), ctx);
vm.runInContext(await readFile(path.join(root, 'js/vitantra-keypoints.js'), 'utf8'), ctx);
const herbs = ctx.window.singleHerbProducts;
const kp = ctx.window.vitantraKeypoints;

const out = path.join(root, 'campaign/assets/img/herbal');
await mkdir(out, { recursive: true });

const items = [];
for (const [id, h] of Object.entries(herbs)) {
    if (!h || !h.title) continue;
    const name = h.title.replace(/\s*Capsules?$/i, '').trim();
    // first ingredient line holds "Amla Extract (Emblica officinalis)  Standardized…"
    const first = String((h.ingredients || [])[0] || '').split(/\s{2,}/)[0].trim();
    let botanical = (first.match(/\(([^)]+)\)/) || [])[1] || '';
    if (/\d|mg/i.test(botanical)) botanical = id === 'triphala' ? 'Amla · Haritaki · Bibhitaki' : '';
    const pack = path.join(root, h.image);
    const scene = path.join(root, h.image2 || h.image);
    await sharp(pack).resize(640, 640, { fit: 'cover' }).webp({ quality: 84, effort: 5 }).toFile(path.join(out, `${id}-pack.webp`));
    for (const size of [480, 800]) {
        await sharp(scene).resize(size, size, { fit: 'cover' }).webp({ quality: 82, effort: 5 }).toFile(path.join(out, `${id}-${size}.webp`));
    }
    items.push({
        id, name, botanical, extract: first,
        tagline: h.tagline || '',
        points: (kp[id] && kp[id].keypoints) || [],
        dosage: (h.dosage || '').replace(/\s+/g, ' ').trim()
    });
}
items.sort((a, b) => a.name.localeCompare(b.name));
await writeFile(path.join(root, 'campaign/src/data/herbal.json'), JSON.stringify({ brand: 'Vitantra', format: 'Capsules', items }, null, 2));
console.log(`herbal.json: ${items.length} herbs; images → ${path.relative(root, out)}`);
