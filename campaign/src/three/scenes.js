import { MathUtils, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Stage, webglAvailable } from './stage.js';
import * as M from './models.js';
import { loadPackAssets, bottleLabel, sheetCard, cardBack } from './textures.js';
import { gsap } from 'gsap';
import { loadSyringe } from './syringe.js';

export { webglAvailable };

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const WRAP = 1240, GUT = 40;

function camFit(stage, base, minAspect) {
    // Pull the camera back on narrow/portrait viewports so products stay in frame.
    const a = stage.w / stage.h;
    return base * Math.min(2.4, Math.max(1, minAspect / a));
}

/* ───────────── HERO ───────────── */
// Product-shot composition: every pack stands on its own travertine podium.
// Centre bottle low and forward, the inner pair raised behind it, the outer pair
// low and forward again: a V of heights and depths. Each product owns its own
// horizontal slot, so no pack can ever hide another, from any camera height.
export async function heroScene(host, { labelOpts }) {
    const a = await loadPackAssets();
    const stage = new Stage(host, { bg: '#0b2e22', fov: 28, camPos: [0, 3.4, 20], look: [0, 1.7, 0], exposure: 1.02, envIntensity: 0.6 });
    const T = c => stage.tex(c);

    const pouch = M.syringePouch(T, a, { id: 'syringe' });
    pouch.children[0].rotation.x = -0.05;

    // podium sizes are in each product's own units (the pair is scaled together)
    const items = {
        carton: stage.add(M.onPodium(M.cartonBox(T, a, { id: 'eab' }), { r: 1.0, h: 0.32 }), { scale: 0.92 }),
        tin: stage.add(M.onPodium(M.tin(T, a, { id: 'eab' }), { r: 0.92, h: 1.0 }), { scale: 0.96 }),
        bottle: stage.add(M.onPodium(M.bottle(T, { id: 'bottle', label: labelOpts }), { r: 1.12, h: 0.46 }), { scale: 1.06 }),
        pouch: stage.add(M.onPodium(pouch, { r: 0.66, h: 0.86 }), { scale: 1 }),
        spool: stage.add(M.onPodium(M.siliconeTape(T, { id: 'silicone', single: true }), { r: 0.78, h: 0.2 }), { scale: 0.72 })
    };
    const { carton, tin, bottle, pouch: pouchItem, spool } = items;
    [tin, bottle, pouchItem, spool].forEach(i => { i.primary = true; });

    // [x, z, rotY]; narrow screens drop the duplicate EAB carton and tighten the V
    const LAYOUT = {
        wide: {
            carton: [-3.8, 1.0, 0.42], tin: [-1.95, -0.45, 0.22], bottle: [0, 0.95, -0.08],
            pouch: [1.95, -0.45, -0.24], spool: [3.65, 1.0, -0.3]
        },
        narrow: {
            spool: [-3.3, 0.85, 0.3], tin: [-1.85, -0.45, 0.24], bottle: [0, 0.95, -0.08],
            pouch: [1.85, -0.45, -0.24], carton: [3.3, 0.85, -0.42]
        }
    };
    const CX = 0;
    let half = 4.6;
    const layout = (narrow) => {
        const L = narrow ? LAYOUT.narrow : LAYOUT.wide;
        let min = Infinity, max = -Infinity;
        Object.entries(items).forEach(([k, it]) => {
            const p = L[k];
            it.off = p ? 0 : 1;
            if (!p) return;
            it.base.pos.set(p[0], 0, p[1]);
            it.base.rotY = p[2];
            const r = (it.root.userData.radius || 1) * it.base.scale;
            min = Math.min(min, p[0] - r); max = Math.max(max, p[0] + r);
        });
        half = Math.max(CX - min, max - CX);
        return half * 2;
    };

    const caps = M.capsules(innerWidth < 700 ? 8 : 14);
    caps.position.set(0, 0.6, -2.4); // float behind the set, never over the labels
    caps.castShadow = false;
    caps.userData.update(0);
    stage.scene.add(caps);

    // Real syringes fly nose-first through the capsule swarm: a wide ellipse behind and above the set
    // (never across the labels), bobbing, pitching with the bob and rolling slowly about the barrel.
    const flyers = [];
    const FLIGHTS = [
        { a: 0.4, y: 3.55, rx: 4.3, rz: 1.25, sp: 0.15, roll: 0.55, bob: 0.2 },
        { a: 0.4 + Math.PI, y: 4.15, rx: 3.6, rz: 1.0, sp: 0.12, roll: -0.42, bob: 0.16 }
    ];
    loadSyringe(2.1).then(proto => {
        FLIGHTS.slice(0, innerWidth < 700 ? 1 : 2).forEach(f => {
            const s = proto.clone(true);
            s.userData.f = f;
            s.scale.setScalar(0.001);
            stage.scene.add(s);
            flyers.push(s);
        });
    }).catch(() => { /* decorative: the hero works without it */ });
    // keep every syringe fully inside the canvas: its top may not rise above 82% of the stage height
    // (on phones the stage starts right under the headline, so a loop near the top would be sliced off)
    const CEIL = 0.64, tip = new Vector3(), rel = new Vector3(), dir = new Vector3();
    const fly = (t, k) => flyers.forEach((s, i) => {
        const f = s.userData.f, a = f.a + t * f.sp;
        const ph = t * 0.9 + i * 2.1;
        const x = Math.cos(a) * f.rx, z = -2.4 + Math.sin(a) * f.rz;
        let y = f.y + Math.sin(ph) * f.bob;
        const cam = stage.camera;
        tip.set(x, y + 0.35, z).project(cam); // 0.35 ≈ half the barrel's height with its pitch
        if (tip.y > CEIL) {
            // NDC overshoot -> world units at this depth (view height there is 2·depth·tan(fov/2))
            const depth = rel.set(x, y, z).sub(cam.position).dot(cam.getWorldDirection(dir));
            y -= (tip.y - CEIL) * depth * Math.tan(MathUtils.degToRad(cam.fov / 2));
        }
        s.position.set(x, y, z);
        // heading = direction of travel (d/da of the ellipse); +X on the model is the needle
        s.rotation.set(t * f.roll, Math.atan2(-Math.cos(a) * f.rz, -Math.sin(a) * f.rx), Math.cos(ph) * 0.22);
        s.scale.setScalar(Math.max(0.001, s.userData.baseScale * k));
        s.visible = k > 0.01;
    });

    stage.offset = { y: 0 };
    const capState = { s: reduced ? 1 : 0 };
    stage.idle = (t) => {
        caps.userData.update(t, 1 + (1 - capState.s) * 2.5);
        caps.scale.setScalar(Math.max(0.001, capState.s));
        caps.visible = capState.s > 0.01;
        fly(t, capState.s);
        // the hero bottle turns slowly on its podium so the label reads, then the back
        if (!stage.focused) bottle.idleSway = Math.sin(t * 0.42) * 0.5;
        // a gentle breathing float on the raised pair keeps the set alive
        if (!stage.focused) { tin.idleSway = Math.sin(t * 0.35 + 1) * 0.12; pouchItem.idleSway = Math.sin(t * 0.35 + 2.4) * 0.12; }
    };
    stage.on('focus', () => { gsap.to(capState, { s: 0, duration: 1.1, ease: 'expo.inOut' }); gsap.to([bottle, tin, pouchItem], { idleSway: 0, duration: 1 }); });
    stage.on('unfocus', () => { gsap.to(capState, { s: 1, duration: 1.4, ease: 'expo.inOut', delay: 0.3 }); });

    const place = () => {
        const W = stage.w, narrow = W < 860;
        const width = layout(narrow) + 0.3;
        const tanV = Math.tan(MathUtils.degToRad(14));
        const tanH = tanV * (W / stage.h);
        if (narrow) {
            stage.cam.pos.set(CX, 3.6, Math.max(width / (2 * tanH), 2.2 / tanV) + 2);
            stage.cam.look.set(CX, 1.25, 0);
            stage.view.sx = 0;
            stage.view.sy = 0.08; // phones: lift the set toward the headline above the stage
        } else {
            stage.view.sy = 0;
            // centre the set in the right column of the page grid, sized to that column
            const wrapW = Math.min(W, WRAP) - GUT * 2;
            const right = (W + wrapW) / 2;
            const colW = wrapW * 0.56;
            const colCenter = right - colW / 2 + 30;
            stage.view.sx = -(colCenter - W / 2) / W;
            stage.cam.pos.set(CX, 3.5, MathUtils.clamp(width * (W / colW) / (2 * tanH) + 2, 13, 32));
            stage.cam.look.set(CX, 1.65, 0);
        }
        stage.applyView();
    };
    stage.on('resize', () => { if (!stage.focused && !stage.saved) place(); });
    place();

    // Entrance: podiums rise out of the glass, centre first,
    // while the camera settles from slightly above.
    if (!reduced) {
        const order = Object.values(items).filter(it => !it.off).sort((p, q) => Math.abs(p.base.pos.x - CX) - Math.abs(q.base.pos.x - CX));
        order.forEach(it => { it.iso = 1; });
        capState.s = 0;
        const z = stage.cam.pos.z, y = stage.cam.pos.y;
        stage.cam.pos.z = z - 3; stage.cam.pos.y = y + 1.2;
        {
            gsap.to(stage.cam.pos, { z, y, duration: 2.6, ease: 'power3.out' });
            order.forEach((it, i) => {
                it.lift = 0.9;
                gsap.to(it, { iso: 0, lift: 0, duration: 1.4, ease: 'expo.out', delay: 0.1 + i * 0.11 });
            });
            gsap.to(capState, { s: 1, duration: 1.8, ease: 'power3.out', delay: 0.4 + order.length * 0.11 });
        }
    }
    stage.loop();
    return stage;
}

