/**
 * PHARMEDI VIETNAM 2026 — homepage exhibition popup.
 * Shows once per session and supports a permanent dismissal.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'pharmedi_vietnam_2026_popup_dismissed';
    var SESSION_KEY = 'pharmedi_vietnam_2026_popup_shown';

    try {
        if (localStorage.getItem(STORAGE_KEY) === 'true') return;
        if (sessionStorage.getItem(SESSION_KEY) === 'true') return;
    } catch (error) {
        // Storage can be unavailable in private browsing; the popup can still work.
    }

    var style = document.createElement('style');
    style.textContent = `
.vn-popup-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgba(1, 24, 17, 0.78);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    opacity: 0;
    visibility: hidden;
    transition: opacity .38s ease, visibility .38s ease;
}
.vn-popup-overlay.is-open { opacity: 1; visibility: visible; }
.vn-popup {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
    width: min(960px, 96vw);
    height: min(720px, 88vh);
    overflow: hidden;
    border: 1px solid rgba(232, 201, 142, .35);
    border-radius: 26px;
    background: #fff;
    box-shadow: 0 40px 120px rgba(0, 0, 0, .5), 0 0 0 1px rgba(255, 255, 255, .08);
    opacity: 0;
    transform: translateY(24px) scale(.96);
    transition: opacity .42s ease, transform .5s cubic-bezier(.2, .7, .2, 1);
}
.vn-popup-overlay.is-open .vn-popup { opacity: 1; transform: none; }
.vn-popup__poster {
    position: relative;
    display: grid;
    place-items: center;
    min-width: 0;
    min-height: 0;
    margin: 0;
    overflow: hidden;
    background: #f8f6ef;
}
.vn-popup__poster::before {
    content: '';
    position: absolute;
    inset: -8%;
    background: url("images/WhatsApp Image 2026-09-14 at 2.27.18 PM.jpeg") center / cover no-repeat;
    filter: blur(24px) saturate(.72) brightness(.76);
    opacity: .38;
}
.vn-popup__poster img {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.vn-popup__content {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(2rem, 4.5vw, 3.8rem);
    overflow: hidden;
    background:
        radial-gradient(circle at 0 0, rgba(0, 98, 65, .68), transparent 62%),
        #011f16;
    color: #fff;
}
.vn-popup__content::after {
    content: 'VIETNAM';
    position: absolute;
    z-index: -1;
    right: -.2rem;
    bottom: -.75rem;
    color: rgba(255, 255, 255, .028);
    font: 800 clamp(4rem, 8vw, 7rem)/1 Inter, sans-serif;
    letter-spacing: -.08em;
}
.vn-popup__eyebrow {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: .55rem;
    margin-bottom: 1rem;
    padding: .48rem .72rem;
    border: 1px solid rgba(232, 201, 142, .28);
    border-radius: 999px;
    background: rgba(255, 255, 255, .055);
    color: #ecd29d;
    font: 700 .64rem/1 Inter, sans-serif;
    letter-spacing: .14em;
    text-transform: uppercase;
}
.vn-popup__eyebrow svg { width: 25px; height: 17px; border-radius: 2px; }
.vn-popup__content h2 {
    margin: 0 0 .9rem;
    color: #fff;
    font: 500 clamp(2.45rem, 5vw, 3.8rem)/.98 'Cormorant Garamond', Georgia, serif;
    letter-spacing: -.035em;
}
.vn-popup__content h2 em { color: #e8c98e; font-weight: 400; }
.vn-popup__intro { margin: 0 0 1.35rem; color: rgba(255, 255, 255, .68); font: 400 .91rem/1.7 Inter, sans-serif; }
.vn-popup__details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .6rem;
    margin: 0 0 1.5rem;
}
.vn-popup__detail {
    padding: .78rem .82rem;
    border: 1px solid rgba(255, 255, 255, .09);
    border-radius: 12px;
    background: rgba(255, 255, 255, .045);
}
.vn-popup__detail small { display: block; margin-bottom: .2rem; color: rgba(255, 255, 255, .42); font: 700 .55rem/1.2 Inter, sans-serif; letter-spacing: .12em; text-transform: uppercase; }
.vn-popup__detail strong { display: block; color: #fff; font: 600 .78rem/1.35 Inter, sans-serif; }
.vn-popup__actions { display: flex; flex-wrap: wrap; gap: .65rem; }
.vn-popup__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 46px;
    padding: .78rem 1.2rem;
    border: 1px solid rgba(255, 255, 255, .25);
    border-radius: 999px;
    color: #fff;
    text-decoration: none;
    font: 700 .79rem/1 Inter, sans-serif;
    transition: transform .2s ease, background .2s ease;
}
.vn-popup__button:hover { transform: translateY(-2px); background: rgba(255, 255, 255, .08); color: #fff; }
.vn-popup__button--primary { border-color: transparent; background: linear-gradient(135deg, #c8a96e, #ecd29d); color: #172019; }
.vn-popup__button--primary:hover { background: linear-gradient(135deg, #d3b579, #f2dba9); color: #172019; }
.vn-popup__close {
    position: absolute;
    z-index: 5;
    top: 12px;
    right: 12px;
    display: grid;
    width: 38px;
    height: 38px;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, .2);
    border-radius: 50%;
    background: rgba(1, 31, 22, .72);
    color: #fff;
    font: 400 1.25rem/1 Arial, sans-serif;
    cursor: pointer;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: transform .2s ease, background .2s ease;
}
.vn-popup__close:hover { transform: rotate(5deg) scale(1.08); background: #006241; }
.vn-popup__dismiss {
    align-self: flex-start;
    margin-top: 1rem;
    padding: .25rem 0;
    border: 0;
    background: transparent;
    color: rgba(255, 255, 255, .45);
    font: 500 .7rem/1.4 Inter, sans-serif;
    cursor: pointer;
}
.vn-popup__dismiss:hover { color: rgba(255, 255, 255, .8); }
.vn-popup__close:focus-visible,
.vn-popup__button:focus-visible,
.vn-popup__dismiss:focus-visible { outline: 3px solid #ecd29d; outline-offset: 3px; }
/* Phones and small tablets get a full-bleed sheet. The overlay does the
   scrolling so the card is never taller than the visible viewport, and the
   close button is pinned so it stays reachable while scrolling. */
