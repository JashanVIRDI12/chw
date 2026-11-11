import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import surgical from './data/surgical.json';
import nutra from './data/nutra.json';
import herbal from './data/herbal.json';
import { addToList, onListChange, openComposer, openWhatsApp, buildMessage, removeFromList, getList, track, esc, WA_DISPLAY } from './ui/enquiry.js';
import { openPanel, closePanel, isPanelOpen } from './ui/panel.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IMG = 'assets/img/';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isNarrow = () => innerWidth < 860;
const DL = {
    surgical: 'downloads/CHW-Chase-Plus-Surgical-Range.xlsx',
    nutra: 'downloads/CHW-Nutraceutical-Formulations.xlsx',
    all: 'downloads/CHW-Complete-Product-List.xlsx',
    herbal: 'downloads/CHW-Vitantra-Herbal-Range.xlsx'
};

const SURG = Object.fromEntries(surgical.items.map(p => [p.id, p]));
const NUTRA = nutra.items;
const NUTRA_BY_NAME = new Map(NUTRA.map(n => [n.name.toLowerCase(), n]));
const HERBS = herbal.items;
const HERB = Object.fromEntries(HERBS.map(h => [h.id, h]));
const herbState = { id: HERB.ashwagandha ? 'ashwagandha' : HERBS[0].id };
const herbLabel = (h) => ({ name: h.name, tagline: h.tagline, botanical: h.botanical, points: h.points });
const LABEL_STYLES = {
    classic: 'Classic Gold', emerald: 'Emerald', ivory: 'Ivory Sage', midnight: 'Midnight Copper'
};
const FINISHES = { black: 'Gloss Black', white: 'Pearl White', amber: 'Amber' };

/* Real studio photography of private-label bottles */
const BOTTLE_PHOTOS = [
    ['bottle-biotin.webp', 'Biotin'], ['bottle-boron.webp', 'Boron'], ['bottle-colostrum.webp', 'Colostrum'],
    ['bottle-quercetin.webp', 'Quercetin'], ['bottle-chromium.webp', 'Chromium Picolinate'], ['bottle-amla.webp', 'Amla Extract'],
    ['bottle-lactoferrin.webp', 'Lactoferrin'], ['bottle-hmb.webp', 'HMB'], ['bottle-caffeine.webp', 'Caffeine'], ['bottle-iimb.webp', 'IIMB']
];

/* ───────────── Studio label state ───────────── */
const studio = { brand: '', product: 'Biotin', count: 60, format: 'Capsules', style: 'classic', finish: 'black' };
function labelOpts(s = studio) {
    const f = NUTRA_BY_NAME.get(s.product.toLowerCase());
    return {
        brand: s.brand || 'Your Brand', product: s.product || 'Your Formula', format: s.format, count: s.count, style: s.style,
        ingredients: f ? f.ingredients : [], benefits: f ? f.benefits : []
    };
}

/* ───────────── Icons (inline SVG sprite usage) ───────────── */
const ic = (n) => `<i class="ic ic-${n}" aria-hidden="true"></i>`;

/* ───────────── Panel content ───────────── */
function skuChips(p) {
    return `<div class="chips chips--sizes">${p.skus.map((k, i) => `<label class="chip"><input type="checkbox" value="${esc(k.spec + ' (' + k.pack + ')')}" ${p.skus.length === 1 ? 'checked' : ''}><span>${esc(k.spec)}<small>${esc(k.pack)}</small></span></label>`).join('')}</div>`;
}
function selectedSkus(root) { return $$('.chips--sizes input:checked', root).map(i => i.value); }

function surgicalPhoto(p, className, sizes) {
    const srcset = p.photoBase
        ? ` srcset="${[480, 800, 1200].map(size => `${IMG + p.photoBase}-${size}.webp ${size}w`).join(', ')}" sizes="${sizes}"`
        : '';
    return `<img class="${className}" src="${IMG + p.photo}"${srcset} alt="${esc(p.name)} packaging visual" loading="lazy" decoding="async" width="1200" height="1200">`;
}

function surgicalHTML(p) {
    return `
      ${p.photo ? `<figure class="pp__photo${p.photoBase ? ' pp__photo--studio' : ''}">${surgicalPhoto(p, '', '(min-width: 860px) 420px, 90vw')}<figcaption>${ic('camera')} ${p.photoBase ? 'Packaging visual' : 'Product photo'}</figcaption></figure>` : ''}
      <div><span class="eyebrow">Chase+ · Surgical &amp; Medical</span><h3 id="pp-title" class="pp__title">${esc(p.name)}</h3><p class="pp__lead">${esc(p.tagline)}</p></div>
      <ul class="pp__feats">${p.features.map(f => `<li>${ic('check')}${esc(f)}</li>`).join('')}</ul>
      <div class="pp__block"><h4>Choose sizes <small>tap to include in your enquiry</small></h4>${skuChips(p)}</div>
      <dl class="pp__specs">
        <div><dt>Brand</dt><dd>Chase+ by CHW</dd></div>
        <div><dt>Used for</dt><dd>${esc(p.uses)}</dd></div>
        <div><dt>HSN code</dt><dd>${p.hsnNote ? 'On request' : surgical.hsn}</dd></div>
        <div><dt>Made in</dt><dd>India · WHO-GMP facility</dd></div>
      </dl>
      <div class="pp__actions">
        <button class="btn btn--wa btn--lg" data-act="enquire">${ic('wa')} <span>Enquire<span class="pp__long"> on WhatsApp</span></span></button>
        <button class="btn btn--glass" data-act="add">${ic('plus')} <span>Add to<span class="pp__long"> enquiry</span> list</span></button>
      </div>
      <a class="pp__dl" href="${DL.surgical}" download data-dl="surgical">${ic('sheet')} Full Chase+ size list (.xlsx)</a>`;
}

