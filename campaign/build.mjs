// Builds the campaign landing page: bundles src/ → assets/js (code-split, minified)
// and src/styles.css + icon set → assets/campaign.css.
// Run from the repo root:  npm run build:campaign
import { build } from 'rolldown';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// GSAP gets its own hashed chunk so the lazy 3D chunk never imports the entry
// file (main.js carries a ?v= query; importing it bare would run it twice).
await build({
    input: join(here, 'src/main.js'),
    output: {
        dir: join(here, 'assets/js'),
        format: 'esm',
        minify: true,
        cleanDir: true,
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        advancedChunks: { groups: [{ name: 'gsap', test: /node_modules[\\/]gsap/ }] }
    }
});
for (const f of readdirSync(join(here, 'assets/js'))) {
    const src = readFileSync(join(here, 'assets/js', f), 'utf8');
    if (f !== 'main.js' && /from\s*["']\.\/main\.js["']/.test(src)) throw new Error(`${f} imports the entry chunk`);
    console.log(`js/${f} ${(src.length / 1024).toFixed(1)} KB`);
}

// Stroke icons (Lucide-style, ISC) + WhatsApp glyph (Simple Icons, CC0)
const S = (d) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${d}</svg>`;
const P = (...ds) => ds.map(d => `<path d='${d}'/>`).join('');
const icons = {
    x: S(P('M18 6 6 18', 'm6 6 12 12')),
    check: S(P('M20 6 9 17l-5-5')),
    plus: S(P('M12 5v14', 'M5 12h14')),
    left: S(P('m15 18-6-6 6-6')),
    right: S(P('m9 18 6-6-6-6')),
    arrow: S(P('M5 12h14', 'm12 5 7 7-7 7')),
    download: S(P('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm7 10 5 5 5-5', 'M12 15V3')),
    menu: S(P('M4 6h16', 'M4 12h16', 'M4 18h16')),
    list: S(P('M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01')),
    search: S(`<circle cx='11' cy='11' r='8'/>` + P('m21 21-4.3-4.3')),
    camera: S(P('M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z') + `<circle cx='12' cy='13' r='3'/>`),
    sheet: S(P('M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z', 'M14 2v4a2 2 0 0 0 2 2h4', 'M8 13h2', 'M14 13h2', 'M8 17h2', 'M14 17h2')),
    file: S(P('M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z', 'M14 2v4a2 2 0 0 0 2 2h4', 'M10 9H8', 'M16 13H8', 'M16 17H8')),
    wand: S(P('M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z', 'M20 3v4', 'M22 5h-4')),
    expand: S(P('M15 3h6v6', 'M9 21H3v-6', 'M21 3l-7 7', 'M3 21l7-7')),
    pointer: S(P('M14 4.1 12 6', 'm5.1 8-2.9-.8', 'm6 12-1.9 2', 'M7.2 2.2 8 5.1', 'M9.04 9.69a.5.5 0 0 1 .65-.65l11 4.5a.5.5 0 0 1-.07.95l-4.35 1.04a1 1 0 0 0-.74.74l-1.04 4.35a.5.5 0 0 1-.95.07z')),
    drag: S(P('M3 12a9 9 0 0 1 15-6.7L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-15 6.7L3 16', 'M3 21v-5h5')),
    cube: S(P('M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z', 'M3.3 7 12 12l8.7-5', 'M12 22V12')),
    box: S(P('M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z', 'M3.3 7 12 12l8.7-5', 'M12 22V12', 'm7.5 4.27 9 5.15')),
    ship: S(P('M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', 'M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76', 'M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6', 'M12 10v4', 'M12 2v3')),
    layers: S(P('M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z', 'm2 12 8.58 3.91a2 2 0 0 0 1.66 0L22 12', 'm2 17 8.58 3.91a2 2 0 0 0 1.66 0L22 17')),
    cross: S(P('M9 3h6v6h6v6h-6v6H9v-6H3V9h6z')),
    globe: S(`<circle cx='12' cy='12' r='10'/>` + P('M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20', 'M2 12h20')),
    calendar: S(`<rect width='18' height='18' x='3' y='4' rx='2'/>` + P('M16 2v4', 'M8 2v4', 'M3 10h18')),
    shield: S(P('M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4')),
    factory: S(P('M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z', 'M17 18h1', 'M12 18h1', 'M7 18h1')),
    award: S(P('m15.48 12.89 1.51 8.53a.5.5 0 0 1-.81.47l-3.58-2.69a1 1 0 0 0-1.2 0l-3.59 2.69a.5.5 0 0 1-.81-.47l1.51-8.53') + "<circle cx='12' cy='8' r='6'/>"),
    clipboard: S("<rect width='8' height='4' x='8' y='2' rx='1'/>" + P('M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'm9 14 2 2 4-4')),
    flask: S(P('M14 2v6a2 2 0 0 0 .25.96l5.5 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.75-2.96l5.5-10.08A2 2 0 0 0 10 8V2', 'M6.45 15h11.1', 'M8.5 2h7')),
    leaf: S(P('M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z', 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12')),
    copy: S(`<rect width='14' height='14' x='8' y='8' rx='2' ry='2'/>` + P('M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2')),
    capsule: S(P('m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z', 'm8.5 8.5 7 7')),
    wa: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41Z'/></svg>`
};
const enc = (svg) => svg.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/#/g, '%23').replace(/"/g, "'");
const iconCss = Object.entries(icons).map(([k, v]) => `.ic-${k}{--i:url("data:image/svg+xml,${enc(v)}")}`).join('\n');

const css = readFileSync(join(here, 'src/styles.css'), 'utf8') + '\n' + iconCss;
const min = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
writeFileSync(join(here, 'assets/campaign.css'), min);
console.log(`campaign.css ${(min.length / 1024).toFixed(1)} KB`);

// Cache-bust: Vercel caches JS/CSS for a week, so stamp a build version into index.html
const v = Date.now().toString(36);
const htmlPath = join(here, 'index.html');
const mainSrc = readFileSync(join(here, 'assets/js/main.js'), 'utf8');
const deps = [...new Set([...mainSrc.matchAll(/(?:^|;)\s*import\s*(?:[\w$*{},\s]+from\s*)?["']\.\/([^"']+\.js)["']/g)].map(m => m[1]))];
const preloads = [`    <link rel="modulepreload" href="assets/js/main.js?v=${v}">`, ...deps.map(d => `    <link rel="modulepreload" href="assets/js/${d}">`)].join('\n');
const html = readFileSync(htmlPath, 'utf8')
    .replace(/assets\/campaign\.css(\?v=[a-z0-9]+)?/g, `assets/campaign.css?v=${v}`)
    .replace(/(    <link rel="modulepreload" href="assets\/js\/[^"]+">\n)+/, preloads + '\n')
    .replace(/assets\/js\/main\.js(\?v=[a-z0-9]+)?/g, `assets/js/main.js?v=${v}`);
writeFileSync(htmlPath, html);
console.log('stamped version', v);
