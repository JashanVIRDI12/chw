import {
    Group, Mesh, LatheGeometry, CylinderGeometry, RingGeometry, TorusGeometry, CapsuleGeometry,
    MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, Vector2, Color, BackSide, DoubleSide,
    InstancedMesh, Object3D, BufferAttribute, RepeatWrapping, Shape, ShapeGeometry
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import * as P from './textures.js';

// `T(canvas)` turns a canvas into a configured texture for the current renderer.

function meta(group, id, { anchorY, footprint, radius }) {
    group.userData.pickId = id;
    group.userData.anchorY = anchorY;
    group.userData.footprint = footprint;
    group.userData.radius = radius;
    return group;
}

/* ── Supplement bottle (private label) ── */
export const BOTTLE_FINISH = {
    black: { body: '#0c0c0d', cap: '#0b0b0b', rough: 0.24 },
    white: { body: '#f1f1ee', cap: '#f4f4f2', rough: 0.32 },
    amber: { body: '#5b2b0b', cap: '#111111', rough: 0.12 }
};

export function bottle(T, opts = {}) {
    const g = new Group();
    const pts = [
        [0, 0], [0.62, 0], [0.71, 0.02], [0.75, 0.07], [0.765, 0.16], [0.765, 1.56],
        [0.755, 1.64], [0.72, 1.72], [0.64, 1.8], [0.54, 1.85], [0.47, 1.87], [0.46, 1.9], [0.46, 1.96]
    ].map(([x, y]) => new Vector2(x, y));
    const finish = BOTTLE_FINISH[opts.finish || 'black'];
    const bodyMat = new MeshPhysicalMaterial({ color: finish.body, roughness: finish.rough, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.18 });
    const body = new Mesh(new LatheGeometry(pts, 96), bodyMat);
    g.add(body);

    // cap with knurled ridges
    const capGeo = new CylinderGeometry(0.56, 0.56, 0.44, 240, 1, false);
    const pos = capGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), z = pos.getZ(i);
        const r = Math.hypot(x, z);
        if (r > 0.5) {
            const a = Math.atan2(z, x);
            const k = 1 + 0.012 * Math.cos(a * 80);
            pos.setX(i, x * k); pos.setZ(i, z * k);
        }
    }
    capGeo.computeVertexNormals();
    const capMat = new MeshPhysicalMaterial({ color: finish.cap, roughness: 0.42, clearcoat: 0.35 });
    const cap = new Mesh(capGeo, capMat);
    cap.position.y = 2.12;
    const capTop = new Mesh(new TorusGeometry(0.54, 0.025, 12, 96), capMat);
    capTop.rotation.x = Math.PI / 2; capTop.position.y = 2.335;
    const capDisc = new Mesh(new CylinderGeometry(0.545, 0.545, 0.01, 96), capMat);
    capDisc.position.y = 2.34;
    g.add(cap, capTop, capDisc);

    // wrap-around label
    const labelMat = new MeshPhysicalMaterial({ roughness: 0.52, clearcoat: 0.25, clearcoatRoughness: 0.35 });
    const label = new Mesh(new CylinderGeometry(0.772, 0.772, 1.15, 160, 1, true, Math.PI, Math.PI * 2), labelMat);
    label.position.y = 0.9;
    g.add(label);

    g.userData.setLabel = (canvas) => {
        if (labelMat.map) labelMat.map.dispose();
        labelMat.map = T(canvas);
        labelMat.needsUpdate = true;
    };
    g.userData.setFinish = (key) => {
        const f = BOTTLE_FINISH[key] || BOTTLE_FINISH.black;
        bodyMat.color.set(f.body); bodyMat.roughness = f.rough;
        capMat.color.set(f.cap);
    };
    g.userData.setLabel(P.bottleLabel(opts.label || {}));
    return meta(g, opts.id || 'bottle', { anchorY: 2.5, footprint: 1.9, radius: 1.25 });
}