function surgicalItem(p, root) {
    return { type: 'surgical', id: p.id, name: p.name, skus: root ? selectedSkus(root) : [], photo: p.photo ? IMG + p.photo : '' };
}

function bindSurgical(p) {
    return (root) => {
        $('[data-act="enquire"]', root).onclick = () => openComposer([surgicalItem(p, root)]);
        $('[data-act="add"]', root).onclick = (e) => { addToList(surgicalItem(p, root)); flashAdded(e.currentTarget); };
    };
}

function privateLabelHTML() {
    return `
      <figure class="pp__photo pp__photo--strip">${BOTTLE_PHOTOS.slice(0, 3).map(([f, n]) => `<img src="${IMG + f}" alt="${esc(n)} private label bottle">`).join('')}<figcaption>${ic('camera')} Real private-label samples</figcaption></figure>
      <div><span class="eyebrow">Nutraceuticals · Private label</span><h3 id="pp-title" class="pp__title">Your brand. Our certified formulations.</h3>
      <p class="pp__lead">${NUTRA.length} ready formulations across ${Object.keys(nutra.categories).length} health categories in capsules, tablets and powders, packed under your label.</p></div>
      <ul class="pp__feats">${['Your logo & label artwork', 'Capsules · tablets · powders', 'Export documentation support', 'Samples before bulk order'].map(f => `<li>${ic('check')}${f}</li>`).join('')}</ul>
      <div class="pp__actions">
        <button class="btn btn--wa btn--lg" data-act="enquire">${ic('wa')} <span>Enquire<span class="pp__long"> on WhatsApp</span></span></button>
        <button class="btn btn--gold" data-act="studio">${ic('wand')} <span>See<span class="pp__long"> your</span> label<span class="pp__long"> in 3D</span></span></button>
      </div>
      <a class="pp__dl" href="${DL.nutra}" download data-dl="nutra">${ic('sheet')} All ${NUTRA.length} formulations (.xlsx)</a>`;
}
function bindPrivateLabel(root) {
    $('[data-act="studio"]', root).onclick = () => { closePanel(); setTimeout(() => scrollToId('studio'), 250); };
    $('[data-act="enquire"]', root).onclick = () => openComposer([], { intent: 'I am interested in private-label nutraceuticals under my own brand.', needs: ['Export price list', 'MOQ details', 'Private label artwork'] });
}

