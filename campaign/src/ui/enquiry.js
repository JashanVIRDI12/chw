// WhatsApp-only enquiries: an enquiry list (multi-product) plus a composer that
// turns everything into one detailed, pre-filled WhatsApp message.

export const WA_NUMBER = '919560369222';
export const WA_DISPLAY = '+91 95603 69222';
const LIST_KEY = 'chw-enquiry-list';
const PROFILE_KEY = 'chw-enquiry-profile';

const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } }
};

// Campaign attribution, captured once per visit
const params = new URLSearchParams(location.search);
const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']
    .filter(k => params.get(k)).map(k => `${k.replace('utm_', '')}=${params.get(k)}`).join(' · ');

let list = store.get(LIST_KEY, []);
const subs = new Set();
const emit = () => { store.set(LIST_KEY, list); subs.forEach(fn => fn(list)); };
export const onListChange = fn => { subs.add(fn); fn(list); };

const keyOf = it => it.type + ':' + it.id + ':' + (it.skus || []).join('|') + ':' + (it.brand || '') + (it.product || '');

export function addToList(item) {
    const k = keyOf(item);
    const existing = list.find(i => keyOf(i) === k);
    if (!existing) list = [...list, { ...item, qty: item.qty || '' }];
    emit();
    track('add_to_enquiry', { item: item.name });
    return !existing;
}
export function removeFromList(idx) { list = list.filter((_, i) => i !== idx); emit(); }
export function clearList() { list = []; emit(); }
export function getList() { return list; }

export function track(event, data = {}) {
    try {
        (window.dataLayer = window.dataLayer || []).push({ event, ...data });
        if (typeof window.gtag === 'function') window.gtag('event', event, data);
        if (typeof window.fbq === 'function' && event === 'whatsapp_enquiry') window.fbq('track', 'Contact');
    } catch { /* analytics optional */ }
}

function describe(it) {
    const lines = [];
    if (it.type === 'surgical') {
        lines.push(`${it.name} — Chase+`);
        if (it.skus && it.skus.length) it.skus.forEach(s => lines.push(`   • ${s}`));
        else lines.push('   • Sizes: please share full size list');
    } else if (it.type === 'nutra') {
        lines.push(`${it.name} — private label / bulk`);
        if (it.pack) lines.push(`   • Standard pack: ${it.pack}`);
    } else if (it.type === 'herbal') {
        lines.push(`${it.name} Capsules — Vitantra Ayurvedic`);
        if (it.botanical) lines.push(`   • Botanical: ${it.botanical}`);
    } else if (it.type === 'label') {
        lines.push(`Private label: ${it.product} (${it.format})`);
        lines.push(`   • Brand name: ${it.brand || '—'}`);
        lines.push('   • Label & packaging design: to be finalised as per our requirements');
    } else {
        lines.push(it.name);
    }
    if (it.qty) lines.push(`   • Quantity: ${it.qty}`);
    return lines;
}

export function buildMessage(items, p) {
    const out = [];
    out.push('Hello CHW team,');
    out.push(p.intent || 'I would like an export quotation for the following:');
    out.push('');
    if (items.length) {
        out.push(`*ENQUIRY (${items.length} item${items.length > 1 ? 's' : ''})*`);
        items.forEach((it, i) => describe(it).forEach((l, j) => out.push(j === 0 ? `${i + 1}. ${l}` : l)));
        out.push('');
    }
    const about = [
        ['Name', p.name], ['Company', p.company], ['Business type', p.buyer], ['Country', p.country],
        ['Timeline', p.timeline], ['Need', (p.needs || []).join(', ')]
    ].filter(([, v]) => v);
    if (about.length) {
        out.push('*ABOUT US*');
        about.forEach(([k, v]) => out.push(`${k}: ${v}`));
        out.push('');
    }
    if (p.notes) { out.push('*NOTES*'); out.push(p.notes); out.push(''); }
    out.push(`— Sent from ${location.host || 'chw.co.in'}${location.pathname}${utm ? ' · ' + utm : ''}`);
    return out.join('\n');
}

