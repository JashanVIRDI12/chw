// Mechanical exports only: generated originals remain unchanged.
// Run after generation: node scripts/export-campaign-product-images.mjs
import sharp from 'sharp';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output/imagegen/chw-surgical-square');
const web = path.join(root, 'campaign/assets/img/generated');
const manifest = JSON.parse(await readFile(path.join(output, 'generation-manifest.json'), 'utf8'));
for (const directory of [web, path.join(output, 'originals'), path.join(output, '4k')]) {
    await mkdir(directory, { recursive: true });
}
const exports = [];
const tiles = [];
for (const [index, product] of manifest.products.entries()) {
    const original = path.join(output, 'originals', `${product.id}.png`);
    try { await readFile(original); } catch { await copyFile(product.source, original); }
    const metadata = await sharp(original).metadata();
    if (metadata.width !== metadata.height) throw new Error(`${product.id} must be square`);
    await sharp(original)
        .resize(3840, 3840, { fit: 'contain', kernel: 'lanczos3' })
        .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
        .toFile(path.join(output, '4k', `CHW-${product.id}-square-3840.jpg`));
    for (const size of [480, 800, 1200]) {
        await sharp(original).resize(size, size, { kernel: 'lanczos3' })
            .webp({ quality: 87, effort: 5 })
            .toFile(path.join(web, `${product.id}-${size}.webp`));
    }
    exports.push({
        id: product.id,
        original: `originals/${product.id}.png`,
        generatedDimensions: `${metadata.width}x${metadata.height}`,
        fullSizeExport: `4k/CHW-${product.id}-square-3840.jpg`,
        exportDimensions: '3840x3840',
        upscaled: metadata.width < 3840,
        websiteImage: `campaign/assets/img/generated/${product.id}-1200.webp`
    });
    tiles.push({
        input: await sharp(original).resize(480, 480).toBuffer(),
        left: (index % 4) * 480, top: Math.floor(index / 4) * 520
    });
    const label = Buffer.from(`<svg width="480" height="40"><rect width="480" height="40" fill="#f7f7f0"/><text x="18" y="27" font-family="Arial" font-size="17" fill="#123d2e">CHW / ${product.id.toUpperCase()}</text></svg>`);
    tiles.push({ input: label, left: (index % 4) * 480, top: Math.floor(index / 4) * 520 + 480 });
    console.log(`${product.id}: native ${metadata.width}x${metadata.height}; export 3840x3840; web 480/800/1200`);
}
await sharp({ create: { width: 1920, height: 1040, channels: 3, background: '#f7f7f0' } })
    .composite(tiles).jpeg({ quality: 94 }).toFile(path.join(output, 'contact-sheet.jpg'));
await writeFile(path.join(output, 'exports.json'), JSON.stringify(exports, null, 2) + '\n');
const notes = `CHW — Square surgical product studio images\n\nEight packaging-reference images generated with the built-in image_gen tool.\nAll exports are square, 1:1, with original pack colours and branding referenced.\n\n4K EXPORTS\nThe JPEG files are 3840 x 3840 pixels. They were upscaled from the generated\noriginals with Lanczos3 resampling; they are not native 4K generations.\nOriginal generated dimensions are recorded in exports.json.\n\nWEBSITE\nThe campaign uses responsive WebP files at 480, 800 and 1200 pixels to keep\nthe page fast. Generated originals and reference photos are preserved.\nProduct packaging print details may vary in generated visuals.\n\nPRODUCT IDS\neab: Elastic Adhesive Bandage\nfixator: IV Cannula Fixator\nsyringe: 3 ml Syringe\ncrepe: Cotton Crepe Bandage\nsilicone: Silicone Tape\nroll: Roll Bandage\nswab: Gauze Swabs\nabd: Abdominal Sponges\n`;
await writeFile(path.join(output, 'README.txt'), notes);
await writeFile(path.join(output, '4k/README.txt'), notes);
