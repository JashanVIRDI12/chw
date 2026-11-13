// Canvas painters for product packaging. Each painter returns a <canvas>
// that the 3D stages upload as a texture. Artwork mirrors CHW's real packs.

const IMG = 'assets/img/';
const G = '#0b5f3f';        // Chase+ pack green
const G_DEEP = '#07432c';
const PEACH = '#e9b79d';
const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';
const SERIF = '"Cormorant Garamond", Georgia, serif';

const imgCache = new Map();
export function loadImage(name) {
    if (!imgCache.has(name)) {
        imgCache.set(name, new Promise((resolve, reject) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = IMG + name;
        }));
    }
    return imgCache.get(name);
}

let assets;
export async function loadPackAssets() {
    if (!assets) {
        assets = (async () => {
            const fonts = ['800 64px Inter', '700 64px Inter', '600 64px Inter', '500 64px Inter',
                '700 64px "Cormorant Garamond"', '600 64px "Cormorant Garamond"'];
            await Promise.race([
                Promise.all(fonts.map(f => document.fonts.load(f).catch(() => null))),
                new Promise(r => setTimeout(r, 2500))
            ]);
            const [markGreen, markCream, pouch, sachet] = await Promise.all(
                ['mark-green.webp', 'mark-cream.webp', 'tex-syringe-pouch.webp', 'tex-fixator-sachet.webp'].map(loadImage));
            return { markGreen, markCream, pouch, sachet };
        })();
    }
    return assets;
}

function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return [c, c.getContext('2d')];
}

function font(ctx, weight, size, family = SANS) { ctx.font = `${weight} ${size}px ${family}`; }

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function fitText(ctx, text, maxW, size, weight, family = SANS, min = 10) {
    let s = size;
    font(ctx, weight, s, family);
    while (ctx.measureText(text).width > maxW && s > min) { s -= 1; font(ctx, weight, s, family); }
    return s;
}

// CHW lockup: leaf mark + "CHW" + "care beyond cure"
function lockup(ctx, a, x, y, h, color, align = 'center', light = false) {
    const mark = light ? a.markCream : a.markGreen;
    const mw = h * (mark.width / mark.height);
    font(ctx, 800, h * 0.52);
    const tw = Math.max(ctx.measureText('CHW').width, h * 1.25);
    const total = mw + h * 0.18 + tw;
    const x0 = align === 'center' ? x - total / 2 : x;
    ctx.drawImage(mark, x0, y, mw, h);
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    font(ctx, 800, h * 0.52);
    ctx.fillText('CHW', x0 + mw + h * 0.18, y + h * 0.62);
    font(ctx, 500, h * 0.16);
    ctx.fillText('care beyond cure', x0 + mw + h * 0.2, y + h * 0.86);
    return total;
}

// Chase+ wordmark with its two swoosh arcs
function chaseMark(ctx, x, y, size, color, align = 'center') {
    font(ctx, 800, size);
    ctx.textBaseline = 'alphabetic';
    const w = ctx.measureText('Chase+').width;
    const x0 = align === 'center' ? x - w / 2 : x;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.fillText('Chase+', x0, y);
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(2, size * 0.045);
    const cx = x0 + w * 0.5, cy = y - size * 0.34, rx = w * 0.42, ry = size * 0.78;
    ctx.beginPath(); ctx.ellipse(cx + w * 0.04, cy, rx, ry, 0, Math.PI * 1.2, Math.PI * 1.72); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx - w * 0.04, cy, rx, ry, 0, Math.PI * 0.22, Math.PI * 0.8); ctx.stroke();
    return w;
}

function pill(ctx, text, cx, cy, size, bg, fg) {
    font(ctx, 600, size);
    const w = ctx.measureText(text).width + size * 1.3, h = size * 1.6;
    ctx.fillStyle = bg;
    roundRect(ctx, cx - w / 2, cy - h / 2, w, h, size * 0.3);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, cy + size * 0.04);
    ctx.textBaseline = 'alphabetic';
}

function leaf(ctx, x, y, s, rot, fill) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(s * 0.5, -s * 0.3, s * 0.55, -s * 0.9, 0, -s * 1.3);
    ctx.bezierCurveTo(-s * 0.55, -s * 0.9, -s * 0.5, -s * 0.3, 0, 0);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.05); ctx.lineTo(0, -s * 1.15); ctx.stroke();
    ctx.restore();
}

// Feature icon in a ring
function icon(ctx, kind, cx, cy, r, color) {
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = r * 0.08; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    const s = r * 0.5;
    ctx.beginPath();
    if (kind === 'skin') {
        ctx.moveTo(cx, cy + s);
        ctx.quadraticCurveTo(cx - s * 1.1, cy, cx, cy - s);
        ctx.quadraticCurveTo(cx + s * 1.1, cy, cx, cy + s);
        ctx.moveTo(cx, cy + s); ctx.lineTo(cx, cy - s * 0.6);
    } else if (kind === 'breath') {
        for (let i = -1; i <= 1; i++) {
            ctx.moveTo(cx - s, cy + i * s * 0.6);
            ctx.bezierCurveTo(cx - s * 0.3, cy + i * s * 0.6 - s * 0.35, cx + s * 0.3, cy + i * s * 0.6 + s * 0.35, cx + s, cy + i * s * 0.6);
        }
    } else if (kind === 'elastic') {
        ctx.moveTo(cx - s, cy); ctx.lineTo(cx + s, cy);
        ctx.moveTo(cx - s, cy - s * 0.5); ctx.lineTo(cx - s, cy + s * 0.5);
        ctx.moveTo(cx + s, cy - s * 0.5); ctx.lineTo(cx + s, cy + s * 0.5);
        ctx.moveTo(cx - s * 0.6, cy - s * 0.3); ctx.lineTo(cx - s * 0.6, cy + s * 0.3);
        ctx.moveTo(cx + s * 0.6, cy - s * 0.3); ctx.lineTo(cx + s * 0.6, cy + s * 0.3);
    } else if (kind === 'secure') {
        ctx.moveTo(cx - s * 0.7, cy - s); ctx.lineTo(cx + s * 0.7, cy - s); ctx.lineTo(cx - s * 0.7, cy + s);
        ctx.lineTo(cx + s * 0.7, cy + s); ctx.closePath();
    } else if (kind === 'edges') {
        roundRect(ctx, cx - s, cy - s * 0.45, s * 2, s * 0.9, s * 0.2);
        ctx.moveTo(cx - s * 0.35, cy - s * 0.45); ctx.lineTo(cx - s * 0.35, cy + s * 0.45);
        ctx.moveTo(cx + s * 0.35, cy - s * 0.45); ctx.lineTo(cx + s * 0.35, cy + s * 0.45);
    }
    ctx.stroke();
    ctx.restore();
}

