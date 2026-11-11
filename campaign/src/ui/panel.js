// Glassmorphism product panel. Opens beside a 3D focus zoom (or on its own
// for 2D cards). Content is supplied as HTML by the caller.
import { gsap } from 'gsap';
import { trapTab } from './enquiry.js';

let el, ctx = null, lastFocus;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function build() {
    el = document.createElement('div');
    el.className = 'pp';
    el.hidden = true;
    el.innerHTML = `
      <div class="pp__scrim" data-pp-close></div>
      <aside class="pp__card glass glass--dark" role="dialog" aria-modal="true" aria-labelledby="pp-title">
        <div class="pp__sheen" aria-hidden="true"></div>
        <div class="pp__bar">
          <span class="pp__hint" data-pp-hint><i class="ic ic-drag"></i> Drag to rotate</span>
          <div class="pp__nav">
            <button class="icon-btn" data-pp-prev aria-label="Previous product"><i class="ic ic-left"></i></button>
            <button class="icon-btn" data-pp-next aria-label="Next product"><i class="ic ic-right"></i></button>
            <button class="icon-btn" data-pp-close aria-label="Close details"><i class="ic ic-x"></i></button>
          </div>
        </div>
        <div class="pp__body" data-pp-body></div>
      </aside>`;
    document.body.appendChild(el);
    el.addEventListener('click', e => {
        if (e.target.closest('[data-pp-close]')) closePanel();
        else if (e.target.closest('[data-pp-prev]') && ctx?.onPrev) ctx.onPrev();
        else if (e.target.closest('[data-pp-next]') && ctx?.onNext) ctx.onNext();
    });
    el.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePanel();
        if (e.key === 'Tab') trapTab(e, el.querySelector('.pp__card'));
        if (e.key === 'ArrowRight' && ctx?.onNext && !e.target.closest('input, textarea')) ctx.onNext();
        if (e.key === 'ArrowLeft' && ctx?.onPrev && !e.target.closest('input, textarea')) ctx.onPrev();
    });
}

export function isPanelOpen() { return !!(el && !el.hidden); }

export function openPanel(html, options = {}) {
    if (!el) build();
    const wasOpen = isPanelOpen();
    ctx = options;
    el.classList.toggle('pp--stage', !!options.stage);
    el.querySelector('[data-pp-hint]').hidden = !options.stage;
    el.querySelector('.pp__nav').classList.toggle('no-step', !options.onNext);
    const body = el.querySelector('[data-pp-body]');
    const swap = () => {
        body.innerHTML = html;
        body.scrollTop = 0;
        if (options.onRender) options.onRender(body);
        if (!reduced) gsap.from(body.children, { y: 24, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out', delay: wasOpen ? 0 : 0.55 });
    };
    if (!wasOpen) {
        lastFocus = document.activeElement;
        el.hidden = false;
        document.documentElement.classList.add('has-dialog');
        swap();
        requestAnimationFrame(() => el.classList.add('is-open'));
        setTimeout(() => el.querySelector('[data-pp-close]').focus({ preventScroll: true }), 500);
    } else if (reduced) swap();
    else gsap.to(body.children, { y: -12, opacity: 0, duration: 0.25, stagger: 0.02, ease: 'power2.in', onComplete: swap });
}

export function closePanel() {
    if (!isPanelOpen()) return;
    const c = ctx; ctx = null;
    el.classList.remove('is-open');
    if (c?.onClose) c.onClose();
    setTimeout(() => {
        if (el.classList.contains('is-open')) return;
        el.hidden = true;
        if (!document.querySelector('.composer.is-open')) document.documentElement.classList.remove('has-dialog');
    }, 600);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
}