export function waLink(text) {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const isDesktop = () => matchMedia('(hover: hover) and (pointer: fine)').matches && innerWidth > 860;

export function openWhatsApp(text, meta = {}) {
    track('whatsapp_enquiry', meta);
    launch(waLink(text));
}

function launch(href) {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
}

/* ───────────── Composer dialog ───────────── */
const BUYERS = ['Importer', 'Distributor', 'Wholesaler', 'Hospital / Clinic', 'Pharmacy chain', 'Brand owner (private label)'];
const TIMELINES = ['Immediately', 'Within 1–3 months', 'Exploring options'];
const NEEDS = ['Export price list', 'Samples', 'MOQ details', 'Private label artwork', 'Export documents'];

let composer, currentItems = [], fromList = false, lastFocus;

function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function chipGroup(name, options, selected, multi = false) {
    return `<div class="chips" role="group">${options.map(o => `<label class="chip"><input type="${multi ? 'checkbox' : 'radio'}" name="${name}" value="${esc(o)}" ${(multi ? (selected || []).includes(o) : selected === o) ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div>`;
}

function buildComposer() {
    composer = document.createElement('div');
    composer.className = 'composer';
    composer.setAttribute('role', 'dialog');
    composer.setAttribute('aria-modal', 'true');
    composer.setAttribute('aria-labelledby', 'composer-title');
    composer.hidden = true;
    composer.innerHTML = `
      <div class="composer__scrim" data-close></div>
      <div class="composer__sheet glass">
        <header class="composer__head">
          <div>
            <span class="eyebrow eyebrow--wa"><i class="ic ic-wa"></i> WhatsApp enquiry</span>
            <h3 id="composer-title">Tell us what you need</h3>
            <p>Takes 30 seconds — every field is optional. It all goes to our export desk as one WhatsApp message.</p>
          </div>
          <button class="icon-btn" data-close aria-label="Close"><i class="ic ic-x"></i></button>
        </header>
        <form class="composer__form" novalidate>
          <div class="composer__items" data-items></div>
          <fieldset><legend>I am a</legend><div data-buyer></div></fieldset>
          <div class="field-row">
            <label class="field"><span>Your name</span><input name="name" autocomplete="name" placeholder="e.g. Amara Okafor"></label>
            <label class="field"><span>Company</span><input name="company" autocomplete="organization" placeholder="Company name"></label>
          </div>
          <div class="field-row">
            <label class="field"><span>Country</span><input name="country" autocomplete="country-name" placeholder="Destination country"></label>
            <label class="field"><span>Timeline</span><select name="timeline"><option value="">Select</option>${TIMELINES.map(t => `<option>${t}</option>`).join('')}</select></label>
          </div>
          <fieldset><legend>Please also send</legend><div data-needs></div></fieldset>
          <label class="field"><span>Anything else? <em>(optional)</em></span><textarea name="notes" rows="2" placeholder="Packaging, registration needs, target price…"></textarea></label>
          <details class="composer__preview"><summary>Preview your WhatsApp message</summary><pre data-preview></pre></details>
          <button class="btn btn--wa btn--xl" type="submit"><i class="ic ic-wa"></i> Send enquiry on WhatsApp</button>
          <p class="composer__fine">Opens WhatsApp with your message ready — nothing is sent until you tap send. ${WA_DISPLAY}</p>
        </form>
        <div class="composer__done" data-done hidden>
          <div class="done__mark"><i class="ic ic-check"></i></div>
          <h3 class="done__title" tabindex="-1" data-done-title>Your message is ready</h3>
          <p class="done__lead" data-done-lead></p>
          <div class="done__qr" data-done-qr hidden>
            <div class="done__code" data-qr></div>
            <div class="done__qrtext"><b>Continue on your phone</b><span>Point your phone camera at the code — WhatsApp opens with your enquiry filled in.</span></div>
          </div>
          <div class="done__actions">
            <button class="btn btn--wa btn--lg" data-done-open><i class="ic ic-wa"></i> <span data-done-open-label>Open WhatsApp again</span></button>
            <button class="btn btn--line" data-done-copy><i class="ic ic-copy"></i> Copy message</button>
          </div>
          <p class="done__fine">Or message us directly: <b>${WA_DISPLAY}</b> · <button class="link" data-done-edit>Edit enquiry</button></p>
        </div>
      </div>`;
    document.body.appendChild(composer);
    composer.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeComposer(); });
    composer.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeComposer();
        if (e.key === 'Tab') trapTab(e, composer.querySelector('.composer__sheet'));
    });
    const form = composer.querySelector('form');
    form.addEventListener('input', e => {
        const q = e.target.closest('[data-qty]');
        if (q) currentItems[+q.dataset.qty].qty = q.value;
        refreshPreview();
    });
    form.addEventListener('change', refreshPreview);
    form.addEventListener('click', e => {
        const rm = e.target.closest('[data-remove]');
        if (rm) {
            e.preventDefault();
            const i = +rm.dataset.remove;
            currentItems.splice(i, 1);
            if (fromList) removeFromList(i);
            renderItems(); refreshPreview();
        }
    });
    form.addEventListener('submit', e => {
        e.preventDefault();
        const p = readProfile();
        store.set(PROFILE_KEY, { name: p.name, company: p.company, country: p.country, buyer: p.buyer });
        if (fromList) { list = currentItems.map(i => ({ ...i })); emit(); }
        const text = buildMessage(currentItems, p);
        const meta = { items: currentItems.length, buyer: p.buyer || '' };
        if (isDesktop()) { track('whatsapp_enquiry', { ...meta, via: 'desktop' }); showDone(text, true); }
        else { openWhatsApp(text, meta); showDone(text, false); }
    });
    const done = composer.querySelector('[data-done]');
    done.addEventListener('click', e => {
        if (e.target.closest('[data-done-open]')) { track('whatsapp_open', { via: isDesktop() ? 'desktop' : 'mobile' }); launch(waLink(done.dataset.text)); }
        if (e.target.closest('[data-done-copy]')) {
            const b = e.target.closest('[data-done-copy]');
            const ok = () => { b.classList.add('is-done'); b.lastChild.textContent = ' Copied'; setTimeout(() => { b.classList.remove('is-done'); b.lastChild.textContent = ' Copy message'; }, 1800); };
            (navigator.clipboard ? navigator.clipboard.writeText(done.dataset.text) : Promise.reject()).then(ok).catch(() => {
                const t = document.createElement('textarea'); t.value = done.dataset.text; document.body.appendChild(t); t.select();
                try { document.execCommand('copy'); ok(); } catch { /* ignore */ } t.remove();
            });
            track('whatsapp_copy');
        }
        if (e.target.closest('[data-done-edit]')) setDone(false);
    });
}

function setDone(on) {
    composer.querySelector('form').hidden = on;
    composer.querySelector('[data-done]').hidden = !on;
    composer.querySelector('.composer__head').hidden = on;
    composer.querySelector('.composer__sheet').scrollTop = 0;
}

async function showDone(text, desktop) {
    const done = composer.querySelector('[data-done]');
    done.dataset.text = text;
    setDone(true);
    composer.querySelector('[data-done-lead]').textContent = desktop
        ? 'Send it from your phone or from WhatsApp on this computer — nothing is sent until you tap send.'
        : 'WhatsApp should have opened with your enquiry filled in. Just tap send — a person on our export desk replies.';
    composer.querySelector('[data-done-open-label]').textContent = desktop ? 'Open WhatsApp on this computer' : 'Open WhatsApp again';
    const qrBox = composer.querySelector('[data-done-qr]');
    qrBox.hidden = !desktop;
    composer.querySelector('[data-done-title]').focus({ preventScroll: true });
    if (!desktop) return;
    try {
        const { default: qrcode } = await import('qrcode-generator');
        // long enquiries make a dense code; fall back to a short message that still names the products
        let url = waLink(text);
        if (url.length > 800) {
            const names = currentItems.map(i => i.name || i.product).filter(Boolean).slice(0, 6).join(', ');
            url = waLink(`Hello CHW team, I would like an export quotation${names ? ' for: ' + names : ''}. (Full details sent from your website.)`);
        }
        const qr = qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        composer.querySelector('[data-qr]').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
        track('whatsapp_qr_shown');
    } catch (err) { qrBox.hidden = true; }
}

function readProfile() {
    const f = composer.querySelector('form');
    const fd = new FormData(f);
    return {
        name: (fd.get('name') || '').trim(), company: (fd.get('company') || '').trim(), country: (fd.get('country') || '').trim(),
        buyer: fd.get('buyer') || '', timeline: fd.get('timeline') || '', needs: fd.getAll('needs'), notes: (fd.get('notes') || '').trim(),
        intent: composer.dataset.intent || ''
    };
}

function renderItems() {
    const box = composer.querySelector('[data-items]');
    if (!currentItems.length) {
        box.innerHTML = `<div class="composer__empty">General enquiry — tell us the products in the notes, or add items from the page.</div>`;
        return;
    }
    box.innerHTML = currentItems.map((it, i) => `
      <div class="ci">
        ${it.photo ? `<img src="${esc(it.photo)}" alt="" width="56" height="56">` : `<span class="ci__ph"><i class="ic ic-${it.type === 'surgical' ? 'cross' : 'capsule'}"></i></span>`}
        <div class="ci__body">
          <strong>${esc(it.type === 'label' ? `${it.product} · ${it.brand || 'Your Brand'}` : it.name)}</strong>
          <small>${esc(it.type === 'surgical' ? ((it.skus || []).join(' / ') || 'All sizes') : it.type === 'label' ? `${it.format} · design as per your requirements` : it.type === 'herbal' ? `Vitantra · ${it.botanical || 'capsules'}` : (it.pack || ''))}</small>
        </div>
        <input class="ci__qty" data-qty="${i}" value="${esc(it.qty || '')}" placeholder="Qty" aria-label="Quantity for ${esc(it.name || it.product)}">
        <button class="icon-btn icon-btn--sm" data-remove="${i}" aria-label="Remove"><i class="ic ic-x"></i></button>
      </div>`).join('');
}

function refreshPreview() {
    composer.querySelector('[data-preview]').textContent = buildMessage(currentItems, readProfile());
}

function trapTab(e, root) {
    const f = [...root.querySelectorAll('button, [href], input, select, textarea, summary')].filter(el => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

export function openComposer(items = null, { intent = '', needs = [] } = {}) {
    if (!composer) buildComposer();
    fromList = items === null;
    currentItems = (items === null ? list : items).map(i => ({ ...i }));
    composer.dataset.intent = intent;
    const prof = store.get(PROFILE_KEY, {});
    const f = composer.querySelector('form');
    composer.querySelector('[data-buyer]').innerHTML = chipGroup('buyer', BUYERS, prof.buyer || '');
    composer.querySelector('[data-needs]').innerHTML = chipGroup('needs', NEEDS, needs.length ? needs : ['Export price list'], true);
    ['name', 'company', 'country'].forEach(k => { f.elements[k].value = prof[k] || ''; });
    renderItems(); refreshPreview();
    setDone(false);
    lastFocus = document.activeElement;
    composer.hidden = false;
    document.documentElement.classList.add('has-dialog');
    requestAnimationFrame(() => composer.classList.add('is-open'));
    setTimeout(() => (composer.querySelector('.ci__qty') || f.elements.name).focus({ preventScroll: true }), 350);
    track('enquiry_open', { items: currentItems.length });
}

export function closeComposer() {
    if (!composer || composer.hidden) return;
    composer.classList.remove('is-open');
    setTimeout(() => {
        composer.hidden = true;
        if (!document.querySelector('.pp.is-open')) document.documentElement.classList.remove('has-dialog');
    }, 350);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
}

export { esc, trapTab };