const FEATURES = [['skin', 'Skin Friendly'], ['breath', 'Breathable'], ['elastic', 'Elastic'], ['secure', 'Secure Fit'], ['edges', 'Fast Edges']];

function iconRow(ctx, cx, cy, r, gap, color, labelSize) {
    const x0 = cx - gap * 2;
    FEATURES.forEach(([k, label], i) => {
        const x = x0 + i * gap;
        icon(ctx, k, x, cy, r, color);
        ctx.fillStyle = color;
        font(ctx, 600, labelSize);
        ctx.textAlign = 'center';
        ctx.fillText(label, x, cy + r + labelSize * 1.35);
    });
}

function rollIllustration(ctx, cx, cy, r) {
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.strokeStyle = G; ctx.lineWidth = r * 0.03; ctx.stroke();
    ctx.clip();
    // unrolled tail
    ctx.fillStyle = '#e2a98c';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.1, cy + r * 0.32);
    ctx.lineTo(cx + r * 0.95, cy + r * 0.12);
    ctx.lineTo(cx + r * 0.95, cy + r * 0.42);
    ctx.lineTo(cx - r * 0.1, cy + r * 0.62);
    ctx.fill();
    // body
    const grd = ctx.createLinearGradient(0, cy - r * 0.35, 0, cy + r * 0.62);
    grd.addColorStop(0, '#f1c7b0'); grd.addColorStop(0.5, PEACH); grd.addColorStop(1, '#c98f72');
    ctx.fillStyle = grd;
    ctx.fillRect(cx - r * 0.45, cy - r * 0.3, r * 0.75, r * 0.92);
    ctx.beginPath(); ctx.ellipse(cx + r * 0.3, cy + r * 0.16, r * 0.17, r * 0.46, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d99c80';
    ctx.beginPath(); ctx.ellipse(cx - r * 0.45, cy + r * 0.16, r * 0.17, r * 0.46, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(150,90,60,.45)'; ctx.lineWidth = r * 0.012;
    for (let i = 1; i < 5; i++) {
        ctx.beginPath(); ctx.ellipse(cx - r * 0.45, cy + r * 0.16, r * 0.17 * i / 5, r * 0.46 * i / 5, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
}

/* ───────────── Chase+ Elastic Adhesive tin ───────────── */
export function tinLabel(a) {
    const W = 2048, H = 764;
    const [c, ctx] = canvas(W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#eef2ef');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const cx = W / 2;
    lockup(ctx, a, cx, 34, 112, G);
    chaseMark(ctx, cx, 300, 128, G);
    ctx.fillStyle = G; ctx.textAlign = 'center';
    font(ctx, 700, 50); ctx.fillText('Elastic Adhesive', cx, 410);
    ctx.fillText('Bandage B.P.', cx, 466);
    pill(ctx, 'With Fast Edges', cx, 522, 30, G, '#fff');
    // green base with wave
    ctx.fillStyle = G;
    ctx.beginPath(); ctx.moveTo(0, 590);
    for (let x = 0; x <= W; x += 16) ctx.lineTo(x, 588 + Math.sin(x / W * Math.PI * 6) * 10);
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    iconRow(ctx, cx, 650, 34, 128, '#ffffff', 17);
    // back panel copy
    ctx.fillStyle = G; ctx.textAlign = 'left';
    font(ctx, 800, 30); ctx.fillText('FEATURES', 150, 120);
    font(ctx, 500, 26);
    FEATURES.forEach(([k, l], i) => { icon(ctx, k, 170, 180 + i * 70, 20, G); ctx.fillText(l, 210, 190 + i * 70); });
    font(ctx, 800, 30); ctx.fillText('INDICATIONS', 1480, 120);
    font(ctx, 500, 26);
    ['Sprains', 'Strains', 'Support & Compression'].forEach((t, i) => ctx.fillText('•  ' + t, 1480, 180 + i * 46));
    font(ctx, 500, 20); ctx.fillStyle = '#4b5d55';
    ['Supplied by:', 'Chase Healthcare & Wellness Pvt. Ltd.', 'Made in India · Store in a cool, dry place'].forEach((t, i) => ctx.fillText(t, 1480, 360 + i * 32));
    return c;
}

/* ───────────── Chase+ carton (6 faces) ───────────── */
export function cartonFaces(a) {
    // front
    const [front, f] = canvas(1024, 1592);
    f.fillStyle = '#fff'; f.fillRect(0, 0, 1024, 1592);
    f.fillStyle = G; f.fillRect(0, 0, 1024, 26);
    lockup(f, a, 512, 90, 170, G);
    chaseMark(f, 512, 520, 190, G);
    f.fillStyle = G; f.textAlign = 'center';
    font(f, 700, 70); f.fillText('Elastic Adhesive', 512, 680); f.fillText('Bandage B.P.', 512, 760);
    pill(f, 'With Fast Edges', 512, 845, 44, G, '#fff');
    rollIllustration(f, 512, 1065, 150);
    iconRow(f, 512, 1310, 52, 190, G, 24);
    f.fillStyle = G; font(f, 800, 52); f.textAlign = 'right'; f.fillText('1 Roll', 960, 1530);
    // side
    const [side, s] = canvas(640, 1580);
    s.fillStyle = '#fff'; s.fillRect(0, 0, 640, 1580);
    s.fillStyle = G; s.fillRect(0, 0, 640, 26);
    s.textAlign = 'left'; s.fillStyle = G;
    font(s, 800, 46); s.fillText('FEATURES', 70, 170);
    font(s, 500, 38);
    FEATURES.forEach(([k, l], i) => { icon(s, k, 100, 260 + i * 110, 34, G); s.fillText(l, 160, 274 + i * 110); });
    font(s, 800, 46); s.fillText('INDICATIONS', 70, 900);
    font(s, 500, 36);
    ['Sprains', 'Strains', 'Support & Compression'].forEach((t, i) => s.fillText('•  ' + t, 80, 970 + i * 60));
    s.fillStyle = G; roundRect(s, 70, 1260, 500, 200, 24); s.fill();
    s.fillStyle = '#fff'; s.textAlign = 'center'; font(s, 800, 52); s.fillText('MADE IN', 320, 1345); s.fillText('INDIA', 320, 1410);
    // top
    const [top, t] = canvas(1024, 645);
    const tg = t.createLinearGradient(0, 0, 1024, 645);
    tg.addColorStop(0, '#0d6a47'); tg.addColorStop(1, G_DEEP);
    t.fillStyle = tg; t.fillRect(0, 0, 1024, 645);
    lockup(t, a, 512, 230, 180, '#fffae9', 'center', true);
    // back
    const [back, b] = canvas(1024, 1592);
    b.fillStyle = '#fff'; b.fillRect(0, 0, 1024, 1592);
    b.fillStyle = G; b.fillRect(0, 0, 1024, 26);
    chaseMark(b, 512, 300, 130, G);
    b.fillStyle = '#3d4f47'; b.textAlign = 'left'; font(b, 500, 32);
    ['Directions: Clean and dry the skin. Apply with', 'even tension, overlapping each turn by half.', '', 'Store below 30°C in a dry place.', '', 'Supplied by:', 'Chase Healthcare & Wellness Pvt. Ltd., India'].forEach((l, i) => b.fillText(l, 110, 520 + i * 54));
    barcode(b, 110, 1250, 420, 170);
    return { front, side, top, back };
}

function barcode(ctx, x, y, w, h, seed = 7) {
    ctx.fillStyle = '#fff'; ctx.fillRect(x - 12, y - 12, w + 24, h + 50);
    ctx.fillStyle = '#111';
    let px = x, r = seed;
    while (px < x + w) {
        r = (r * 9301 + 49297) % 233280;
        const bw = 2 + (r % 4) * 1.6;
        if ((r >> 3) % 3) ctx.fillRect(px, y, bw, h);
        px += bw + 2;
    }
    font(ctx, 500, h * 0.16); ctx.textAlign = 'center';
    ctx.fillText('8 904321 ' + String(seed * 13579).slice(0, 6), x + w / 2, y + h + h * 0.2);
}

/* ───────────── IV Cannula Fixator box ───────────── */
export function fixatorFaces(a) {
    const W = 2048, H = 717;
    const [front, f] = canvas(W, H);
    f.fillStyle = '#fff'; f.fillRect(0, 0, W, H);
    // green wave
    const wg = f.createLinearGradient(900, 0, W, 300);
    wg.addColorStop(0, '#0e7a50'); wg.addColorStop(1, G_DEEP);
    f.fillStyle = wg;
    f.beginPath(); f.moveTo(760, 0); f.bezierCurveTo(1150, 40, 1350, 330, W, 230); f.lineTo(W, 0); f.fill();
    f.strokeStyle = 'rgba(126,196,150,.75)'; f.lineWidth = 34;
    f.beginPath(); f.moveTo(820, 30); f.bezierCurveTo(1200, 90, 1380, 380, W, 280); f.stroke();
    leaf(f, 1690, 220, 120, -0.55, '#3faa5f'); leaf(f, 1720, 220, 150, 0.35, '#5cbf6e');
    lockup(f, a, 110, 50, 120, G, 'left');
    chaseMark(f, 110, 330, 130, G, 'left');
    f.fillStyle = G; f.textAlign = 'left';
    font(f, 700, 40); f.fillText('ELASTIC ADHESIVE BANDAGE B.P.', 110, 420);
    f.fillStyle = '#9ac4ae'; f.fillRect(110, 444, 600, 3);
    f.fillStyle = G; font(f, 500, 40); f.fillText('i.v. Cannula Fixator', 110, 500);
    f.fillStyle = G; roundRect(f, 110, 540, 560, 120, 40); f.fill();
    f.fillStyle = '#fff'; font(f, 700, 34); f.fillText('ADDITIONAL STRIP FOR', 150, 592); f.fillText('EXTRA ADHESION', 150, 634);
    ['MADE IN INDIA', 'GMP', 'ISO'].forEach((t, i) => {
        const x = 800 + i * 150, y = 600;
        f.strokeStyle = G; f.lineWidth = 5; f.beginPath(); f.arc(x, y, 55, 0, Math.PI * 2); f.stroke();
        f.fillStyle = G; f.textAlign = 'center'; font(f, 800, t.length > 4 ? 16 : 28); f.fillText(t, x, y + (t.length > 4 ? 6 : 10));
    });
    // fixator pad (U shape)
    f.save(); f.translate(1560, 420);
    f.fillStyle = PEACH;
    f.beginPath(); roundRect(f, -150, -40, 300, 230, 70); f.fill();
    f.fillStyle = '#fff'; f.beginPath(); roundRect(f, -30, 110, 60, 90, 28); f.fill();
    f.fillStyle = '#f0c6b0'; roundRect(f, -200, -75, 400, 80, 16); f.fill();
    f.fillStyle = '#6b4a3a'; font(f, 700, 24); f.textAlign = 'center';
    f.fillText('EXTRA STRIP FOR', 0, -40); f.fillText('ADDITIONAL ADHESION', 0, -12);
    f.restore();
    f.fillStyle = G; font(f, 800, 56); f.textAlign = 'right'; f.fillText('100P', 1960, 660);

    const [top, t] = canvas(W, 750);
    const tg = t.createLinearGradient(0, 0, W, 750);
    tg.addColorStop(0, '#0f7a50'); tg.addColorStop(1, G_DEEP);
    t.fillStyle = tg; t.fillRect(0, 0, W, 750);
    t.fillStyle = 'rgba(255,255,255,.08)';
    t.beginPath(); t.ellipse(1500, 900, 1100, 600, 0, 0, Math.PI * 2); t.fill();
    chaseMark(t, 600, 430, 190, '#ffffff');
    leaf(t, 1600, 520, 160, -0.5, '#4cb768'); leaf(t, 1640, 520, 200, 0.35, '#6fcf7d');

    const [side, s] = canvas(512, 489);
    s.fillStyle = G; s.fillRect(0, 0, 512, 489);
    s.drawImage(a.markCream, 156, 90, 200, 167);
    s.fillStyle = '#fffae9'; font(s, 800, 70); s.textAlign = 'center'; s.fillText('CHW', 256, 360);

    const [back, b] = canvas(W, H);
    b.fillStyle = '#fff'; b.fillRect(0, 0, W, H);
    b.fillStyle = G; b.fillRect(0, H - 120, W, 120);
    b.fillStyle = '#3d4f47'; b.textAlign = 'left'; font(b, 500, 34);
    ['Elastic Adhesive Bandage B.P. / i.v. Cannula Fixator', 'Contents: 100 individually sealed fixators', 'Supplied by Chase Healthcare & Wellness Pvt. Ltd., India'].forEach((l, i) => b.fillText(l, 110, 160 + i * 64));
    barcode(b, 1500, 160, 380, 170, 11);
    return { front, top, side, back };
}

/* ───────────── Photo-faced packs (sachet / syringe pouch) ───────────── */
export function photoFace(img) {
    const [c, ctx] = canvas(img.width, img.height);
    ctx.drawImage(img, 0, 0);
    return c;
}

export function plainFace(w, h, color = '#f6f7f5', band = G) {
    const [c, ctx] = canvas(w, h);
    ctx.fillStyle = color; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = band; ctx.fillRect(0, 0, w, h * 0.04); ctx.fillRect(0, h * 0.96, w, h * 0.04);
    ctx.fillStyle = 'rgba(11,95,63,.5)'; font(ctx, 600, w * 0.06); ctx.textAlign = 'center';
    ctx.fillText('Chase Healthcare & Wellness', w / 2, h * 0.5);
    return c;
}

/* ───────────── Elastic bandage knit + roll end ───────────── */
export function knitTexture() {
    // vertical knit ribs with chevron stitches, like a real elastic bandage
    const [c, ctx] = canvas(512, 512);
    ctx.fillStyle = '#e3ab8f'; ctx.fillRect(0, 0, 512, 512);
    for (let x = 0; x < 512; x += 16) {
        const g = ctx.createLinearGradient(x, 0, x + 16, 0);
        g.addColorStop(0, 'rgba(140,80,52,.35)');
        g.addColorStop(0.35, 'rgba(255,226,206,.35)');
        g.addColorStop(0.65, 'rgba(255,226,206,.18)');
        g.addColorStop(1, 'rgba(140,80,52,.4)');
        ctx.fillStyle = g; ctx.fillRect(x, 0, 16, 512);
        for (let y = 0; y < 512; y += 8) {
            ctx.strokeStyle = 'rgba(120,66,42,.22)'; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(x + 2, y); ctx.lineTo(x + 8, y + 5); ctx.lineTo(x + 14, y); ctx.stroke();
        }
    }
    return c;
}

export function rollEndTexture() {
    const [c, ctx] = canvas(512, 512);
    ctx.fillStyle = '#e2ab90'; ctx.fillRect(0, 0, 512, 512);
    for (let r = 60; r < 256; r += 3.2) {
        ctx.strokeStyle = `rgba(${150 + (r % 7) * 6},${85 + (r % 5) * 5},60,.5)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(256, 256, r, 0, Math.PI * 2); ctx.stroke();
    }
    return c;
}

export function shadowTexture() {
    const [c, ctx] = canvas(256, 256);
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(0,0,0,.55)');
    g.addColorStop(0.45, 'rgba(0,0,0,.22)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
    return c;
}

/* ───────────── Private-label supplement bottle ───────────── */
export const LABEL_STYLES = {
    classic: { name: 'Classic Gold', bg: ['#fcf3da', '#f5e3b6'], accent: ['#cfa255', '#a87a33'], ink: '#141414', band: ['#c99a4b', '#a77a32'], bandInk: '#ffffff', dot: 'rgba(184,138,62,' },
    emerald: { name: 'Emerald', bg: ['#125a40', '#0a3a29'], accent: ['#e2c27b', '#c19a4f'], ink: '#f6edd3', band: ['#e2c27b', '#bf984d'], bandInk: '#0a3a29', dot: 'rgba(226,194,123,' },
    ivory: { name: 'Ivory Sage', bg: ['#fbfaf5', '#eef0e8'], accent: ['#78a185', '#557a62'], ink: '#1f2a24', band: ['#6f9a7c', '#4f745b'], bandInk: '#ffffff', dot: 'rgba(95,138,110,' },
    midnight: { name: 'Midnight Copper', bg: ['#22252d', '#15171c'], accent: ['#dc9a68', '#b06f42'], ink: '#f3e8da', band: ['#d49061', '#a9673b'], bandInk: '#15171c', dot: 'rgba(220,154,104,' }
};

function wrapLines(ctx, text, maxW) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = '';
    for (const w of words) {
        const test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
    return lines;
}

export function bottleLabel({ brand = 'Your Brand', product = 'Biotin', format = 'Capsules', count = 60, style = 'classic', ingredients = [], benefits = [] } = {}) {
    const W = 2048, H = 490;
    const st = LABEL_STYLES[style] || LABEL_STYLES.classic;
    const [c, ctx] = canvas(W, H);
    const cx = W / 2;
    const bg = ctx.createRadialGradient(cx, H * 0.4, 40, cx, H * 0.4, 900);
    bg.addColorStop(0, st.bg[0]); bg.addColorStop(1, st.bg[1]);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const acc = ctx.createLinearGradient(0, 0, 0, H);
    acc.addColorStop(0, st.accent[0]); acc.addColorStop(1, st.accent[1]);

    // trims
    ctx.fillStyle = acc; ctx.fillRect(0, 6, W, 4);

    // halftone dots, left of the front panel
    for (let x = 700; x < 880; x += 13) {
        for (let y = 40; y < 380; y += 13) {
            const t = 1 - (x - 700) / 180;
            const r = 3.4 * t * (0.6 + 0.4 * Math.sin(y / 40));
            if (r < 0.4) continue;
            ctx.fillStyle = st.dot + (0.55 * t) + ')';
            ctx.beginPath(); ctx.arc(x + (y % 26 ? 6 : 0), y, r, 0, Math.PI * 2); ctx.fill();
        }
    }
    // bubbles, bottom right of the front panel
    [[1235, 330, 16], [1270, 296, 9], [1205, 360, 7], [1290, 350, 22], [1320, 300, 12], [1262, 375, 11], [1335, 250, 7], [1300, 220, 5]].forEach(([x, y, r]) => {
        ctx.fillStyle = st.dot + '.45)'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    });

    // brand box
    const brandText = (brand || 'Your Brand').trim().slice(0, 28) || 'Your Brand';
    font(ctx, 600, 40);
    let lines = wrapLines(ctx, brandText, 260);
    if (lines.length > 2) lines = [lines[0], lines.slice(1).join(' ')];
    let bs = 40;
    const widest = () => Math.max(...lines.map(l => ctx.measureText(l).width));
    while (widest() > 360 && bs > 22) { bs -= 2; font(ctx, 600, bs); }
    const bw = Math.max(200, widest() + 56), bh = lines.length * bs * 1.12 + 34;
    ctx.fillStyle = acc;
    ctx.fillRect(cx - bw / 2, 30, bw, bh);
    ctx.fillStyle = st.bandInk; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    lines.forEach((l, i) => ctx.fillText(l, cx, 30 + 18 + i * bs * 1.12));
    ctx.textBaseline = 'alphabetic';

    // product name
    const name = product.toUpperCase();
    const nameTop = 30 + bh + 26;
    font(ctx, 700, 74, SERIF);
    let size = fitText(ctx, name, 600, 74, 700, SERIF, 46);
    let nameLines = [name];
    if (ctx.measureText(name).width > 600) {
        font(ctx, 700, 46, SERIF);
        nameLines = wrapLines(ctx, name, 620).slice(0, 2);
        size = 46;
        nameLines = nameLines.map(l => l);
        size = Math.min(...nameLines.map(l => fitText(ctx, l, 640, 46, 700, SERIF, 30)));
    }
    font(ctx, 700, size, SERIF);
    ctx.fillStyle = st.ink;
    let y = nameTop + size * 0.82;
    nameLines.forEach((l, i) => ctx.fillText(l, cx, y + i * size * 0.98));
    y += (nameLines.length - 1) * size * 0.98 + 22;
    ctx.fillStyle = acc; ctx.fillRect(cx - 190, y, 380, 3);
    font(ctx, 600, 40, SERIF); ctx.fillStyle = st.ink;
    ctx.fillText(format, cx, Math.min(y + 50, 380));

    // bottom band
    const band = ctx.createLinearGradient(0, 392, 0, H);
    band.addColorStop(0, st.band[0]); band.addColorStop(1, st.band[1]);
    ctx.fillStyle = band; ctx.fillRect(0, 398, W, H - 398);
    ctx.fillStyle = st.bandInk; ctx.textAlign = 'left';
    font(ctx, 600, 26); ctx.fillText(String(count), 760, 432); ctx.fillText(format, 760, 466);
    ctx.fillRect(950, 414, 2, 60);
    font(ctx, 700, 24); ctx.fillText('NUTRACEUTICAL', 985, 452);
    ctx.fillStyle = '#fff'; ctx.fillRect(1236, 418, 44, 44);
    ctx.strokeStyle = '#1d8a3a'; ctx.lineWidth = 3; ctx.strokeRect(1240, 422, 36, 36);
    ctx.fillStyle = '#1d8a3a'; ctx.beginPath(); ctx.arc(1258, 440, 9, 0, Math.PI * 2); ctx.fill();

    // back left: supplement facts
    ctx.fillStyle = st.ink; ctx.textAlign = 'left';
    font(ctx, 800, 26); ctx.fillText('SUPPLEMENT FACTS', 110, 70);
    ctx.fillStyle = acc; ctx.fillRect(110, 84, 470, 3);
    ctx.fillStyle = st.ink; font(ctx, 500, 19);
    ctx.fillText('Serving size: 1 ' + format.replace(/s$/, '').toLowerCase(), 110, 112);
    const rows = ingredients.slice(0, 9);
    rows.forEach(([n, q], i) => {
        const yy = 146 + i * 26;
        font(ctx, 500, 18);
        let label = n; while (ctx.measureText(label).width > 360 && label.length > 4) label = label.slice(0, -2);
        if (label !== n) label += '…';
        ctx.fillText(label, 110, yy);
        ctx.textAlign = 'right'; font(ctx, 700, 18); ctx.fillText(q || '', 580, yy); ctx.textAlign = 'left';
    });
    if (ingredients.length > rows.length) { font(ctx, 500, 16); ctx.fillText('+ ' + (ingredients.length - rows.length) + ' more', 110, 146 + rows.length * 26); }

    // back right: benefits + maker
    font(ctx, 800, 26); ctx.fillText('KEY BENEFITS', 1470, 70);
    ctx.fillStyle = acc; ctx.fillRect(1470, 84, 460, 3);
    ctx.fillStyle = st.ink; font(ctx, 500, 19);
    benefits.slice(0, 5).forEach((b, i) => {
        let t = b; while (ctx.measureText('•  ' + t).width > 470 && t.length > 4) t = t.slice(0, -2);
        ctx.fillText('•  ' + (t === b ? b : t + '…'), 1470, 120 + i * 30);
    });
    font(ctx, 500, 15);
    ctx.fillText('Marketed by ' + brandText + '.', 1470, 290);
    ctx.fillText('Supplied by Chase Healthcare & Wellness Pvt. Ltd., India', 1470, 312);
    barcode(ctx, 1700, 330, 160, 30, 23);
    return c;
}

export function capsuleColors() {
    return { gold: '#d9a441', cream: '#f4ead3' };
}

/* ───────────── Spreadsheet download cards ───────────── */
export function sheetCard({ title, subtitle, cols = [], rows = [], widths, accent = 'green', meta = '', stat = '', statLabel = '' }) {
    const W = 1024, H = 1339, P = 56;
    const [c, ctx] = canvas(W, H);
    const gold = accent === 'gold';
    const ink = '#13261e', muted = '#7b877f', line = '#e7e2d6';
    const tone = gold ? '#9a7432' : '#0d6b46';

    // warm paper
    const paper = ctx.createLinearGradient(0, 0, 0, H);
    paper.addColorStop(0, '#fdfbf6'); paper.addColorStop(1, '#f5f0e5');
    ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H);

    // header panel
    const hx = 36, hy = 36, hw = W - 72, hh = 400;
    const head = ctx.createLinearGradient(hx, hy, hx + hw, hy + hh);
    if (gold) { head.addColorStop(0, '#d8b46e'); head.addColorStop(1, '#8a6528'); }
    else { head.addColorStop(0, '#12845a'); head.addColorStop(1, '#06392a'); }
    ctx.save(); roundRect(ctx, hx, hy, hw, hh, 34); ctx.clip();
    ctx.fillStyle = head; ctx.fillRect(hx, hy, hw, hh);
    // soft light + fine grid lines for depth
    const glow = ctx.createRadialGradient(hx + hw * 0.85, hy + 40, 10, hx + hw * 0.85, hy + 40, 420);
    glow.addColorStop(0, 'rgba(255,255,255,.28)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow; ctx.fillRect(hx, hy, hw, hh);
    ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = 2;
    for (let x = hx + 60; x < hx + hw; x += 60) { ctx.beginPath(); ctx.moveTo(x, hy); ctx.lineTo(x, hy + hh); ctx.stroke(); }
    for (let y = hy + 60; y < hy + hh; y += 60) { ctx.beginPath(); ctx.moveTo(hx, y); ctx.lineTo(hx + hw, y); ctx.stroke(); }
    ctx.restore();

    // XLSX pill + kicker
    ctx.fillStyle = 'rgba(255,255,255,.95)'; roundRect(ctx, hx + 40, hy + 40, 118, 46, 23); ctx.fill();
    ctx.fillStyle = tone; font(ctx, 800, 22); ctx.textAlign = 'center'; ctx.fillText('XLSX', hx + 99, hy + 71);
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,.78)'; font(ctx, 600, 21);
    ctx.fillText('CHW  ·  EXPORT PRODUCT SHEET', hx + 182, hy + 71);

    // title (serif, wraps to two lines) + subtitle
    ctx.fillStyle = '#ffffff'; font(ctx, 600, 78, SERIF);
    const words = title.split(' '), lines = [''];
    words.forEach(w => {
        const t = lines[lines.length - 1] ? lines[lines.length - 1] + ' ' + w : w;
        if (ctx.measureText(t).width > hw - 330 && lines[lines.length - 1]) lines.push(w); else lines[lines.length - 1] = t;
    });
    lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, hx + 40, hy + 190 + i * 78));
    ctx.fillStyle = 'rgba(255,255,255,.8)'; font(ctx, 500, 26);
    ctx.fillText(subtitle, hx + 42, hy + hh - 44);

    // big count, top-right
    if (stat) {
        ctx.textAlign = 'right'; ctx.fillStyle = '#ffffff'; font(ctx, 600, 132, SERIF);
        ctx.fillText(stat, hx + hw - 40, hy + 210);
        ctx.fillStyle = 'rgba(255,255,255,.75)'; font(ctx, 700, 20);
        ctx.fillText(statLabel.toUpperCase(), hx + hw - 44, hy + 248);
        ctx.textAlign = 'left';
    }

    // table preview
    const tx = P, ty = hy + hh + 44, tw = W - P * 2, rowH = 62;
    const ws = widths || cols.map(() => 1 / cols.length);
    const xs = [tx];
    ws.forEach(w => xs.push(xs[xs.length - 1] + w * tw));
    ctx.fillStyle = muted; font(ctx, 700, 18);
    cols.forEach((h, i) => ctx.fillText(h.toUpperCase(), xs[i] + (i ? 18 : 30), ty + 26));
    ctx.fillStyle = tone; ctx.fillRect(tx, ty + 44, tw, 3);
    const n = Math.min(rows.length, 10);
    for (let r = 0; r < n; r++) {
        const y = ty + 47 + rowH * r;
        ctx.fillStyle = tone; ctx.globalAlpha = 0.55;
        ctx.beginPath(); ctx.arc(tx + 9, y + rowH / 2, 5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        rows[r].forEach((v, i) => {
            ctx.fillStyle = i === 0 ? ink : '#55635c';
            font(ctx, i === 0 ? 600 : 500, 23);
            let t = String(v);
            const max = xs[i + 1] - xs[i] - (i ? 30 : 42);
            while (ctx.measureText(t).width > max && t.length > 3) t = t.slice(0, -2);
            if (t !== String(v)) t = t.replace(/\s*$/, '') + '…';
            ctx.fillText(t, xs[i] + (i ? 18 : 30), y + rowH / 2 + 8);
        });
        ctx.fillStyle = line; ctx.fillRect(tx, y + rowH - 1, tw, 2);
    }
    // fade rows out above the footer
    const fy = H - 330;
    const fade = ctx.createLinearGradient(0, fy, 0, fy + 170);
    fade.addColorStop(0, 'rgba(247,243,234,0)'); fade.addColorStop(1, 'rgba(247,243,234,1)');
    ctx.fillStyle = fade; ctx.fillRect(0, fy, W, 170);
    ctx.fillStyle = '#f6f2e8'; ctx.fillRect(0, fy + 170, W, H - fy - 170);

    // footer: filename + download pill
    ctx.fillStyle = line; ctx.fillRect(P, H - 150, W - P * 2, 2);
    ctx.fillStyle = muted; font(ctx, 500, 22); ctx.textAlign = 'left';
    let m = meta; while (ctx.measureText(m).width > W - P * 2 - 330 && m.length > 6) m = m.slice(0, -2);
    if (m !== meta) m += '…';
    ctx.fillText(m, P, H - 70);
    ctx.fillStyle = gold ? '#8a6528' : '#0a5a3b';
    roundRect(ctx, W - P - 290, H - 112, 290, 70, 35); ctx.fill();
    ctx.fillStyle = '#ffffff'; font(ctx, 700, 25); ctx.textAlign = 'center';
    ctx.fillText('Download  \u2193', W - P - 145, H - 68);
    ctx.textAlign = 'left';
    return c;
}

export function cardBack() {
    const [c, ctx] = canvas(512, 670);
    const g = ctx.createLinearGradient(0, 0, 512, 670);
    g.addColorStop(0, '#0f6b47'); g.addColorStop(1, '#052a1c');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 670);
    ctx.strokeStyle = 'rgba(232,201,142,.5)'; ctx.lineWidth = 2;
    roundRect(ctx, 28, 28, 456, 614, 22); ctx.stroke();
    ctx.strokeStyle = 'rgba(232,201,142,.2)';
    roundRect(ctx, 40, 40, 432, 590, 16); ctx.stroke();
    ctx.fillStyle = '#e8c98e'; font(ctx, 600, 84, SERIF); ctx.textAlign = 'center'; ctx.fillText('CHW', 256, 352);
    ctx.fillStyle = 'rgba(255,250,233,.7)'; font(ctx, 500, 20); ctx.fillText('CARE BEYOND CURE', 256, 394);
    return c;
}

/* ───────────── Vitantra herbal jar (kraft label, gold rules, seal) ───────────── */
const KRAFT = ['#e8d9bc', '#d9c6a2'];
const BROWN = '#5a3420';
const GOLDLINE = '#c9a24e';

function arcText(ctx, text, cx, cy, r, centerAngle, size, color, inward = false) {
    font(ctx, 700, size);
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const chars = [...text];
    const widths = chars.map(ch => ctx.measureText(ch).width + size * 0.12);
    const total = widths.reduce((a, b) => a + b, 0);
    let a = centerAngle + (inward ? 1 : -1) * (total / r) / 2;
    chars.forEach((ch, i) => {
        const step = widths[i] / r;
        a += (inward ? -1 : 1) * step / 2;
        ctx.save();
        ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.rotate(a + (inward ? -Math.PI / 2 : Math.PI / 2));
        ctx.fillText(ch, 0, 0);
        ctx.restore();
        a += (inward ? -1 : 1) * step / 2;
    });
    ctx.textBaseline = 'alphabetic';
}

// Round black seal with a gold three-leaf sprig: the Vitantra mark
export function vitantraSeal(ctx, cx, cy, r) {
    ctx.save();
    const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
    g.addColorStop(0, '#2a2622'); g.addColorStop(1, '#0d0c0b');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = GOLDLINE; ctx.lineWidth = r * 0.04;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.93, 0, Math.PI * 2); ctx.stroke();
    const gold = ctx.createLinearGradient(cx, cy - r * 0.5, cx, cy + r * 0.4);
    gold.addColorStop(0, '#f2d58f'); gold.addColorStop(1, '#b8873a');
    const lf = (x, y, s, rot) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.bezierCurveTo(s * 0.55, -s * 0.35, s * 0.5, -s * 0.95, 0, -s * 1.25);
        ctx.bezierCurveTo(-s * 0.5, -s * 0.95, -s * 0.55, -s * 0.35, 0, 0);
        ctx.fillStyle = gold; ctx.fill();
        ctx.strokeStyle = '#0d0c0b'; ctx.lineWidth = s * 0.06;
        ctx.beginPath(); ctx.moveTo(0, -s * 0.08); ctx.lineTo(0, -s * 1.05); ctx.stroke();
        ctx.restore();
    };
    const s = r * 0.32;
    lf(cx, cy + r * 0.12, s * 1.05, 0);
    lf(cx, cy + r * 0.16, s * 0.85, -0.95);
    lf(cx, cy + r * 0.16, s * 0.85, 0.95);
    ctx.strokeStyle = gold; ctx.lineWidth = r * 0.05; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, cy + r * 0.12); ctx.quadraticCurveTo(cx - r * 0.06, cy + r * 0.38, cx - r * 0.2, cy + r * 0.48); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy + r * 0.12); ctx.quadraticCurveTo(cx + r * 0.06, cy + r * 0.38, cx + r * 0.2, cy + r * 0.48); ctx.stroke();
    arcText(ctx, 'VITANTRA', cx, cy, r * 0.74, -Math.PI / 2, r * 0.2, '#f2d58f');
    arcText(ctx, 'HEALING FROM NATURE', cx, cy, r * 0.76, Math.PI / 2, r * 0.12, '#e8c98e', true);
    ctx.restore();
}

function sprig(ctx, x, y, s, flip, color) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(flip ? -1 : 1, 1);
    ctx.strokeStyle = color; ctx.lineWidth = s * 0.035; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, s); ctx.quadraticCurveTo(s * 0.12, s * 0.4, 0, -s * 0.2); ctx.stroke();
    [[0.7, -0.7], [0.45, 0.75], [0.2, -0.65], [-0.05, 0.6]].forEach(([t, rot]) => {
        ctx.save();
        ctx.translate(s * 0.05, s * t); ctx.rotate(rot);
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.bezierCurveTo(s * 0.16, -s * 0.08, s * 0.16, -s * 0.3, 0, -s * 0.38);
        ctx.bezierCurveTo(-s * 0.16, -s * 0.3, -s * 0.16, -s * 0.08, 0, 0);
        ctx.stroke();
        ctx.restore();
    });
    ctx.restore();
}

export function vitantraLabel({ name = 'Ashwagandha', tagline = '', botanical = '', points = [] } = {}) {
    const W = 2048, H = 560;
    const [c, ctx] = canvas(W, H);
    const cx = W / 2;
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, KRAFT[0]); bg.addColorStop(1, KRAFT[1]);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // paper fibre
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 2600; i++) {
        ctx.fillStyle = `rgba(${rnd() > 0.5 ? '120,86,48' : '255,248,232'},${0.05 + rnd() * 0.08})`;
        ctx.fillRect(rnd() * W, rnd() * H, 1 + rnd() * 3, 1);
    }
    // gold rules top and bottom
    ctx.fillStyle = GOLDLINE;
    ctx.fillRect(0, 26, W, 4); ctx.fillRect(0, H - 30, W, 4);

    vitantraSeal(ctx, cx, 112, 68);

    // product name
    ctx.fillStyle = BROWN; ctx.textAlign = 'center';
    const nm = name;
    let size = fitText(ctx, nm, 470, 84, 800, SANS, 44);
    font(ctx, 800, size);
    ctx.fillText(nm, cx, 252);
    font(ctx, 800, 70);
    ctx.fillText('Capsules', cx, 330);
    if (tagline) {
        const t = tagline.replace(/\s*&\s*/g, ' & ');
        fitText(ctx, t, 440, 28, 500, SANS, 18);
        ctx.fillText(t, cx, 378);
    }
    // flourish
    ctx.strokeStyle = 'rgba(90,52,32,.55)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 170, 408); ctx.lineTo(cx - 30, 408); ctx.moveTo(cx + 30, 408); ctx.lineTo(cx + 170, 408); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, 408, 22, 9, 0, 0, Math.PI * 2); ctx.stroke();
    font(ctx, 500, 30, SERIF);
    ctx.fillStyle = BROWN;
    ctx.fillText('Ayurvedic Herbal Supplement', cx, 462);
    ctx.fillText('Pure  ·  Natural  ·  Vegan', cx, 500);
    sprig(ctx, cx - 300, 300, 110, false, 'rgba(201,162,78,.7)');
    sprig(ctx, cx + 300, 300, 110, true, 'rgba(201,162,78,.7)');

    // back: botanical, key points, maker
    ctx.textAlign = 'left'; ctx.fillStyle = BROWN;
    font(ctx, 800, 26); ctx.fillText('TRADITIONAL AYURVEDIC USE', 110, 92);
    ctx.fillStyle = GOLDLINE; ctx.fillRect(110, 106, 470, 3);
    ctx.fillStyle = BROWN; font(ctx, 500, 21);
    points.slice(0, 3).forEach((p, i) => {
        const lines = wrapLines(ctx, p, 460).slice(0, 2);
        lines.forEach((l, j) => ctx.fillText((j ? '    ' : '•  ') + l, 110, 150 + i * 66 + j * 26));
    });
    if (botanical) { font(ctx, 500, 20, SERIF); ctx.fillText(botanical, 110, 370); }
    font(ctx, 700, 22); ctx.fillText('VEGETARIAN CAPSULES', 1470, 92);
    ctx.fillStyle = GOLDLINE; ctx.fillRect(1470, 106, 460, 3);
    ctx.fillStyle = BROWN; font(ctx, 500, 18);
    ['Store in a cool, dry place.', 'Keep out of reach of children.', 'Not a substitute for a varied diet.'].forEach((t, i) => ctx.fillText(t, 1470, 146 + i * 28));
    font(ctx, 500, 16);
    ctx.fillText('Supplied by Chase Healthcare & Wellness', 1470, 300);
    ctx.fillText('Pvt. Ltd., Greater Noida, India', 1470, 322);
    barcode(ctx, 1700, 360, 160, 34, 41);
    return c;
}
