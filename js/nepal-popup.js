/**
 * Nepal Lab & Medical Show 2026 — Popup Banner
 * Auto-shows after 5 seconds. Remembers "Don't show again" via localStorage.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'nepal_popup_dismissed';

    // Bail out if the user previously clicked "Don't show again"
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;

    /* ── Inject CSS ─────────────────────────────────────────── */
    var style = document.createElement('style');
    style.textContent = '\
/* Nepal Popup Overlay */\
.nepal-popup-overlay {\
    position: fixed;\
    inset: 0;\
    z-index: 99999;\
    background: rgba(0, 0, 0, 0.65);\
    backdrop-filter: blur(6px);\
    -webkit-backdrop-filter: blur(6px);\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    opacity: 0;\
    visibility: hidden;\
    transition: opacity .4s ease, visibility .4s ease;\
    padding: 1rem;\
}\
.nepal-popup-overlay.active {\
    opacity: 1;\
    visibility: visible;\
}\
/* Popup Container */\
.nepal-popup-box {\
    position: relative;\
    max-width: 1050px;\
    width: 100%;\
    border-radius: 18px;\
    overflow: hidden;\
    box-shadow: 0 30px 80px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.08);\
    transform: scale(.88) translateY(30px);\
    transition: transform .45s cubic-bezier(.4,0,.2,1), opacity .45s ease;\
    opacity: 0;\
    background: #fff;\
}\
.nepal-popup-overlay.active .nepal-popup-box {\
    transform: scale(1) translateY(0);\
    opacity: 1;\
}\
/* Banner Image */\
.nepal-popup-box img {\
    display: block;\
    width: 100%;\
    height: auto;\
}\
/* Close (X) Button */\
.nepal-popup-close {\
    position: absolute;\
    top: 12px;\
    right: 12px;\
    width: 36px;\
    height: 36px;\
    border-radius: 50%;\
    border: none;\
    background: rgba(0,0,0,.55);\
    color: #fff;\
    font-size: 18px;\
    cursor: pointer;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    transition: background .25s ease, transform .25s ease;\
    z-index: 2;\
    line-height: 1;\
    backdrop-filter: blur(4px);\
}\
.nepal-popup-close:hover {\
    background: rgba(0,0,0,.8);\
    transform: scale(1.1);\
}\
/* Bottom Action Bar */\
.nepal-popup-actions {\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    padding: 14px 20px;\
    background: #f5f5f5;\
    border-top: 1px solid rgba(0,0,0,.06);\
}\
.nepal-popup-dismiss {\
    background: none;\
    border: none;\
    font-family: "Inter", "Helvetica Neue", Arial, sans-serif;\
    font-size: .82rem;\
    color: #666;\
    cursor: pointer;\
    padding: 6px 18px;\
    border-radius: 50px;\
    transition: background .2s ease, color .2s ease;\
    letter-spacing: .02em;\
}\
.nepal-popup-dismiss:hover {\
    background: rgba(0,98,65,.08);\
    color: #006241;\
}\
/* Mobile adjustments */\
@media (max-width: 600px) {\
    .nepal-popup-box {\
        max-width: 95vw;\
        border-radius: 14px;\
    }\
    .nepal-popup-close {\
        width: 32px;\
        height: 32px;\
        font-size: 15px;\
        top: 8px;\
        right: 8px;\
    }\
    .nepal-popup-actions {\
        padding: 12px 14px;\
    }\
    .nepal-popup-dismiss {\
        font-size: .78rem;\
    }\
}\
';
    document.head.appendChild(style);

    /* ── Inject HTML ─────────────────────────────────────────── */
    var overlay = document.createElement('div');
    overlay.className = 'nepal-popup-overlay';
    overlay.id = 'nepalPopupOverlay';
    overlay.innerHTML = '\
<div class="nepal-popup-box" role="dialog" aria-modal="true" aria-label="Nepal Lab and Medical Show 2026 Banner">\
    <button class="nepal-popup-close" id="nepalPopupClose" aria-label="Close popup">&times;</button>\
    <img src="images/nepalbanner.jpeg" alt="Nepal Lab & Medical Show 2026 – Stand A-98, 30 Apr – 2 May 2026, Bhrikuti Mandap, Kathmandu" loading="eager">\
    <div class="nepal-popup-actions">\
        <button class="nepal-popup-dismiss" id="nepalPopupDismiss">Don\'t show again</button>\
    </div>\
</div>';
    document.body.appendChild(overlay);

    /* ── Logic ───────────────────────────────────────────────── */
    function openPopup() {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function dismissForever() {
        localStorage.setItem(STORAGE_KEY, 'true');
        closePopup();
    }

    // Show after 5 seconds
    setTimeout(openPopup, 2000);

    // Close button
    document.getElementById('nepalPopupClose').addEventListener('click', closePopup);

    // "Don't show again" button
    document.getElementById('nepalPopupDismiss').addEventListener('click', dismissForever);

    // Close on overlay click (outside the box)
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closePopup();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closePopup();
    });
})();