/* ───────────── PRIVATE-LABEL STUDIO ───────────── */
export async function studioScene(host, { labelOpts }) {
    await loadPackAssets();
    const stage = new Stage(host, { bg: '#efe6d3', fov: 26, camPos: [0, 2.2, 10], look: [0, 1.15, 0], floorOpacity: 0.86, exposure: 1.0, envIntensity: 0.55, shadowOpacity: 0.3, capture: true });
    const T = c => stage.tex(c);

    const main = M.bottle(T, { id: 'studio', label: labelOpts });
    const it = stage.add(main, { x: 0, z: 0.4, rotY: 0, scale: 1.22 });
    it.primary = true;
    stage.dragItem = it;

    const sideA = M.bottle(T, { id: 'studio-a', finish: 'amber', label: { brand: 'Your Brand', product: 'Multivitamin', format: 'Capsules', style: 'emerald' } });
    const sideB = M.bottle(T, { id: 'studio-b', finish: 'white', label: { brand: 'Your Brand', product: 'Collagen', format: 'Tablets', style: 'ivory' } });
    stage.add(sideA, { x: -2.15, z: -1.4, rotY: 0.5, scale: 0.92, pick: false });
    stage.add(sideB, { x: 2.2, z: -1.5, rotY: -0.5, scale: 0.92, pick: false });
    const loose = M.restingCapsules([[1.25, 1.25, 0.4], [1.48, 1.12, 1.6], [1.33, 1.5, 2.3], [-1.3, 1.35, 0.9], [-1.1, 1.6, 2.6], [-1.55, 1.2, 0.2], [0.95, 1.85, 1.1]]);
    loose.traverse(o => { o.castShadow = true; });
    stage.scene.add(loose);

    const place = () => {
        const narrow = stage.w < 860;
        stage.cam.pos.z = camFit(stage, 10, 1.15);
        stage.cam.pos.y = narrow ? 2.5 : 2.2;
    };
    stage.on('resize', () => { if (!stage.focused && !stage.saved) place(); });
    place();

    stage.setLabel = (opts) => main.userData.setLabel(bottleLabel(opts));
    stage.setFinish = (k) => main.userData.setFinish(k);
    stage.spinTo = () => gsap.fromTo(it, { spin: -0.9 }, { spin: 0, duration: 1.2, ease: 'expo.out' });
    stage.snapshot = () => { stage.render(); return stage.canvas.toDataURL('image/png'); };
    stage.idle = (t) => { if (!stage.focused && !stage.dragging) it.idleSway = Math.sin(t * 0.5) * 0.35; };
    stage.loop();
    return stage;
}