/* ── Chase+ elastic adhesive tin ── */
export function tin(T, a, opts = {}) {
    const g = new Group();
    const metalWhite = new MeshStandardMaterial({ color: '#e9ece9', metalness: 0.35, roughness: 0.32 });
    const green = new MeshPhysicalMaterial({ color: '#0b5f3f', metalness: 0.45, roughness: 0.26, clearcoat: 0.7, clearcoatRoughness: 0.15 });
    const body = new Mesh(new CylinderGeometry(0.62, 0.62, 1.62, 96, 1, true), metalWhite);
    body.position.y = 0.85;
    const base = new Mesh(new LatheGeometry([[0, 0], [0.6, 0], [0.632, 0.02], [0.632, 0.1], [0.62, 0.12]].map(([x, y]) => new Vector2(x, y)), 96), green);
    const label = new Mesh(new CylinderGeometry(0.624, 0.624, 1.53, 128, 1, true, Math.PI, Math.PI * 2),
        new MeshPhysicalMaterial({ map: T(P.tinLabel(a)), roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.25 }));
    label.position.y = 0.875; // runs from the base rim (0.11) up under the lid (1.64)
    const lidPts = [[0.64, 0], [0.652, 0.03], [0.652, 0.22], [0.645, 0.265], [0.625, 0.29], [0.59, 0.3], [0, 0.3]].map(([x, y]) => new Vector2(x, y));
    const lid = new Mesh(new LatheGeometry(lidPts, 128), green);
    lid.position.y = 1.62;
    const lidRing = new Mesh(new TorusGeometry(0.6, 0.012, 8, 96), green);
    lidRing.rotation.x = Math.PI / 2; lidRing.position.y = 1.905;
    g.add(body, base, label, lid, lidRing);
    return meta(g, opts.id || 'eab', { anchorY: 2.2, footprint: 1.6, radius: 1.05 });
}

/* ── Rounded carton with six painted faces ── */
function carton(T, w, h, d, faces, radius = 0.025) {
    const geo = new RoundedBoxGeometry(w, h, d, 3, radius);
    const mk = (c, rough = 0.62) => new MeshPhysicalMaterial({ map: c ? T(c) : null, color: c ? '#ffffff' : '#f4f5f3', roughness: rough, clearcoat: 0.08, clearcoatRoughness: 0.5 });
    // order: +x, -x, +y, -y, +z, -z
    const mats = [mk(faces.right), mk(faces.left), mk(faces.top), mk(null), mk(faces.front), mk(faces.back)];
    const m = new Mesh(geo, mats);
    m.position.y = h / 2;
    return m;
}

export function cartonBox(T, a, opts = {}) {
    const g = new Group();
    const f = P.cartonFaces(a);
    g.add(carton(T, 1.36, 2.12, 0.86, { front: f.front, back: f.back, right: f.side, left: f.side, top: f.top }));
    return meta(g, opts.id || 'eab', { anchorY: 2.4, footprint: 1.9, radius: 1.3 });
}

/* ── IV cannula fixator box + photo sachet ── */
export function fixatorBox(T, a, opts = {}) {
    const g = new Group();
    const f = P.fixatorFaces(a);
    g.add(carton(T, 3.0, 1.05, 1.12, { front: f.front, back: f.back, right: f.side, left: f.side, top: f.top }, 0.02));
    return meta(g, opts.id || 'fixator', { anchorY: 1.4, footprint: 3.4, radius: 1.7 });
}

export function sachet(T, a, opts = {}) {
    const g = new Group();
    const front = P.photoFace(a.sachet);
    const back = P.plainFace(352, 512);
    const geo = new RoundedBoxGeometry(1.02, 1.48, 0.035, 2, 0.012);
    const paper = (c) => new MeshPhysicalMaterial({ map: c ? T(c) : null, color: '#ffffff', roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.12 });
    const edge = new MeshStandardMaterial({ color: '#f2f3f1', roughness: 0.4 });
    const m = new Mesh(geo, [edge, edge, edge, edge, paper(front), paper(back)]);
    m.position.y = 0.74;
    g.add(m);
    return meta(g, opts.id || 'fixator', { anchorY: 1.7, footprint: 1.1, radius: 0.9 });
}

export function syringePouch(T, a, opts = {}) {
    const g = new Group();
    const front = P.photoFace(a.pouch);
    const back = P.plainFace(256, 1024);
    const geo = new RoundedBoxGeometry(0.64, 2.56, 0.03, 2, 0.01);
    const film = (c) => new MeshPhysicalMaterial({ map: c ? T(c) : null, color: '#ffffff', roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.12 });
    const edge = new MeshStandardMaterial({ color: '#f5f6f4', roughness: 0.35 });
    const m = new Mesh(geo, [edge, edge, edge, edge, film(front), film(back)]);
    m.position.y = 1.28;
    g.add(m);
    return meta(g, opts.id || 'syringe', { anchorY: 2.85, footprint: 0.9, radius: 1.35 });
}