@media (max-width: 860px) {
    .vn-popup-overlay {
        display: block;
        padding: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        background: rgba(1, 24, 17, .86);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
    }
    .vn-popup {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        width: 100%;
        height: auto;
        min-height: 100vh;
        min-height: 100dvh;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        transform: translateY(18px);
    }
    .vn-popup__close {
        position: fixed;
        top: calc(env(safe-area-inset-top, 0px) + 10px);
        right: calc(env(safe-area-inset-right, 0px) + 10px);
        width: 44px;
        height: 44px;
        font-size: 1.4rem;
    }
    .vn-popup__poster {
        aspect-ratio: 4 / 5;
        max-height: 44vh;
        max-height: 44dvh;
        padding-top: env(safe-area-inset-top, 0px);
    }
    .vn-popup__content {
        padding: 1.6rem 1.25rem calc(env(safe-area-inset-bottom, 0px) + 1.6rem);
    }
    .vn-popup__content h2 { font-size: clamp(2rem, 8.5vw, 2.6rem); }
    .vn-popup__intro { display: none; }
    .vn-popup__details { margin-bottom: 1.25rem; }
    .vn-popup__actions .vn-popup__button { flex: 1 1 100%; min-height: 50px; }
    .vn-popup__dismiss {
        align-self: center;
        min-height: 44px;
        padding: .6rem 1rem;
        font-size: .76rem;
    }
}
@media (max-width: 390px) {
    .vn-popup__poster { max-height: 36vh; max-height: 36dvh; }
    .vn-popup__details { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
    .vn-popup-overlay,
    .vn-popup { transition: none; }
}
`;
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.className = 'vn-popup-overlay';
    overlay.id = 'vietnamExhibitionPopup';
    overlay.innerHTML = `
<section class="vn-popup" role="dialog" aria-modal="true" aria-labelledby="vnPopupTitle" aria-describedby="vnPopupDescription">
    <button class="vn-popup__close" type="button" aria-label="Close exhibition announcement">&times;</button>
    <figure class="vn-popup__poster">
        <img src="images/WhatsApp Image 2026-09-14 at 2.27.18 PM.jpeg" alt="PHARMEDI VIETNAM 2026 poster featuring the CHW team and Booth N-7" width="1080" height="1350">
    </figure>
    <div class="vn-popup__content">
        <span class="vn-popup__eyebrow">
            <svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#da251d"/><polygon fill="#ffff00" points="15,4 16.18,7.64 20,7.64 16.91,9.9 18.09,13.53 15,11.28 11.91,13.53 13.09,9.9 10,7.64 13.82,7.64"/></svg>
            Upcoming Exhibition
        </span>
        <h2 id="vnPopupTitle">Meet CHW at<br><em>Pharmedi Vietnam</em></h2>
        <p class="vn-popup__intro" id="vnPopupDescription">Meet our export team to review samples, discuss pricing and explore distribution opportunities across Southeast Asia.</p>
        <div class="vn-popup__details">
            <div class="vn-popup__detail"><small>Dates</small><strong>22–24 September 2026</strong></div>
            <div class="vn-popup__detail"><small>Booth</small><strong>N-7</strong></div>
            <div class="vn-popup__detail"><small>City</small><strong>Ho Chi Minh City</strong></div>
            <div class="vn-popup__detail"><small>Country</small><strong>Vietnam</strong></div>
        </div>
        <div class="vn-popup__actions">
            <a class="vn-popup__button vn-popup__button--primary" href="contact.html?type=meeting#enquiry">Book a Meeting</a>
            <a class="vn-popup__button" href="exhibitions.html#vietnam">View Event Details</a>
        </div>
        <button class="vn-popup__dismiss" type="button">Don’t show this again</button>
    </div>
</section>`;
    document.body.appendChild(overlay);

    var closeButton = overlay.querySelector('.vn-popup__close');
    var dismissButton = overlay.querySelector('.vn-popup__dismiss');
    var previousFocus = null;

    function save(storage, key) {
        try { storage.setItem(key, 'true'); } catch (error) { /* no-op */ }
    }

    function openPopup() {
        previousFocus = document.activeElement;
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        window.setTimeout(function () { closeButton.focus(); }, 50);
    }

    function closePopup() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        save(sessionStorage, SESSION_KEY);
        if (previousFocus && previousFocus.focus) previousFocus.focus();
    }

    function dismissPopup() {
        save(localStorage, STORAGE_KEY);
        closePopup();
    }

    window.setTimeout(openPopup, 1800);
    closeButton.addEventListener('click', closePopup);
    dismissButton.addEventListener('click', dismissPopup);
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) closePopup();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && overlay.classList.contains('is-open')) closePopup();
    });
})();
