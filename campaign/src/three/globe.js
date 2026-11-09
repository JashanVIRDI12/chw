// "Planet-rise" export globe: gold dots on the land masses, a soft atmosphere,
// and animated trade arcs from India to export markets.
import {
    Group, Points, BufferGeometry, Float32BufferAttribute, PointsMaterial, CanvasTexture, Mesh, SphereGeometry,
    MeshBasicMaterial, ShaderMaterial, AdditiveBlending, BackSide, Vector3, QuadraticBezierCurve3, Line,
    LineBasicMaterial, Quaternion, Color, SRGBColorSpace, Sprite, SpriteMaterial
} from 'three';
import { loadImage } from './textures.js';

const D = Math.PI / 180;
const INDIA = [28.5, 77.4];
// One arc per export region listed on chw.co.in/global-business (Middle East, Africa,
// Europe, Asia active; South-East Asia and CIS as new partner markets).
export const REGIONS = [
    { name: 'Middle East', at: [24.5, 50.5] },
    { name: 'Africa', at: [3, 25] },
    { name: 'Europe', at: [49, 10] },
    { name: 'South Asia', at: [25.5, 88] },
    { name: 'South-East Asia', at: [13, 106], target: true },
    { name: 'CIS & Central Asia', at: [47, 68], target: true }
];
const MARKETS = REGIONS.map(r => r.at);

export function ll2v(lat, lon, r) {
    const phi = (90 - lat) * D, th = (lon + 180) * D;
    return new Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

function dotSprite() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.45, 'rgba(255,255,255,.9)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
}

async function landSampler() {
    const img = await loadImage('earth-mask.png');
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    return (lat, lon) => {
        const u = Math.floor(((lon + 180) / 360) * c.width) % c.width;
        const v = Math.min(c.height - 1, Math.floor(((90 - lat) / 180) * c.height));
        return d[(v * c.width + u) * 4] > 128;
    };
}

