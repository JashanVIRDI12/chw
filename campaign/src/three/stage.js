import {
    WebGLRenderer, Scene, PerspectiveCamera, Color, PMREMGenerator, NeutralToneMapping, SRGBColorSpace, PCFShadowMap, ShadowMaterial,
    CanvasTexture, Mesh, PlaneGeometry, MeshBasicMaterial, DirectionalLight, SpotLight, HemisphereLight,
    Raycaster, Vector2, Vector3, Box3, MathUtils, Group
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { shadowTexture } from './textures.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const noHover = matchMedia('(hover: none)').matches;

export function webglAvailable() {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch { return false; }
}

/**
 * A product stage: glass table with reflections, soft light, clickable products,
 * a cinematic focus zoom, idle drift and mouse parallax. Renders only when visible.
 */
export class Stage {
    constructor(host, opts = {}) {
        this.host = host;
        this.opts = Object.assign({ bg: '#0c2f22', fov: 30, floorOpacity: 0.9, exposure: 1.0, envIntensity: 0.5, floor: true, shadowOpacity: 0.42 }, opts);
        this.items = [];          // { id, root, mirror, base: {pos, rotY}, hover }
        this.pickables = [];
        this.listeners = {};
        this.view = { sx: opts.sx || 0, sy: 0 };
        this.offsetK = 1; // how much of the scroll-linked offset applies (0 while a product is focused)
        this.cam = { pos: new Vector3(...(opts.camPos || [0, 2.6, 11])), look: new Vector3(...(opts.look || [0, 1.1, 0])) };
        this.parallax = new Vector2();
        this.pointer = new Vector2(-9, -9);
        this.focused = null;
        this.visible = false;
        this.clockStart = performance.now();
        this.idle = opts.idle || null;
        this.rotateFocus = 0;

        const canvas = document.createElement('canvas');
        canvas.className = 'stage-canvas';
        host.prepend(canvas);
        this.canvas = canvas;

        const r = this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.capture });
        r.toneMapping = NeutralToneMapping; // true-to-print colours: clean whites, brand greens
        r.toneMappingExposure = this.opts.exposure;
        r.outputColorSpace = SRGBColorSpace;
        r.shadowMap.enabled = true;
        r.shadowMap.type = PCFShadowMap;
        this.maxAniso = r.capabilities.getMaxAnisotropy();
        // supersample on standard displays for crisp, high-definition labels
        const dpr = window.devicePixelRatio || 1;
        this.dprCap = Math.min(2, Math.max(dpr, innerWidth > 860 ? 1.5 : dpr));

        const s = this.scene = new Scene();
        s.background = new Color(this.opts.bg);
        const pmrem = new PMREMGenerator(r);
        s.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        s.environmentIntensity = this.opts.envIntensity;
        pmrem.dispose();

        this.camera = new PerspectiveCamera(this.opts.fov, 1, 0.1, 80);

        // Studio rig: warm soft key with real shadows, cool rim, low fill
        s.add(new HemisphereLight('#fff6e8', '#0e2a20', 0.22));
        const key = new DirectionalLight('#fff1dc', 2.6);
        key.position.set(5, 9, 7);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        key.shadow.radius = 6;
        key.shadow.bias = -0.0004;
        key.shadow.normalBias = 0.02;
        Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
        const rim = new DirectionalLight('#d6efe4', 1.5);
        rim.position.set(-7, 5, -6);
        const fill = new DirectionalLight('#ffe9cc', 0.35);
        fill.position.set(-4, 2, 8);
        s.add(key, rim, fill);
        this.key = key;
        this.spot = new SpotLight('#fff3dc', 0, 18, 0.32, 0.6, 1.2);
        this.spot.position.set(2, 8, 6);
        s.add(this.spot, this.spot.target);

        // glass table: translucent floor over mirrored products + a shadow catcher
        if (this.opts.floor) {
            const floor = new Mesh(new PlaneGeometry(120, 120), new MeshBasicMaterial({ color: this.opts.bg, transparent: true, opacity: this.opts.floorOpacity, depthWrite: false, toneMapped: false, fog: false }));
            floor.rotation.x = -Math.PI / 2;
            floor.renderOrder = 1;
            s.add(floor);
            const catcher = new Mesh(new PlaneGeometry(40, 40), new ShadowMaterial({ opacity: this.opts.shadowOpacity, depthWrite: false }));
            catcher.rotation.x = -Math.PI / 2;
            catcher.position.y = 0.002;
            catcher.receiveShadow = true;
            catcher.renderOrder = 2;
            s.add(catcher);
            this.floor = floor;
        }
        this.shadowMap = this.tex(shadowTexture());

        this.world = new Group();
        this.mirrors = new Group();
        s.add(this.world, this.mirrors);

        this.raycaster = new Raycaster();
        this.bindEvents();
        this.resize();
        new ResizeObserver(() => this.resize()).observe(host);
        new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; if (this.visible) this.loop(); }, { rootMargin: '120px' }).observe(host);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) this.loop(); });
    }

    on(evt, fn) { (this.listeners[evt] ||= []).push(fn); return this; }
    emit(evt, ...a) { (this.listeners[evt] || []).forEach(fn => fn(...a)); }

    tex(canvas) {
        const t = new CanvasTexture(canvas);
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = this.maxAniso;
        return t;
    }

    add(root, { x = 0, z = 0, rotY = 0, scale = 1, pick = true, shadow = this.opts.floor, mirror = this.opts.floor } = {}) {
        root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        root.position.set(x, 0, z);
        root.rotation.y = rotY;
        root.scale.setScalar(scale);
        this.world.add(root);
        const item = { id: root.userData.pickId, root, base: { pos: root.position.clone(), rotY, scale }, lift: 0, spin: 0, hover: 0, iso: 0, gx: 0, gz: 0 };
        if (mirror) {
            item.mirror = root.clone(true);
            item.mirror.traverse(o => { o.castShadow = false; o.receiveShadow = false; });
            this.mirrors.add(item.mirror);
        }
        if (shadow) {
            const fp = (root.userData.footprint || 1.5) * scale;
            const sh = new Mesh(new PlaneGeometry(fp * 0.95, fp * 0.95), new MeshBasicMaterial({ map: this.shadowMap, transparent: true, depthWrite: false, opacity: 0.75 }));
            sh.rotation.x = -Math.PI / 2;
            sh.position.set(x, 0.004, z);
            sh.renderOrder = 2;
            this.scene.add(sh);
            item.shadow = sh;
        }
        this.items.push(item);
        if (pick) this.pickables.push(root);
        return item;
    }

    itemsFor(id) { return this.items.filter(i => i.id === id); }

    bindEvents() {
        const el = this.host;
        let down = null;
        // a touch tap fires no pointermove first, so the pointer is also taken on down/up (else taps miss)
        const aim = (e) => {
            const r = el.getBoundingClientRect();
            this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        };
        el.addEventListener('pointermove', (e) => {
            aim(e);
            this.parallax.set(this.pointer.x, this.pointer.y);
            if (!down) return;
            if (Math.abs(e.clientX - down.sx) > 6) down.moved = true;
            const dx = (e.clientX - down.x) * 0.012;
            down.x = e.clientX;
            if (this.focused) this.rotateFocus += dx;
            else if (this.dragItem && down.moved) { this.dragItem.drag = (this.dragItem.drag || 0) + dx; this.dragging = true; }
        });
        el.addEventListener('pointerleave', () => { this.pointer.set(-9, -9); this.parallax.set(0, 0); this.setHover(null); });
        el.addEventListener('pointerdown', (e) => { if (e.target.closest('button, a, input, select, label')) return; aim(e); down = { x: e.clientX, sx: e.clientX, moved: false }; });
        window.addEventListener('pointerup', () => { this.dragging = false; if (down && down.moved) setTimeout(() => { down = null; }); });
        el.addEventListener('pointerup', (e) => {
            if (!down) return;
            const moved = down.moved; down = null;
            if (moved) return;
            if (e.target.closest('button, a, input, select, label')) return;
            aim(e);
            const hit = this.pick();
            if (hit) this.emit('select', hit.userData.pickId, hit);
            else if (this.focused) this.emit('background');
        });
    }

    pick() {
        if (this.pointer.x < -2) return null;
        const live = this.pickables.filter(r => { const it = this.items.find(i => i.root === r); return !it || !it.off; });
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const hits = this.raycaster.intersectObjects(live, true);
        if (!hits.length) return null;
        let o = hits[0].object;
        while (o && !o.userData.pickId) o = o.parent;
        return o;
    }

    setHover(id) {
        if (this.hoverId === id) return;
        this.hoverId = id;
        this.host.classList.toggle('is-hovering', !!id);
        this.items.forEach(it => gsap.to(it, { hover: it.id === id ? 1 : 0, duration: 0.5, ease: 'power3.out' }));
        this.emit('hover', id);
    }

    resize() {
        const w = this.host.clientWidth, h = this.host.clientHeight;
        if (!w || !h) return;
        this.w = w; this.h = h;
        this.renderer.setPixelRatio(this.dprCap);
        this.renderer.setSize(w, h, false);
        this.camera.aspect = w / h;
        this.applyView();
        this.emit('resize', w, h);
        this.render();
    }

    applyView() {
        const { w, h } = this;
        if (!w) return;
        // sx/sy: negative moves the scene right/down, positive moves it left/up
        this.camera.setViewOffset(w, h, this.view.sx * w, this.view.sy * h, w, h);
        this.camera.updateProjectionMatrix();
    }

    // Fly the camera to a product. `layout` = 'side' (panel on the right) or 'bottom' (sheet).
    primaryOf(id) { return this.items.find(i => i.id === id && i.primary) || this.items.find(i => i.id === id); }

    // `free` (phones): { top, bottom } in viewport px: the band left visible between the nav and the sheet.
    focus(id, layout = 'side', root = null, free = null) {
        const item = (root && this.items.find(i => i.root === root)) || this.primaryOf(id);
        if (!item) return;
        const group = this.items.filter(i => i.id === id && !i.off);
        if (!this.saved) this.saved = { pos: this.cam.pos.clone(), look: this.cam.look.clone(), sx: this.view.sx, sy: this.view.sy, fov: this.camera.fov };
        this.focused = item;
        this.rotateFocus = 0;
        // pull the set together around its centroid for a tighter close-up
        const cx = group.reduce((a, g) => a + g.base.pos.x, 0) / group.length;
        const cz = group.reduce((a, g) => a + g.base.pos.z, 0) / group.length;
        const box = new Box3();
        group.forEach(g => {
            const k = layout === 'bottom' ? 0.35 : 0.22;
            g.tgx = (cx - g.base.pos.x) * k;
            g.tgz = (cz - g.base.pos.z) * k;
            // measure at rest (the set may be shrunk/moved if we arrive via prev/next)
            const r = g.root, ps = r.scale.x, pp = r.position.clone();
            r.scale.setScalar(g.base.scale);
            r.position.copy(g.base.pos);
            r.updateMatrixWorld(true);
            const b = new Box3().setFromObject(r);
            r.scale.setScalar(ps);
            r.position.copy(pp);
            r.updateMatrixWorld(true);
            b.translate(new Vector3(g.tgx, 0, g.tgz));
            box.union(b);
        });
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        center.y = Math.max(center.y, 0.6);
        const fov = this.saved.fov * 0.82;
        const tanV = Math.tan(MathUtils.degToRad(fov / 2));
        const tanH = tanV * this.camera.aspect;
        // fraction of the viewport left free by the panel
        // free space beside the glass panel (desktop) or above the sheet (mobile)
        const host = this.host.getBoundingClientRect();
        const panelW = Math.min(470, innerWidth * 0.42) + 44;
        const overlap = layout === 'side' ? Math.max(0, host.right - (innerWidth - panelW)) : 0;
        const freeW = Math.max(this.w * 0.35, this.w - overlap);
        const sideSx = overlap / 2 / this.w;
        let vf = layout === 'bottom' ? 0.4 : 0.62;
        let sy = layout === 'bottom' ? 0.27 : 0;
        if (layout === 'bottom' && free) {
            // fit the product to ~80% of the visible band and centre it there
            const top = MathUtils.clamp(free.top - host.top, 0, this.h);
            const bot = MathUtils.clamp(free.bottom - host.top, top + 1, this.h);
            vf = (Math.max(bot - top, this.h * 0.3) / this.h) * 0.8;
            sy = (this.h / 2 - (top + bot) / 2) / this.h;
        }
        const hf = (freeW / this.w) * 0.8;
        const halfW = Math.max(size.x, size.z) * 0.5, halfH = size.y * 0.5;
        const dist = Math.max(halfH / (tanV * vf), halfW / (tanH * hf)) + Math.max(size.x, size.z) * 0.5;
        const dir = new Vector3(0.1, 0.22, 1).normalize();
        const to = center.clone().addScaledVector(dir, dist);
        const d = reduced ? 0 : 1.7;
        const tl = gsap.timeline({ defaults: { ease: 'expo.inOut', duration: d } });
        tl.to(this.cam.pos, { x: to.x, y: to.y, z: to.z }, 0)
            .to(this.cam.look, { x: center.x, y: center.y, z: center.z }, 0)
            .to(this.view, { sx: layout === 'side' ? sideSx : 0, sy, onUpdate: () => this.applyView() }, 0)
            .to(this, { offsetK: 0 }, 0)
            .to(this.camera, { fov, onUpdate: () => this.camera.updateProjectionMatrix() }, 0)
            .to(this.spot, { intensity: 60, duration: d * 0.8 }, d * 0.3);
        this.items.forEach(it => {
            const same = it.id === id;
            tl.to(it, { lift: same ? 0.14 : 0, spin: same ? Math.PI * 2 : 0, iso: same ? 0 : 1, gx: same ? it.tgx : 0, gz: same ? it.tgz : 0, duration: same ? d * 1.15 : d * 0.8 }, 0);
        });
        this.emit('focus', id);
        this.spot.target.position.copy(center);
        this.host.classList.add('is-focused');
        this.loop();
    }

    unfocus() {
        if (!this.saved) return;
        const s = this.saved; this.saved = null;
        const d = reduced ? 0 : 1.3;
        const tl = gsap.timeline({ defaults: { ease: 'expo.inOut', duration: d } });
        tl.to(this.cam.pos, { x: s.pos.x, y: s.pos.y, z: s.pos.z }, 0)
            .to(this.cam.look, { x: s.look.x, y: s.look.y, z: s.look.z }, 0)
            .to(this.view, { sx: s.sx, sy: s.sy, onUpdate: () => this.applyView() }, 0)
            .to(this.camera, { fov: s.fov, onUpdate: () => this.camera.updateProjectionMatrix() }, 0)
            .to(this.spot, { intensity: 0, duration: 0.6 }, 0)
            .to(this, { offsetK: 1 }, 0)
            .to(this, { rotateFocus: 0 }, 0);
        this.items.forEach(it => tl.to(it, { lift: 0, spin: 0, iso: 0, gx: 0, gz: 0 }, 0));
        this.emit('unfocus');
        this.focused = null;
        this.host.classList.remove('is-focused');
    }

    // Project an item's anchor to host pixels (for HTML hotspots)
    project(id) {
        const it = this.primaryOf(id);
        if (!it) return null;
        const v = new Vector3(it.base.pos.x, it.base.pos.y, it.base.pos.z);
        v.y += (it.root.userData.anchorY || 2) * it.base.scale + it.lift;
        v.project(this.camera);
        return { x: (v.x + 1) / 2 * this.w, y: (1 - v.y) / 2 * this.h, behind: v.z > 1 };
    }

    loop() {
        if (this.raf || !this.visible || document.hidden) return;
        const tick = () => {
            this.raf = null;
            if (!this.visible || document.hidden) return;
            this.frame();
            this.raf = requestAnimationFrame(tick);
        };
        this.raf = requestAnimationFrame(tick);
    }

    frame() {
        const t = (performance.now() - this.clockStart) / 1000;
        if (!this.focused && this.pointer.x > -2 && !noHover) {
            const hit = this.pick();
            this.setHover(hit ? hit.userData.pickId : null);
        }
        for (const it of this.items) {
            const r = it.root;
            const isF = this.focused && this.focused.id === it.id;
            // off: hidden by the current layout (e.g. a duplicate pack on phones)
            const iso = Math.max(it.iso, it.off || 0);
            const sc = it.base.scale * Math.max(0.001, 1 - iso);
            r.scale.setScalar(sc);
            r.visible = iso < 0.995;
            r.position.set(it.base.pos.x + (it.gx || 0), it.base.pos.y + it.lift + it.hover * 0.06 - iso * 0.3, it.base.pos.z + (it.gz || 0));
            r.rotation.y = it.base.rotY + it.spin + (isF ? this.rotateFocus : 0) + (it.idleSpin && !isF ? t * it.idleSpin : 0) + (it.drag || 0) + (it.idleSway || 0);
            if (it.mirror) {
                it.mirror.position.set(r.position.x, -r.position.y, r.position.z);
                it.mirror.rotation.copy(r.rotation);
                it.mirror.scale.set(r.scale.x, -r.scale.y, r.scale.z);
                it.mirror.visible = r.visible && r.position.y >= -0.001; // never let a reflection rise above the glass
            }
            if (it.shadow) it.shadow.position.set(r.position.x, 0.004, r.position.z);
            if (it.shadow) it.shadow.scale.setScalar(Math.max(0.001, (1 - it.lift * 0.8) * (1 - iso)));
        }
        if (this.idle) this.idle(t, this);
        const px = reduced ? 0 : this.parallax.x, py = reduced ? 0 : this.parallax.y;
        const k = this.focused ? 0.15 : 0.5;
        const oy = this.offset ? this.offset.y * this.offsetK : 0;
        this.camera.position.set(this.cam.pos.x + px * k, this.cam.pos.y + py * k * 0.5 + oy, this.cam.pos.z);
        this.camera.lookAt(this.cam.look);
        this.render();
        this.emit('frame', t);
    }

    render() { this.renderer.render(this.scene, this.camera); }
}