/* ── Elastic bandage roll ── */
export function bandageRoll(T, opts = {}) {
    const g = new Group();
    const knit = T(P.knitTexture());
    knit.wrapS = knit.wrapT = RepeatWrapping;
    knit.repeat.set(3, 1.5);
    const side = new Mesh(new CylinderGeometry(0.48, 0.48, 1.7, 96, 1, true),
        new MeshStandardMaterial({ map: knit, bumpMap: knit, bumpScale: 2.2, roughness: 1 }));
    side.position.y = 0.85;
    const endMat = new MeshStandardMaterial({ map: T(P.rollEndTexture()), roughness: 0.95 });
    const top = new Mesh(new RingGeometry(0.11, 0.48, 96, 1), endMat);
    top.rotation.x = -Math.PI / 2; top.position.y = 1.7;
    const hole = new Mesh(new CylinderGeometry(0.11, 0.11, 1.69, 32, 1, true), new MeshStandardMaterial({ color: '#8d5a42', roughness: 1, side: BackSide }));
    hole.position.y = 0.85;
    // red guide thread like the real roll
    const thread = new Mesh(new TorusGeometry(0.482, 0.004, 6, 96), new MeshBasicMaterial({ color: '#c0392b' }));
    thread.rotation.x = Math.PI / 2; thread.position.y = 0.95;
    g.add(side, top, hole, thread);
    return meta(g, opts.id || 'eab', { anchorY: 2.0, footprint: 1.25, radius: 0.95 });
}