/* ───────────── DOWNLOADS: floating spreadsheet cards ───────────── */
export async function cardsScene(host, { cards }) {
    await loadPackAssets();
    const stage = new Stage(host, { bg: '#0b2e22', fov: 30, camPos: [0, 2.1, 11], look: [0, 1.95, 0], floor: false, exposure: 0.88, envIntensity: 0.45 });
    stage.key.position.set(-7, 7, 5);
    const T = c => stage.tex(c);
    const geo = new RoundedBoxGeometry(2.6, 3.4, 0.07, 5, 0.14);
    const edge = new MeshStandardMaterial({ color: '#d9b878', roughness: 0.32, metalness: 0.75 });
    const back = new MeshPhysicalMaterial({ map: T(cardBack()), roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.3 });

    // stack → fan layout: two cards open like a book, three fan left / centre / right
    const two = cards.length === 2;
    const FAN = two ? [
        { x: -1.45, y: 1.95, z: 0, ry: 0.22, rz: 0.05 },
        { x: 1.45, y: 1.95, z: 0, ry: -0.22, rz: -0.05 }
    ] : [
        { x: -2.35, y: 1.85, z: -0.55, ry: 0.36, rz: 0.07 },
        { x: 0, y: 2.0, z: 0.4, ry: 0, rz: 0 },
        { x: 2.35, y: 1.85, z: -0.55, ry: -0.36, rz: -0.07 }
    ];
    const STACK = two ? [
        { x: -0.1, y: 1.95, z: -0.1, ry: 0.05, rz: 0.05 },
        { x: 0.1, y: 2.0, z: 0.05, ry: -0.04, rz: -0.04 }
    ] : [
        { x: -0.12, y: 1.95, z: -0.2, ry: 0.06, rz: 0.05 },
        { x: 0, y: 2.0, z: 0.05, ry: 0, rz: 0 },
        { x: 0.12, y: 1.95, z: -0.1, ry: -0.06, rz: -0.05 }
    ];
    const items = cards.map((c, i) => {
        const g = new Group();
        const front = new MeshPhysicalMaterial({ map: T(sheetCard(c)), roughness: 0.62, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.5, sheen: 0.3, sheenColor: '#fff6e0' });
        const mesh = new Mesh(geo, [edge, edge, edge, edge, front, back]);
        g.add(mesh);
        g.userData.pickId = c.id;
        g.userData.anchorY = 2;
        const item = stage.add(g, { x: STACK[i].x, z: STACK[i].z, rotY: STACK[i].ry });
        item.mesh = mesh;
        item.k = i;
        return item;
    });

    stage.fan = (p) => {
        const e = gsap.parseEase('power3.inOut')(MathUtils.clamp(p, 0, 1));
        items.forEach((it, i) => {
            const a = STACK[i], b = FAN[i];
            it.base.pos.x = a.x + (b.x - a.x) * e;
            it.y0 = a.y + (b.y - a.y) * e;
            it.base.pos.z = a.z + (b.z - a.z) * e;
            it.base.rotY = a.ry + (b.ry - a.ry) * e;
            it.rz = a.rz + (b.rz - a.rz) * e;
        });
        stage.fanned = e;
    };
    stage.fan(reduced ? 1 : 0);

    stage.idle = (t) => {
        items.forEach((it, i) => {
            it.base.pos.y = it.y0 + Math.sin(t * 0.9 + i * 1.7) * 0.06 * (stage.fanned || 0) + it.hover * 0.28;
            it.mesh.rotation.x = -0.06 + Math.sin(t * 0.7 + i) * 0.025 - it.hover * 0.12;
            it.mesh.rotation.z = it.rz * (1 - it.hover);
        });
    };
    const place = () => {
        // fit the fanned set in the stage (two cards are narrower, so they can sit larger)
        const tanH = Math.tan(MathUtils.degToRad(15)) * (stage.w / stage.h);
        const tanV = Math.tan(MathUtils.degToRad(15));
        stage.cam.pos.z = Math.max((two ? 6.0 : 7.1) / (2 * tanH), 3.9 / (2 * tanV)) + 0.2;
    };
    stage.on('resize', place);
    place();
    stage.loop();
    return stage;
}

/* ───────────── EXPORT REACH: dotted globe with trade arcs ───────────── */
export async function reachScene(host) {
    const { buildGlobe } = await import('./globe.js');
    const stage = new Stage(host, { bg: '#061c15', fov: 30, camPos: [0, 0, 40], look: [0, 0, 0], floor: false, exposure: 1, envIntensity: 0.2 });
    const globe = await buildGlobe({ radius: 10, count: innerWidth < 860 ? 16000 : 26000, bg: '#061c15', face: [0, 0.3, 1], upright: true, dotSize: 0.24 });
    stage.scene.add(globe);
    const place = () => {
        const tanV = Math.tan(MathUtils.degToRad(15)), tanH = tanV * (stage.w / stage.h);
        stage.cam.pos.set(0, 0, Math.max(12.2 / tanV, 12.2 / tanH) * 1.02);
    };
    stage.on('resize', place);
    place();
    const st = { f: reduced ? 1 : 0 };
    if (!reduced) gsap.to(st, { f: 1, duration: 2.2, ease: 'power2.out' });
    stage.idle = (t) => { globe.userData.setFade(st.f); globe.userData.update(t); globe.rotation.x = -0.12; };
    stage.loop();
    return stage;
}