function studioHTML() {
    const f = NUTRA_BY_NAME.get(studio.product.toLowerCase());
    return `
      <div><span class="eyebrow">Your label preview</span><h3 id="pp-title" class="pp__title">${esc(studio.product)}</h3>
      <p class="pp__lead">for <strong>${esc(studio.brand || 'Your Brand')}</strong> · ${esc(studio.format)} · design may vary as per your requirements</p></div>
      ${f ? `<div class="pp__block"><h4>Composition</h4><table class="pp__table">${f.ingredients.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b || '-')}</td></tr>`).join('')}</table></div>
      <div class="pp__block"><h4>Key benefits</h4><ul class="pp__feats">${f.benefits.map(b => `<li>${ic('check')}${esc(b)}</li>`).join('')}</ul></div>`
        : `<p class="pp__fine">Custom formula? Share your composition and we will check feasibility.</p>`}
      <div class="pp__actions">
        <button class="btn btn--wa btn--lg" data-act="enquire">${ic('wa')} <span>Send<span class="pp__long"> this</span> label<span class="pp__long"> on WhatsApp</span></span></button>
        <button class="btn btn--glass" data-act="add">${ic('plus')} Add to list</button>
      </div>`;
}
const labelItem = () => ({ type: 'label', id: 'label', name: `Private label ${studio.product}`, product: studio.product, brand: studio.brand || 'Your Brand', format: studio.format });
function bindStudio(root) {
    $('[data-act="enquire"]', root).onclick = () => openComposer([labelItem()], { needs: ['Export price list', 'MOQ details', 'Private label artwork', 'Samples'] });
    $('[data-act="add"]', root).onclick = (e) => { addToList(labelItem()); flashAdded(e.currentTarget); };
}

function herbalHTML() {
    return `
      <figure class="pp__photo pp__photo--strip pp__photo--herbs">${['ashwagandha', 'shilajit', 'moringa'].filter(k => HERB[k]).map(k => `<img src="${IMG}herbal/${k}-pack.webp" alt="Vitantra ${esc(HERB[k].name)} capsules jar">`).join('')}<figcaption>${ic('camera')} Vitantra packaging</figcaption></figure>
      <div><span class="eyebrow">Ayurvedic herbals · Vitantra</span><h3 id="pp-title" class="pp__title">Classical Ayurveda, export-ready.</h3>
      <p class="pp__lead">${HERBS.length} single-herb capsules made in our WHO-GMP facility, supplied as Vitantra or under your own label.</p></div>
      <ul class="pp__feats">${['Ashwagandha, Shilajit, Moringa, Turmeric & more', 'Vegetarian capsules in amber glass', 'Mix herbals with surgical & nutra in one shipment', 'Registration guidance for your market'].map(f => `<li>${ic('check')}${f}</li>`).join('')}</ul>
      <div class="pp__actions">
        <button class="btn btn--wa btn--lg" data-act="enquire">${ic('wa')} <span>Enquire<span class="pp__long"> on WhatsApp</span></span></button>
        <button class="btn btn--kraft" data-act="herbs">${ic('leaf')} <span>Browse<span class="pp__long"> all ${HERBS.length}</span> herbs</span></button>
      </div>
      <a class="pp__dl" href="${DL.herbal}" download data-dl="herbal">${ic('sheet')} Vitantra herbal range (.xlsx)</a>`;
}
function bindHerbal(root) {
    $('[data-act="herbs"]', root).onclick = () => { closePanel(); setTimeout(() => scrollToId('herbal'), 250); };
    $('[data-act="enquire"]', root).onclick = () => openComposer([], PRESET.herbal[1]);
}

function contentFor(id) {
    if (id === 'herbal') return { html: herbalHTML(), bind: bindHerbal };
    if (SURG[id]) return { html: surgicalHTML(SURG[id]), bind: bindSurgical(SURG[id]) };
    if (id === 'bottle') return { html: privateLabelHTML(), bind: bindPrivateLabel };
    if (id === 'studio') return { html: studioHTML(), bind: bindStudio };
    return null;
}

/* ───────────── 3D ↔ panel orchestration ───────────── */
function selectOnStage(stage, id, root, seq) {
    const c = contentFor(id);
    if (!c) return;
    const narrow = isNarrow();
    const go = () => {
        const i = seq.indexOf(id);
        const step = seq.length > 1 ? (d) => () => selectOnStage(stage, seq[(i + d + seq.length) % seq.length], null, seq) : null;
        // open first: on phones the camera frames the product in the space the sheet leaves free
        openPanel(c.html, { stage, onRender: c.bind, onClose: () => stage.unfocus(), onPrev: step && step(-1), onNext: step && step(1) });
        stage.focus(id, narrow ? 'bottom' : 'side', root, narrow ? freeBand() : null);
        track('product_focus', { product: id });
    };
    if (isPanelOpen() || stage.pinned) return go();
    const r = stage.host.getBoundingClientRect();
    if (narrow) return scrollThen(scrollY + r.top - navBottom(), go);
    if (r.top < -40 || r.bottom > innerHeight + 40) return scrollThen(scrollY + r.top - Math.max(0, (innerHeight - r.height) / 2), go);
    go();
}

const navBottom = () => Math.max(0, $('.nav')?.getBoundingClientRect().bottom || 0);
// Visible band between the fixed nav and the open sheet (layout box, so the slide-in transform doesn't matter)
function freeBand() {
    const card = $('.pp__card');
    return { top: navBottom(), bottom: card ? card.offsetTop : innerHeight * 0.55 };
}

// Smooth-scroll, then run fn once the page has settled
function scrollThen(top, fn) {
    top = Math.max(0, Math.min(top, document.documentElement.scrollHeight - innerHeight));
    if (Math.abs(scrollY - top) < 2) return fn();
    let done = false;
    const run = () => { if (done) return; done = true; removeEventListener('scrollend', run); fn(); };
    addEventListener('scrollend', run, { once: true });
    setTimeout(run, reduced ? 50 : 900);
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}

function openDetails(id) {
    const c = contentFor(id);
    if (c) openPanel(c.html, { onRender: c.bind });
}

function flashAdded(btn) {
    if (!btn) return;
    const old = btn.innerHTML;
    btn.classList.add('is-done');
    btn.innerHTML = `${ic('check')} Added to list`;
    setTimeout(() => { btn.classList.remove('is-done'); btn.innerHTML = old; }, 1600);
    const fab = $('.list-fab');
    if (fab && !reduced) gsap.fromTo(fab, { scale: 1.25 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, .4)' });
}

function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

/* ───────────── Surgical range cards (minimal) ───────────── */
function renderRange() {
    const grid = $('#range-grid');
    if (!grid) return;
    const HIDE = ['thaan', 'paper']; // listed in the downloadable sheet instead
    grid.innerHTML = surgical.items.filter(p => !HIDE.includes(p.id)).map((p, i) => `
      <article class="rcard rv${p.photoBase ? ' rcard--studio' : ''}" data-id="${p.id}" style="--i:${i}">
        <button class="rcard__media" data-details aria-label="View ${esc(p.name)} details">
          ${p.photo ? `${p.photoBase ? '' : `<img class="rcard__bg" src="${IMG + p.photo}" alt="" aria-hidden="true" loading="lazy" decoding="async">`}${surgicalPhoto(p, 'rcard__img', '(max-width: 600px) 60vw, (max-width: 900px) 50vw, 320px')}` : `<span class="rcard__ph">${ic('cross')}<b>Chase+</b></span>`}
        </button>
        <div class="rcard__body">
          <h3>${esc(p.short)}</h3>
          <p>${p.skus.length} size${p.skus.length > 1 ? 's' : ''} · ${esc(p.skus[0].spec)}${p.skus.length > 1 ? ' +' : ''}</p>
        </div>
        <div class="rcard__cta">
          <button class="btn btn--wa btn--sm" data-enquire>${ic('wa')} Enquire</button>
          <button class="rcard__more" data-details aria-label="${esc(p.name)} sizes and details">Details ${ic('arrow')}</button>
        </div>
      </article>`).join('') + `
      <a class="rcard rcard--dl rv" href="${DL.surgical}" download data-dl="surgical">
        <span class="rcard__dlic">${ic('sheet')}<b>XLSX</b></span>
        <span class="rcard__dlbody"><small>Full Chase+ list</small><strong>All 37 SKUs in one sheet</strong><span>Every size and pack, including gauze thaan, paper tape and more. Add your quantities and send it back on WhatsApp.</span></span>
        <span class="btn btn--gold btn--sm">${ic('download')} Download Excel</span>
      </a>`;
    grid.addEventListener('click', e => {
        const card = e.target.closest('.rcard:not(.rcard--dl)');
        if (!card) return;
        const p = SURG[card.dataset.id];
        if (e.target.closest('[data-details]')) openDetails(p.id);
        else if (e.target.closest('[data-enquire]')) openComposer([surgicalItem(p)]);
    });
}

/* ───────────── Studio controls ───────────── */
let studioStage = null;
// Private label: while in view, the bottle's label steps through ready formulations under "Your Brand".
// The first touch hands control to the visitor (drag to read the back label) and stops the cycle for good.
const LABEL_CYCLE = ['Biotin', 'Daily Probiotic', 'Vitamin C 500', 'Coenzyme Q10', 'Brain & Focus', 'Turmeric', 'Heart Health'];
function cycleStudioLabel(host) {
    if (reduced) return;
    const picks = LABEL_CYCLE.filter(n => NUTRA_BY_NAME.has(n.toLowerCase()));
    let k = Math.max(0, picks.indexOf(studio.product)), timer = 0, stopped = false;
    const step = () => {
        if (!studioStage || studioStage.focused || studioStage.dragging || isPanelOpen()) return;
        k = (k + 1) % picks.length;
        studio.product = picks[k];
        const f = NUTRA_BY_NAME.get(studio.product.toLowerCase());
        studio.format = f && /Tablets|Capsules/.test(f.format) ? f.format : 'Capsules';
        studioStage.setLabel(labelOpts());
        studioStage.spinTo();
    };
    ScrollTrigger.create({
        trigger: host, start: 'top 75%', end: 'bottom 25%',
        onToggle: st => { clearInterval(timer); if (st.isActive && !stopped) timer = setInterval(step, 3600); }
    });
    host.addEventListener('pointerdown', () => { stopped = true; clearInterval(timer); }, { once: true });
}

/* ───────────── Vitantra herbal section ───────────── */
let herbalStage = null;
const herbItem = (h) => ({ type: 'herbal', id: h.id, name: h.name, botanical: h.botanical, photo: `${IMG}herbal/${h.id}-pack.webp` });

function initHerbal() {
    const sec = $('#herbal');
    if (!sec) return;
    const rail = $('#herb-rail');
    rail.innerHTML = HERBS.map((h, i) => `
      <button class="herb" type="button" role="option" data-herb="${h.id}" aria-selected="false" style="--i:${i}">
        <span class="herb__img"><img src="${IMG}herbal/${h.id}-480.webp" alt="" loading="lazy" decoding="async" width="480" height="480"></span>
        <span class="herb__name">${esc(h.name)}</span>
        <span class="herb__bot">${esc(h.botanical)}</span>
      </button>`).join('');
    // Arrow buttons page the rail; each hides at its end
    const carousel = rail.parentElement;
    const syncNav = () => {
        const max = rail.scrollWidth - rail.clientWidth - 2;
        const start = rail.scrollLeft <= 2, end = rail.scrollLeft >= max;
        carousel.toggleAttribute('data-at-start', start);
        carousel.toggleAttribute('data-at-end', end);
        $('[data-herb-nav="-1"]', carousel).disabled = start;
        $('[data-herb-nav="1"]', carousel).disabled = end;
    };
    $$('[data-herb-nav]', carousel).forEach(btn => btn.addEventListener('click', () => {
        rail.scrollBy({ left: Number(btn.dataset.herbNav) * rail.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' });
    }));
    rail.addEventListener('scroll', syncNav, { passive: true });
    addEventListener('resize', syncNav, { passive: true });
    syncNav();
    const enquireLbl = $('[data-herb-enquire] span', sec);
    const select = (id, { spin = true, user = false } = {}) => {
        const h = HERB[id];
        if (!h) return;
        herbState.id = id;
        const idx = HERBS.indexOf(h);
        $$('.herb', rail).forEach(b => b.setAttribute('aria-selected', String(b.dataset.herb === id)));
        $('[data-herb-index]', sec).textContent = String(idx + 1).padStart(2, '0');
        $('[data-herb-botanical]', sec).textContent = h.botanical;
        $('[data-herb-name]', sec).textContent = h.name;
        $('[data-herb-tagline]', sec).textContent = h.tagline;
        $('[data-herb-points]', sec).innerHTML = h.points.map(p => `<li>${ic('leaf')}<span>${esc(p)}</span></li>`).join('');
        enquireLbl.textContent = `Enquire about ${h.name}`;
        const fb = $('[data-herbal-fallback]', sec);
        if (fb) fb.src = `${IMG}herbal/${id}-pack.webp`;
        if (herbalStage) { herbalStage.setLabel(herbLabel(h)); if (spin) herbalStage.spinTo(); }
        if (!reduced && user) gsap.fromTo($$('.herbal__panel > *', sec), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'expo.out', overwrite: true });
        if (user) track('herb_select', { herb: id });
    };
    rail.addEventListener('click', e => {
        const b = e.target.closest('[data-herb]');
        if (!b) return;
        select(b.dataset.herb, { user: true });
        if (isNarrow()) $('#herbal-stage').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });
    rail.addEventListener('keydown', e => {
        if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
        e.preventDefault();
        const i = HERBS.findIndex(h => h.id === herbState.id);
        const n = HERBS[(i + (e.key === 'ArrowRight' ? 1 : -1) + HERBS.length) % HERBS.length];
        select(n.id, { user: true });
        const b = $(`[data-herb="${n.id}"]`, rail);
        b.focus(); b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
    $('[data-herb-enquire]', sec).addEventListener('click', () => openComposer([herbItem(HERB[herbState.id])], PRESET.herbal[1]));
    $('[data-herb-add]', sec).addEventListener('click', e => { addToList(herbItem(HERB[herbState.id])); flashAdded(e.currentTarget); });
    select(herbState.id, { spin: false });
}

// "Online now" during Indian office hours; an honest reply promise otherwise
function initDeskStatus() {
    const ist = new Date(Date.now() + (330 + new Date().getTimezoneOffset()) * 60000);
    const mins = ist.getHours() * 60 + ist.getMinutes();
    const open = ist.getDay() !== 0 && mins >= 600 && mins < 1110;
    $$('[data-desk-status]').forEach(el => {
        el.classList.toggle('is-away', !open);
        const t = $('[data-desk-text]', el);
        if (t) t.textContent = open ? (el.dataset.on || 'Export desk online now on WhatsApp') : (el.dataset.off || 'Export desk replies within one business day');
    });
}

/* ───────────── Enquiry list (FAB + drawer) ───────────── */
function initList() {
    const fab = $('.list-fab'), badge = $$('[data-list-count]'), drawer = $('#list-drawer');
    onListChange(list => {
        badge.forEach(b => { b.textContent = list.length; b.hidden = !list.length; });
        fab.classList.toggle('has-items', list.length > 0);
        const body = $('[data-list-body]', drawer);
        body.innerHTML = list.length ? list.map((it, i) => `
          <li><div><strong>${esc(it.type === 'label' ? `${it.product} · ${it.brand}` : it.name)}</strong><small>${esc(it.type === 'surgical' ? ((it.skus || []).join(' / ') || 'All sizes') : it.type === 'label' ? `${it.format} · design as per requirements` : it.type === 'herbal' ? 'Vitantra · capsules' : it.pack || '')}</small></div>
          <button class="icon-btn icon-btn--sm" data-rm="${i}" aria-label="Remove">${ic('x')}</button></li>`).join('')
            : `<li class="empty">Your list is empty. Add products with ${ic('plus')} and send them all in one WhatsApp message.</li>`;
        $('[data-list-send]', drawer).disabled = !list.length;
    });
    const toggle = (open) => {
        drawer.classList.toggle('is-open', open);
        drawer.setAttribute('aria-hidden', !open);
        fab.setAttribute('aria-expanded', open);
    };
    $$('[data-open-list]').forEach(b => b.addEventListener('click', () => toggle(!drawer.classList.contains('is-open'))));
    drawer.addEventListener('click', e => {
        const rm = e.target.closest('[data-rm]');
        if (rm) removeFromList(+rm.dataset.rm);
        if (e.target.closest('[data-list-close]')) toggle(false);
        if (e.target.closest('[data-list-send]')) { toggle(false); openComposer(null); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
}

/* ───────────── Global buttons ───────────── */
const PRESET = {
    general: [[], {}],
    pricelist: [[], { intent: 'Please share your export price list.', needs: ['Export price list', 'MOQ details'] }],
    surgical: [[], { intent: 'I am interested in your Chase+ surgical & medical range.', needs: ['Export price list', 'MOQ details', 'Samples'] }],
    privatelabel: [[], { intent: 'I want to launch nutraceuticals under my own brand (private label).', needs: ['MOQ details', 'Private label artwork', 'Samples'] }],
    herbal: [[], { intent: 'I am interested in your Vitantra Ayurvedic herbal range for export.', needs: ['Export price list', 'MOQ details', 'Export documents'] }],
    samples: [[], { intent: 'I would like to request samples.', needs: ['Samples', 'Export price list'] }],
    docs: [[], { intent: 'Please share your WHO-GMP certificate and product documents (CoA) for our registration file.', needs: ['Export documents'] }],
    meeting: [[], { intent: 'I would like to schedule a call with your export team.', needs: ['Export price list'] }],
    list: [null, {}]
};

// FAQ: one answer open at a time. Heights tween to "auto", answer lines rise out of masks, the plus spins
// into a cross, and the question crossing mid-screen gets its number highlighted.
function initFaq() {
    const items = $$('.faq__item');
    if (!items.length) return;
    const D = reduced ? 0 : 1;
    let active = -1;
    const roll = (i) => {
        if (i === active) return;
        active = i;
        items.forEach((it, k) => it.classList.toggle('is-current', k === i));
    };
    const open = (d) => {
        const a = $('.faq__a', d);
        d.open = true;
        d.classList.add('is-open');
        gsap.fromTo(a, { height: 0 }, { height: 'auto', duration: 0.75 * D, ease: 'expo.out', overwrite: true });
        gsap.to($('.faq__ic i', d), { rotate: 135, duration: 0.7 * D, ease: 'back.out(2.2)', overwrite: true });
        if (D) {
            d._split?.revert();
            d._split = SplitText.create($('p', a), { type: 'lines', mask: 'lines' });
            gsap.from(d._split.lines, { yPercent: 105, duration: 0.9, stagger: 0.06, ease: 'expo.out', delay: 0.08 });
        }
        roll(items.indexOf(d));
    };
    const close = (d) => {
        d.classList.remove('is-open');
        gsap.to($('.faq__ic i', d), { rotate: 0, duration: 0.5 * D, ease: 'power3.out', overwrite: true });
        gsap.to($('.faq__a', d), {
            height: 0, duration: 0.5 * D, ease: 'power3.inOut', overwrite: true,
            onComplete: () => { d.open = false; gsap.set($('.faq__a', d), { clearProps: 'height' }); d._split?.revert(); d._split = null; }
        });
    };
    items.forEach(d => $('summary', d).addEventListener('click', e => {
        e.preventDefault(); // we drive <details> ourselves so the height can animate
        if (d.classList.contains('is-open')) return close(d);
        items.filter(x => x !== d && x.classList.contains('is-open')).forEach(close);
        open(d);
    }));
    roll(0);
    if (reduced) return;

    // the question crossing the middle of the screen gets its number highlighted
    items.forEach((it, i) => ScrollTrigger.create({ trigger: it, start: 'top 55%', end: 'bottom 55%', onToggle: st => st.isActive && roll(i) }));

    // entrance: rules draw, questions rise line by line, icons spin in, the side panel follows
    const qs = SplitText.create($$('.faq__q'), { type: 'lines', mask: 'lines' });
    gsap.timeline({
        scrollTrigger: { trigger: '.faq__list', start: 'top 80%' }, defaults: { ease: 'expo.out' },
        onComplete: () => qs.revert() // plain text again, so later resizes re-wrap naturally
    })
        .from('.faq__rule', { scaleX: 0, duration: 1.3, stagger: 0.07, ease: 'power3.inOut' }, 0)
        .from(qs.lines, { yPercent: 105, duration: 1.1, stagger: 0.06 }, 0.15)
        .from('.faq__n', { y: 10, opacity: 0, duration: 0.8, stagger: 0.07 }, 0.3)
        .from('.faq__ic', { scale: 0, rotate: -120, duration: 1, stagger: 0.07, ease: 'back.out(2)' }, 0.35);
    gsap.timeline({ scrollTrigger: { trigger: '.faq__desk', start: 'top 85%' }, defaults: { ease: 'expo.out' } })
        .from('.faq__desk', { y: 40, opacity: 0, duration: 1.1 })
        .from('.faq__desk > :not(.faq__quick), .chip-q', { y: 14, opacity: 0, duration: 0.8, stagger: 0.06 }, 0.2);
}

// "Drag to turn" hints fade out once the visitor has touched the stage
function initDragHints() {
    $$('.studio__drag').forEach(h => h.parentElement.addEventListener('pointerdown', () => h.parentElement.classList.add('was-dragged'), { once: true }));
}

function initActions() {
    document.addEventListener('click', e => {
        const b = e.target.closest('[data-wa]');
        if (b) {
            e.preventDefault();
            const kind = b.dataset.wa;
            const preset = PRESET[kind] || [[], {}];
            openComposer(preset[0], preset[1]);
        }
        const wi = e.target.closest('[data-wa-item]');
        if (wi && SURG[wi.dataset.waItem]) openComposer([surgicalItem(SURG[wi.dataset.waItem])]);
        const q = e.target.closest('[data-wa-quick]');
        if (q) {
            e.preventDefault();
            openWhatsApp(buildMessage([], { intent: q.dataset.waQuick }), { source: 'quick' });
        }
        const d = e.target.closest('[data-dl]');
        if (d) {
            track('file_download', { file: d.dataset.dl });
            toast(`Downloading… Need export prices? <button class="link" data-wa="pricelist">Ask on WhatsApp</button>`);
        }
        const hs = e.target.closest('[data-focus]');
        if (hs && window.__stages?.hero) {
            selectOnStage(window.__stages.hero, hs.dataset.focus, null, HERO_SEQ);
        } else if (hs) openDetails(hs.dataset.focus);
    });
}

let toastTimer;
function toast(html) {
    const t = $('#toast');
    t.innerHTML = html;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 5200);
}

/* ───────────── Motion ───────────── */
const HERO_SEQ = ['bottle', 'eab', 'silicone', 'syringe', 'herbal'];

function initMotion() {
    const nav = $('.nav');
    ScrollTrigger.create({ start: 80, onUpdate: s => nav.classList.toggle('is-solid', s.scroll() > 80) });
    ScrollTrigger.create({ trigger: '#proof', start: 'top 60%', onEnter: () => document.body.classList.add('show-bar'), onLeaveBack: () => document.body.classList.remove('show-bar') });

    initMarquee();
    initWhy();
    if (reduced) { $$('.rv').forEach(el => el.classList.add('in', 'settled')); return; }

    // Hero headline
    const h1 = $('.hero h1');
    if (h1) {
        const split = SplitText.create(h1, { type: 'lines, words', mask: 'lines' });
        gsap.from(split.words, { yPercent: 110, duration: 1.2, stagger: 0.045, ease: 'expo.out', delay: 0.2 });
        gsap.from('.hero [data-hero-in]', { y: 26, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.6 });
        gsap.to('.hero__copy', { yPercent: -12, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    // Section titles: masked line reveal
    $$('[data-split]').forEach(el => {
        const s = SplitText.create(el, { type: 'lines', mask: 'lines' });
        gsap.from(s.lines, { yPercent: 105, duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    // Generic reveals. Each element rides its own GPU layer (force3D) while moving; when it lands the
    // inline styles are cleared so its CSS (hover lifts, transitions) takes over again.
    ScrollTrigger.batch('.rv', {
        start: 'top 90%',
        onEnter: els => {
            els.forEach(e => e.classList.add('in'));
            gsap.fromTo(els, { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'expo.out', force3D: true, overwrite: true,
                onComplete: () => els.forEach(e => { gsap.set(e, { clearProps: 'opacity,transform' }); e.classList.add('settled'); })
            });
        }
    });

    // Proof: rules draw, stats rise out of masks, certs pop in
    const proof = $('.proof');
    if (proof) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: proof, start: 'top 80%' } });
        tl.from('.proof__stats', { y: 40, opacity: 0, scale: 0.97, duration: 1.2, ease: 'expo.out' })
            .from('.stat__ic', { scale: 0.3, opacity: 0, rotate: -30, duration: 0.9, stagger: 0.08, ease: 'back.out(2)' }, 0.25)
            .from('.stat__num > *', { yPercent: 110, duration: 1.1, stagger: 0.1, ease: 'expo.out' }, 0.25)
            .from('.stat__label', { y: 14, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 0.5)
            .from('.hospitals__label', { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.6)
            .from('.marquee', { opacity: 0, duration: 1.2 }, 0.7);
    }
    initCertsMotion();

    // Counters
    $$('[data-count]').forEach(el => {
        const end = +el.dataset.count;
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' }, onUpdate: () => { el.textContent = Math.round(o.v) + (el.dataset.suffix || ''); } });
    });

    // Process: progress track fills, nodes light up in sequence
    const proc = $('.process');
    if (proc) {
        const steps = $$('.step', proc);
        const fill = $('.track__fill', proc);
        gsap.fromTo(fill, { '--p': 0 }, {
            '--p': 1, ease: 'none',
            scrollTrigger: {
                trigger: '.steps', start: 'top 70%', end: 'bottom 60%', scrub: 0.6,
                onUpdate: s => steps.forEach((st, i) => st.classList.toggle('is-lit', s.progress >= i / (steps.length - 1) - 0.02))
            }
        });
        gsap.from(steps, { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.steps', start: 'top 82%' } });
    }


    // Final CTA glow follows pointer
    const cta = $('.final');
    if (cta) cta.addEventListener('pointermove', e => {
        const r = cta.getBoundingClientRect();
        cta.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        cta.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });

    // Magnetic primary buttons (desktop)
    if (matchMedia('(hover: hover)').matches) {
        $$('.btn--magnet').forEach(b => {
            b.addEventListener('pointermove', e => {
                const r = b.getBoundingClientRect();
                gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: 'power3.out' });
            });
            b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, .4)' }));
        });
    }
}

// Why CHW: cards rise in as the section scrolls into view
function initWhy() {
    const sec = $('#why');
    if (!sec || reduced) return;
    gsap.from($$('.why-card', sec), { y: 40, opacity: 0, duration: .9, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.why__cards', start: 'top 82%' } });
    gsap.from('.why__cta', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.why__cta', start: 'top 92%' } });
}

// Hospital logo marquee: seamless GSAP loop that surges and reverses with scroll velocity
function initMarquee() {
    const track = $('.marquee__track');
    if (!track) return;
    const base = track.querySelector('.marquee__set');
    // near-square logos (AIIMS, Apollo) get a taller box so every logo reads the same size
    const tag = img => { if (img.naturalWidth && img.naturalWidth / img.naturalHeight < 1.4) img.classList.add('is-tall'); };
    $$('img', base).forEach(img => img.complete ? tag(img) : img.addEventListener('load', () => tag(img), { once: true }));

    let loop, dir = 1;
    const build = () => {
        // repeat the set until one loop covers the widest screen twice, so there is never an empty stretch
        const setW = base.getBoundingClientRect().width;
        if (!setW) return;
        const need = Math.ceil((innerWidth * 2) / setW) + 1;
        $$('.marquee__set', track).slice(1).forEach(n => n.remove());
        for (let k = 1; k < need; k++) {
            const c = base.cloneNode(true);
            c.setAttribute('aria-hidden', 'true');
            $$('img', c).forEach(im => { im.alt = ''; });
            track.appendChild(c);
        }
        const ts = loop ? loop.timeScale() : 1;
        if (loop) loop.kill();
        gsap.set(track, { x: 0 });
        // move exactly one set width, then wrap; seamless because the copies are identical
        loop = gsap.to(track, { x: -setW, duration: setW / 70, ease: 'none', repeat: -1 });
        loop.timeScale(ts);
        if (reduced) loop.pause();
    };
    const ready = () => { build(); $$('img', track).forEach(tag); };
    if (document.readyState === 'complete') ready(); else window.addEventListener('load', ready, { once: true });
    requestAnimationFrame(build);
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
    if (reduced) return;

    const settle = gsap.delayedCall(0.25, () => loop && gsap.to(loop, { timeScale: dir, duration: 1.2, ease: 'power2.out' })).pause();
    ScrollTrigger.create({
        trigger: '.proof', start: 'top bottom', end: 'bottom top',
        onUpdate: st => {
            if (!loop) return;
            const v = st.getVelocity();
            if (Math.abs(v) > 30) dir = v > 0 ? 1 : -1;
            gsap.to(loop, { timeScale: dir * Math.min(6, 1 + Math.abs(v) / 350), duration: 0.25, overwrite: true });
            settle.restart(true);
        }
    });
    track.addEventListener('pointerenter', () => loop && gsap.to(loop, { timeScale: 0.2 * dir, duration: 0.6, overwrite: true }));
    track.addEventListener('pointerleave', () => loop && gsap.to(loop, { timeScale: dir, duration: 0.8, overwrite: true }));
}

// Certifications: gold rules draw, rings close, icons spring, names rise out of masks.
// The watermark seal idles in a slow spin; scroll speed surges it (and sets its direction), then it settles.
function initCertsMotion() {
    const sec = $('.certs-sec');
    if (!sec) return;
    gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 72%' }, defaults: { ease: 'expo.out' } })
        .from('.certs-seal', { scale: 0.7, rotate: -120, opacity: 0, duration: 2.2, ease: 'power3.out' }, 0)
        .from('.cert__rule', { scaleX: 0, transformOrigin: '0% 50%', duration: 1.4, stagger: 0.07, ease: 'power3.inOut' }, 0.15)
        .from('.certs-sec__head p, .certs-sec__head .btn', { y: 22, opacity: 0, duration: 1, stagger: 0.12 }, 0.35)
        .from('.cert__ring circle', { strokeDashoffset: 100, duration: 1.3, stagger: 0.08, ease: 'power2.inOut' }, 0.45)
        .from('.cert b > span', { yPercent: 115, duration: 1.1, stagger: 0.08 }, 0.6)
        .from('.cert__mark .ic', { scale: 0, rotate: -45, duration: 1, stagger: 0.08, ease: 'back.out(2.4)' }, 0.85)
        .from('.cert small, .cert__n', { y: 12, opacity: 0, duration: 0.9, stagger: 0.04 }, 0.95);

    gsap.to('.certs-seal', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    const spin = gsap.to('.certs-seal__spin', { rotation: 360, duration: 48, ease: 'none', repeat: -1, paused: true });
    let dir = 1;
    const settle = gsap.delayedCall(0.25, () => gsap.to(spin, { timeScale: dir, duration: 1.4, ease: 'power2.out' })).pause();
    ScrollTrigger.create({
        trigger: sec, start: 'top bottom', end: 'bottom top',
        onToggle: st => (st.isActive ? spin.play() : spin.pause()), // only spin while on screen
        onUpdate: st => {
            const v = st.getVelocity();
            if (Math.abs(v) > 30) dir = v > 0 ? 1 : -1;
            gsap.to(spin, { timeScale: dir * Math.min(14, 1 + Math.abs(v) / 180), duration: 0.25, overwrite: true });
            settle.restart(true);
        }
    });
}

/* ───────────── 3D boot ───────────── */
const SHEETS = () => [
    {
        id: 'dl-surgical', file: DL.surgical, title: 'Chase+ Surgical Range', subtitle: 'Sizes · packing · HSN codes', stat: '37', statLabel: 'SKUs', meta: 'CHW-Chase-Plus-Surgical-Range.xlsx',
        cols: ['Product', 'Size', 'Packing'], widths: [0.42, 0.3, 0.28],
        rows: surgical.items.flatMap(p => p.skus.map(k => [p.short, k.spec, k.pack]))
    },
    {
        id: 'dl-all', file: DL.all, title: 'Complete Product List', subtitle: 'Surgical · nutraceutical · herbal', stat: '120+', statLabel: 'Products', meta: 'CHW-Complete-Product-List.xlsx', accent: 'gold',
        cols: ['Product', 'Range', 'Pack'], widths: [0.48, 0.24, 0.28],
        rows: [...surgical.items.slice(0, 6).map(p => [p.short, 'Chase+', p.skus[0].pack]), ...NUTRA.slice(0, 9).map(n => [n.name, 'Nutra', n.pack])]
    },
    {
        id: 'dl-nutra', file: DL.nutra, title: 'Nutraceutical Formulas', subtitle: 'Composition · benefits · packing', stat: '85', statLabel: 'Formulas', meta: 'CHW-Nutraceutical-Formulations.xlsx',
        cols: ['Formulation', 'Category', 'Pack'], widths: [0.44, 0.32, 0.24],
        rows: NUTRA.map(n => [n.name, nutra.categories[n.cat], n.pack])
    }
];

function downloadFile(href, key) {
    const a = document.createElement('a');
    a.href = href; a.download = '';
    document.body.appendChild(a); a.click(); a.remove();
    track('file_download', { file: key });
    toast(`Downloading… Need export prices? <button class="link" data-wa="pricelist">Ask on WhatsApp</button>`);
}

// Data-saver, 2G or low-memory phones get the static product photos instead of 3D.
function lowPower() {
    const c = navigator.connection || {};
    return !!(c.saveData || /(^|-)2g$/.test(c.effectiveType || '') || (navigator.deviceMemory && navigator.deviceMemory <= 2));
}

async function boot3D() {
    if (lowPower()) { document.documentElement.classList.add('no-webgl', 'is-lite'); return; }
    const S = await import('./three/scenes.js');
    if (!S.webglAvailable()) { document.documentElement.classList.add('no-webgl'); return; }
    document.documentElement.classList.add('has-webgl');
    window.__stages = {};

    const heroHost = $('#hero-stage');
    const hero = await S.heroScene(heroHost, { labelOpts: labelOpts({ ...studio, brand: 'Your Brand', product: 'Biotin' }), herbal: herbLabel(HERB.ashwagandha || HERBS[0]) });
    window.__stages.hero = hero;
    heroHost.classList.add('is-ready');
    hero.on('select', (id, root) => selectOnStage(hero, id, root, HERO_SEQ));
    hero.on('background', closePanel);
    if (!reduced) gsap.to(hero.offset, { y: 2.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    const spots = $$('.hotspot', heroHost);
    const noSpots = matchMedia('(max-width: 860px), (hover: none)'); // hidden there, so skip the per-frame projection
    hero.on('frame', () => !noSpots.matches && spots.forEach(s => {
        const p = hero.project(s.dataset.focus);
        if (p) s.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    }));
    hero.on('hover', id => spots.forEach(s => s.classList.toggle('is-hot', s.dataset.focus === id)));

    const lazy = (el, fn) => el && new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); fn(); } }, { rootMargin: '600px' }).observe(el);

    lazy($('#studio-stage'), async () => {
        const host = $('#studio-stage');
        studioStage = await S.studioScene(host, { labelOpts: labelOpts() });
        window.__stages.studio = studioStage;
        studioStage.setFinish(studio.finish);
        host.classList.add('is-ready');
        studioStage.on('select', (id, root) => selectOnStage(studioStage, 'studio', root, ['studio']));
        studioStage.on('background', closePanel);
        cycleStudioLabel(host);
    });

    lazy($('#herbal-stage'), async () => {
        const host = $('#herbal-stage');
        herbalStage = await S.herbalScene(host, { label: herbLabel(HERB[herbState.id]) });
        window.__stages.herbal = herbalStage;
        host.classList.add('is-ready');
        herbalStage.on('select', () => $('[data-herb-enquire]').click());
    });

    lazy($('#globe-stage'), async () => {
        const host = $('#globe-stage');
        window.__stages.globe = await S.reachScene(host);
        host.classList.add('is-ready');
    });

    lazy($('#cards-stage'), async () => {
        const host = $('#cards-stage');
        const sheets = SHEETS();
        const st = await S.cardsScene(host, { cards: sheets });
        window.__stages.cards = st;
        host.classList.add('is-ready');
        st.on('select', id => { const c = sheets.find(x => x.id === id); if (c) downloadFile(c.file, id); });
        const labels = $$('[data-card]');
        st.on('hover', id => labels.forEach(l => l.classList.toggle('is-hot', l.dataset.card === id)));
        labels.forEach(l => {
            l.addEventListener('pointerenter', () => st.setHover(l.dataset.card));
            l.addEventListener('pointerleave', () => st.setHover(null));
        });
        if (!reduced) {
            ScrollTrigger.create({ trigger: '#downloads', start: 'top 80%', end: 'top 25%', scrub: 0.8, onUpdate: s => st.fan(s.progress) });
            ScrollTrigger.refresh();
        }
    });
}

/* ───────────── Init ───────────── */
function init() {
    $$('[data-wa-number]').forEach(el => { el.textContent = WA_DISPLAY; });
    $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
    renderRange();
    initHerbal();
    initDeskStatus();
    initList();
    initActions();
    initDragHints();
    initFaq();
    initMotion();
    $('.nav__burger')?.addEventListener('click', () => document.body.classList.toggle('nav-open'));
    $$('.nav__links a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('nav-open')));
    const start = () => boot3D().catch(err => { console.warn('3D disabled:', err); document.documentElement.classList.add('no-webgl'); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
    window.addEventListener('load', () => ScrollTrigger.refresh());
}

init();