/* ── Floating capsules (instanced, two-tone) ── */
export function capsules(count = 36) {
    const geo = new CapsuleGeometry(0.085, 0.2, 8, 20);
    const colors = new Float32Array(geo.attributes.position.count * 3);
    const gold = new Color('#d6a241'), cream = new Color('#f5ecd6');
    for (let i = 0; i < geo.attributes.position.count; i++) {
        const c = geo.attributes.position.getY(i) > 0 ? gold : cream;
        colors.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('color', new BufferAttribute(colors, 3));
    const mat = new MeshPhysicalMaterial({ vertexColors: true, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06 });
    const mesh = new InstancedMesh(geo, mat, count);
    const seeds = [];
    for (let i = 0; i < count; i++) {
        seeds.push({
            a: Math.random() * Math.PI * 2,
            r: 1.6 + Math.random() * 1.6,
            y: 2.2 + Math.random() * 1.8,
            s: 0.6 + Math.random() * 0.45,
            sp: 0.05 + Math.random() * 0.12,
            rx: Math.random() * Math.PI, rz: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 1.2
        });
    }
    const d = new Object3D();
    mesh.userData.update = (t, spread = 1) => {
        for (let i = 0; i < count; i++) {
            const s = seeds[i];
            const a = s.a + t * s.sp;
            d.position.set(Math.cos(a) * s.r * spread, s.y + Math.sin(t * 0.8 + i) * 0.12, Math.sin(a) * s.r * spread * 0.35);
            d.rotation.set(s.rx + t * s.spin, a, s.rz + t * s.spin * 0.6);
            d.scale.setScalar(s.s);
            d.updateMatrix();
            mesh.setMatrixAt(i, d.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
    };
    mesh.frustumCulled = false;
    return mesh;
}

// Loose capsules resting on the table (studio dressing)
export function restingCapsules(spots) {
    const g = new Group();
    const geo = new CapsuleGeometry(0.085, 0.2, 8, 20);
    const gold = new MeshPhysicalMaterial({ color: '#d6a241', roughness: 0.16, clearcoat: 1 });
    const cream = new MeshPhysicalMaterial({ color: '#f5ecd6', roughness: 0.2, clearcoat: 1 });
    spots.forEach(([x, z, r], i) => {
        const m = new Mesh(geo, i % 2 ? gold : cream);
        m.rotation.set(0, r, Math.PI / 2);
        m.position.set(x, 0.085, z);
        g.add(m);
    });
    return g;
}

export { DoubleSide };

/* ── Chase silicone tape: magenta spool, blue silicone tape, clear case ── */
function spool() {
    const g = new Group();
    const v = (pts) => pts.map(([x, y]) => new Vector2(x, y));
    const magenta = new MeshPhysicalMaterial({ color: '#d0158e', roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.15, side: DoubleSide });
    const tape = new MeshPhysicalMaterial({ color: '#4f9fe6', roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, side: DoubleSide });
    const tapeEdge = new MeshPhysicalMaterial({ color: '#8fd2b8', roughness: 0.3, clearcoat: 0.6, side: DoubleSide });
    const flange = (y) => new Mesh(new LatheGeometry(v([[0.2, y + 0.035], [0.2, y], [0.56, y], [0.565, y + 0.0175], [0.56, y + 0.035], [0.2, y + 0.035]]), 96), magenta);
    g.add(flange(0), flange(0.335));
    // tape wound on the core, with a mint band like the real roll
    g.add(new Mesh(new LatheGeometry(v([[0.5, 0.035], [0.5, 0.335]]), 96), tape));
    const band = new Mesh(new CylinderGeometry(0.503, 0.503, 0.07, 96, 1, true), tapeEdge);
    band.position.y = 0.185;
    g.add(band);
    g.add(new Mesh(new LatheGeometry(v([[0.22, 0.035], [0.5, 0.035]]), 96), tape));
    g.add(new Mesh(new LatheGeometry(v([[0.5, 0.335], [0.22, 0.335]]), 96), tape));
    const core = new Mesh(new CylinderGeometry(0.2, 0.2, 0.37, 64, 1, true), magenta);
    core.position.y = 0.185;
    g.add(core);
    // clear protective case
    const caseMat = new MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.04, metalness: 0, clearcoat: 1, transparent: true, opacity: 0.16, depthWrite: false, side: DoubleSide });
    const shell = new Mesh(new CylinderGeometry(0.6, 0.6, 0.42, 96, 1, true), caseMat);
    shell.position.y = 0.2;
    g.add(shell);
    return g;
}

export function siliconeTape(T, opts = {}) {
    const g = new Group();
    g.add(spool());
    if (opts.single) return meta(g, opts.id || 'silicone', { anchorY: 0.95, footprint: 1.4, radius: 0.8 });
    const up = spool();             // second spool standing on its edge, like the product photo
    up.rotation.x = Math.PI / 2;
    up.position.set(0.98, 0.6, -0.32);   // stands beside the flat spool
    up.rotation.z = -0.5;
    g.add(up);
    return meta(g, opts.id || 'silicone', { anchorY: 1.45, footprint: 1.9, radius: 1.0 });
}

/* ── Vitantra herbal jar: amber glass, bronze cap, kraft wrap label ── */
export function vitantraJar(T, opts = {}) {
    const g = new Group();
    const v = (pts) => pts.map(([x, y]) => new Vector2(x, y));
    const glass = new MeshPhysicalMaterial({
        color: '#4a1d05', roughness: 0.07, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03,
        sheen: 1, sheenRoughness: 0.32, sheenColor: new Color('#ff8a3d'),
        emissive: new Color('#3a1300'), emissiveIntensity: 0.55,
        specularIntensity: 1, ior: 1.5, envMapIntensity: 1.6
    });
    // wide body → rounded shoulder → short neck with two thread rings
    const body = new Mesh(new LatheGeometry(v([
        [0, 0], [0.66, 0], [0.75, 0.025], [0.79, 0.09], [0.8, 0.2], [0.8, 1.58], [0.79, 1.68],
        [0.75, 1.78], [0.68, 1.86], [0.6, 1.91], [0.56, 1.93], [0.555, 1.98], [0.555, 2.1]
    ]), 128), glass);
    g.add(body);
    [2.0, 2.07].forEach(y => {
        const t = new Mesh(new TorusGeometry(0.562, 0.018, 10, 96), glass);
        t.rotation.x = Math.PI / 2; t.position.y = y;
        g.add(t);
    });
    // capsules glimpsed through the bottom of the jar
    const capsMat = new MeshPhysicalMaterial({ color: '#7a4a24', roughness: 0.4, clearcoat: 0.6 });
    const capGeo = new CapsuleGeometry(0.075, 0.18, 6, 12);
    for (let i = 0; i < 9; i++) {
        const m = new Mesh(capGeo, capsMat);
        const a = (i / 9) * Math.PI * 2;
        m.position.set(Math.cos(a) * 0.62, 0.14 + (i % 2) * 0.06, Math.sin(a) * 0.62);
        m.rotation.set(Math.PI / 2, a, 0.3);
        g.add(m);
    }
    // brushed bronze cap with a softly rounded top edge
    const bronze = new MeshPhysicalMaterial({ color: '#a77a4d', metalness: 0.9, roughness: 0.3, clearcoat: 0.4, clearcoatRoughness: 0.25 });
    const cap = new Mesh(new LatheGeometry(v([
        [0.6, 0], [0.625, 0.01], [0.635, 0.05], [0.635, 0.5], [0.625, 0.56], [0.6, 0.585], [0.56, 0.595], [0, 0.6]
    ]), 128), bronze);
    cap.position.y = 1.97;
    g.add(cap);
    // kraft label
    const labelMat = new MeshPhysicalMaterial({ roughness: 0.78, clearcoat: 0.08 });
    const label = new Mesh(new CylinderGeometry(0.806, 0.806, 1.3, 160, 1, true, Math.PI, Math.PI * 2), labelMat);
    label.position.y = 0.92;
    g.add(label);
    g.userData.setLabel = (canvas) => {
        if (labelMat.map) labelMat.map.dispose();
        labelMat.map = T(canvas);
        labelMat.needsUpdate = true;
    };
    g.userData.setLabel(P.vitantraLabel(opts.label || {}));
    return meta(g, opts.id || 'herbal', { anchorY: 2.85, footprint: 2.0, radius: 1.3 });
}

// A loose herb leaf for set dressing (flattened, slightly curled)
export function herbLeaf(color = '#4f7a3a', len = 0.62) {
    const w = len * 0.42;
    const sh = new Shape();
    sh.moveTo(0, 0);
    sh.bezierCurveTo(w * 0.9, len * 0.18, w * 0.75, len * 0.72, 0, len);
    sh.bezierCurveTo(-w * 0.75, len * 0.72, -w * 0.9, len * 0.18, 0, 0);
    const geo = new ShapeGeometry(sh, 24);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i) / len;
        // cup across the blade, curl along it, tiny fold at the midrib
        pos.setZ(i, (x * x) * 1.6 + y * y * 0.12 - Math.abs(x) * 0.06);
    }
    geo.computeVertexNormals();
    const leaf = new Mesh(geo, new MeshPhysicalMaterial({ color, roughness: 0.45, clearcoat: 0.35, clearcoatRoughness: 0.4, sheen: 0.6, sheenColor: new Color('#b7e39a'), side: DoubleSide }));
    const rib = new Mesh(new CylinderGeometry(0.006, 0.01, len * 0.9, 6), new MeshStandardMaterial({ color: '#a9c98a', roughness: 0.6 }));
    rib.position.set(0, len * 0.45, 0.004);
    const g = new Group();
    g.add(leaf, rib);
    return g;
}