export async function buildGlobe({ radius = 12, count = 30000, bg = '#0b2e22', face = [0.12, 0.9, 0.42], upright = false, dotSize = 0.16 } = {}) {
    const isLand = await landSampler();
    const root = new Group();      // positioned by the scene
    const spin = new Group();      // slow drift
    const earth = new Group();     // oriented so India faces the viewer
    root.add(spin); spin.add(earth);

    // land dots (fibonacci sphere sampled against the mask)
    const pos = [], col = [];
    const gold = new Color('#e8c98e'), mint = new Color('#7fd8a8');
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const rr = Math.sqrt(1 - y * y);
        const th = ga * i;
        const v = new Vector3(Math.cos(th) * rr, y, Math.sin(th) * rr);
        const lat = Math.asin(v.y) / D;
        const lon = Math.atan2(v.z, -v.x) / D - 180;
        const L = ((lon + 540) % 360) - 180;
        if (lat < -60 || !isLand(lat, L)) continue;
        const p = ll2v(lat, L, radius);
        pos.push(p.x, p.y, p.z);
        const c = Math.random() < 0.16 ? mint : gold;
        const k = 0.6 + Math.random() * 0.4;
        col.push(c.r * k, c.g * k, c.b * k);
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new Float32BufferAttribute(col, 3));
    const dotMat = new PointsMaterial({ size: dotSize, map: dotSprite(), vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, alphaTest: 0.02, toneMapped: false });
    earth.add(new Points(geo, dotMat));

    // occluder so the far side's dots don't show through
    const core = new Mesh(new SphereGeometry(radius * 0.985, 64, 48), new MeshBasicMaterial({ color: new Color(bg).multiplyScalar(1.08), toneMapped: false }));
    earth.add(core);

    // atmosphere rim glow
    const atmo = new Mesh(new SphereGeometry(radius * 1.12, 64, 48), new ShaderMaterial({
        uniforms: { uColor: { value: new Color('#3fbf86') }, uOpacity: { value: 0.55 } },
        vertexShader: `varying vec3 vN; varying vec3 vV;
            void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
        fragmentShader: `uniform vec3 uColor; uniform float uOpacity; varying vec3 vN; varying vec3 vV;
            void main(){ float f = pow(1. - abs(dot(vN, vV)), 2.6); gl_FragColor = vec4(uColor, f * uOpacity); }`,
        side: BackSide, transparent: true, blending: AdditiveBlending, depthWrite: false, toneMapped: false
    }));
    root.add(atmo);

    // trade arcs
    const origin = ll2v(INDIA[0], INDIA[1], radius);
    const arcs = MARKETS.map(([lat, lon], i) => {
        const end = ll2v(lat, lon, radius);
        const dist = origin.distanceTo(end) / radius;
        const mid = origin.clone().add(end).normalize().multiplyScalar(radius * (1 + 0.18 + dist * 0.28));
        const pts = new QuadraticBezierCurve3(origin, mid, end).getPoints(80);
        const g = new BufferGeometry().setFromPoints(pts);
        const m = new LineBasicMaterial({ color: i % 3 === 0 ? '#7fe0ae' : '#f0d39b', transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false, toneMapped: false });
        const line = new Line(g, m);
        earth.add(line);
        const head = new Sprite(new SpriteMaterial({ map: dotMat.map, color: '#ffffff', transparent: true, depthWrite: false, blending: AdditiveBlending, toneMapped: false }));
        head.scale.setScalar(0.36);
        earth.add(head);
        const ping = new Sprite(new SpriteMaterial({ map: dotMat.map, color: '#7fe0ae', transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending, toneMapped: false }));
        ping.position.copy(end);
        earth.add(ping);
        return { line, head, ping, pts, n: pts.length, offset: i * 0.37, speed: 0.16 + (i % 4) * 0.025 };
    });

    // India beacon
    const beacon = new Sprite(new SpriteMaterial({ map: dotMat.map, color: '#5cf0a0', transparent: true, depthWrite: false, blending: AdditiveBlending, toneMapped: false }));
    beacon.position.copy(origin.clone().multiplyScalar(1.004));
    beacon.scale.setScalar(0.9);
    earth.add(beacon);

    // face India toward the viewer, tilted up so it rises above the products
    if (upright) {
        // north stays up: yaw India to the front, then pitch it to the requested elevation
        const o = origin.clone().normalize();
        const yaw = Math.atan2(o.x, o.z);
        const pitch = Math.atan2(o.y, Math.hypot(o.x, o.z));
        earth.rotation.set(pitch - Math.atan2(face[1], face[2]), -yaw, 0);
    } else {
        earth.quaternion.copy(new Quaternion().setFromUnitVectors(origin.clone().normalize(), new Vector3(...face).normalize()));
    }

    let fade = 1;
    root.userData.setFade = (f) => { fade = f; };
    root.userData.update = (t) => {
        spin.rotation.y = Math.sin(t * 0.08) * 0.22;
        dotMat.opacity = 0.85 * fade;
        atmo.material.uniforms.uOpacity.value = 0.55 * fade;
        beacon.material.opacity = (0.65 + Math.sin(t * 3) * 0.35) * fade;
        beacon.scale.setScalar(0.7 + Math.sin(t * 3) * 0.2);
        arcs.forEach(a => {
            // grow, hold, retract — then the destination pings
            const p = ((t * a.speed + a.offset) % 1.6);
            const grow = Math.min(1, p / 0.7);
            const tail = Math.max(0, Math.min(1, (p - 0.95) / 0.6));
            const s = Math.floor(tail * a.n), e = Math.max(s + 1, Math.floor(grow * a.n));
            a.line.geometry.setDrawRange(s, e - s);
            a.line.material.opacity = 0.85 * fade * (1 - tail * 0.6);
            const hi = Math.min(a.n - 1, e - 1);
            a.head.position.copy(a.pts[hi]);
            a.head.material.opacity = (grow < 1 ? 1 : Math.max(0, 1 - (p - 0.7) * 3)) * fade;
            const ping = p > 0.7 && p < 1.3 ? Math.sin(((p - 0.7) / 0.6) * Math.PI) : 0;
            a.ping.material.opacity = ping * fade;
            a.ping.scale.setScalar(0.3 + ping * 0.55);
        });
    };
    return root;
}