/* ── Display podium: cream travertine drum with a brushed-gold top trim ── */
const STONE = new MeshPhysicalMaterial({ color: '#e7ddca', roughness: 0.52, clearcoat: 0.22, clearcoatRoughness: 0.45, sheen: 0.3, sheenColor: new Color('#fff4dc') });
const TRIM = new MeshPhysicalMaterial({ color: '#c9a35e', metalness: 0.95, roughness: 0.28 });
export function podium(r, h) {
    const v = (pts) => pts.map(([x, y]) => new Vector2(x, y));
    const g = new Group();
    g.add(new Mesh(new LatheGeometry(v([[0, 0], [r, 0], [r, h - 0.05], [r - 0.012, h - 0.018], [r - 0.045, h], [0, h]]), 96), STONE));
    const ring = new Mesh(new TorusGeometry(r - 0.045, 0.012, 8, 96), TRIM);
    ring.rotation.x = Math.PI / 2; ring.position.y = h + 0.002;
    g.add(ring);
    return g;
}

// Stand a product on its own podium; the pair behaves as one stage item
export function onPodium(product, { r, h }) {
    const g = new Group();
    g.add(podium(r, h));
    product.position.y = h;
    g.add(product);
    const u = product.userData;
    Object.assign(g.userData, u, {
        pickId: u.pickId, anchorY: (u.anchorY || 2) + h,
        footprint: Math.max(u.footprint || 1.5, r * 2.3), radius: Math.max(u.radius || 1, r)
    });
    return g;
}
