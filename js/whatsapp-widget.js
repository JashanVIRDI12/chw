/**
 * CHW WhatsApp Widget — floating button + greeting card
 */
(function () {
    'use strict';

    var PHONE = '919560365222'; // +91 95603 65222
    var WA_URL = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Hello, I need some help.');

    if (document.getElementById('chwWaWidget')) return;

    var mobileOpen = false;

    function isMobileView() {
        return window.matchMedia('(hover: none), (max-width: 600px)').matches;
    }

    var style = document.createElement('style');
    style.textContent = '\
.chw-wa-widget {\
    position: fixed;\
    right: max(16px, env(safe-area-inset-right));\
    bottom: max(16px, env(safe-area-inset-bottom));\
    z-index: 99990;\
    font-family: Inter, "Helvetica Neue", Arial, sans-serif;\
}\
@media (hover: hover) and (pointer: fine) {\
    .chw-wa-widget::before {\
        content: "";\
        position: absolute;\
        right: 0;\
        bottom: 68px;\
        width: 310px;\
        height: 20px;\
    }\
    .chw-wa-widget:hover .chw-wa-bubble {\
        opacity: 1;\
        visibility: visible;\
        transform: translateY(0) scale(1);\
        pointer-events: auto;\
    }\
}\
.chw-wa-bubble {\
    position: absolute;\
    right: 0;\
    bottom: calc(100% + 16px);\
    width: min(310px, calc(100vw - 32px));\
    border-radius: 16px;\
    background: linear-gradient(165deg, #ffffff 0%, #f7fdf9 100%);\
    box-shadow: 0 10px 40px rgba(0,98,65,.14), 0 2px 12px rgba(0,0,0,.08);\
    opacity: 0;\
    visibility: hidden;\
    transform: translateY(12px) scale(.96);\
    transition: opacity .4s ease, transform .4s cubic-bezier(.34,1.2,.64,1), visibility .4s;\
    pointer-events: none;\
    overflow: hidden;\
}\
.chw-wa-bubble::before {\
    content: "";\
    position: absolute;\
    top: 0; left: 0; right: 0;\
    height: 3px;\
    background: linear-gradient(90deg, #25D366, #006241, #34eb7a, #25D366);\
    background-size: 200% 100%;\
    animation: chwWaBarShimmer 4s linear infinite;\
}\
.chw-wa-bubble.show {\
    opacity: 1;\
    visibility: visible;\
    transform: translateY(0) scale(1);\
    pointer-events: auto;\
}\
.chw-wa-bubble-tail {\
    position: absolute;\
    right: 24px;\
    bottom: -8px;\
    width: 16px;\
    height: 16px;\
    background: #f7fdf9;\
    transform: rotate(45deg);\
    box-shadow: 3px 3px 6px rgba(0,0,0,.04);\
}\
.chw-wa-bubble-inner {\
    position: relative;\
    z-index: 1;\
    padding: 18px 18px 16px;\
}\
.chw-wa-bubble-close {\
    position: absolute;\
    top: 12px;\
    right: 12px;\
    width: 24px;\
    height: 24px;\
    border: none;\
    border-radius: 50%;\
    background: rgba(0,98,65,.08);\
    color: #006241;\
    font-size: 16px;\
    line-height: 1;\
    cursor: pointer;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    z-index: 2;\
    transition: background .2s ease;\
}\
.chw-wa-bubble-close:hover { background: rgba(0,98,65,.15); }\
.chw-wa-bubble-header {\
    display: flex;\
    align-items: center;\
    gap: 12px;\
    margin-bottom: 14px;\
    padding-right: 20px;\
}\
.chw-wa-bubble-avatar {\
    width: 44px;\
    height: 44px;\
    border-radius: 50%;\
    background: linear-gradient(145deg, #34eb7a, #128C7E);\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    color: #fff;\
    font-size: 22px;\
    flex-shrink: 0;\
    box-shadow: 0 4px 12px rgba(37,211,102,.35);\
}\
.chw-wa-bubble-meta h4 {\
    margin: 0 0 4px;\
    font-size: .95rem;\
    font-weight: 700;\
    color: #1a1a1a;\
    letter-spacing: -.01em;\
}\
.chw-wa-bubble-status {\
    display: inline-flex;\
    align-items: center;\
    gap: 6px;\
    font-size: .75rem;\
    font-weight: 500;\
    color: #006241;\
}\
.chw-wa-bubble-status::before {\
    content: "";\
    width: 7px;\
    height: 7px;\
    border-radius: 50%;\
    background: #22c55e;\
    box-shadow: 0 0 0 3px rgba(34,197,94,.25);\
}\
.chw-wa-bubble-msg {\
    margin: 0 0 16px;\
    padding: 12px 14px;\
    border-radius: 12px;\
    background: rgba(0,98,65,.06);\
    border: 1px solid rgba(0,98,65,.08);\
    font-size: .9rem;\
    line-height: 1.55;\
    color: #333;\
}\
.chw-wa-bubble-msg strong {\
    display: block;\
    margin-bottom: 4px;\
    font-size: .95rem;\
    color: #006241;\
}\
.chw-wa-bubble-cta {\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    gap: 8px;\
    width: 100%;\
    padding: 11px 16px;\
    border-radius: 50px;\
    background: linear-gradient(135deg, #34eb7a 0%, #25D366 50%, #128C7E 100%);\
    color: #fff;\
    font-size: .88rem;\
    font-weight: 600;\
    text-decoration: none;\
    box-shadow: 0 4px 16px rgba(37,211,102,.35);\
    transition: transform .2s ease, box-shadow .2s ease;\
}\
.chw-wa-bubble-cta:hover {\
    transform: translateY(-1px);\
    box-shadow: 0 6px 20px rgba(37,211,102,.45);\
}\
.chw-wa-bubble-cta i { font-size: 1.05rem; }\
.chw-wa-btn-wrap { position: relative; display: inline-block; }\
.chw-wa-btn {\
    position: relative;\
    width: 68px;\
    height: 68px;\
    border-radius: 50%;\
    background: linear-gradient(145deg, #34eb7a 0%, #25D366 45%, #128C7E 100%);\
    color: #fff;\
    font-size: 32px;\
    cursor: pointer;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    box-shadow: 0 6px 22px rgba(37,211,102,.4);\
    transition: transform .2s ease, box-shadow .2s ease;\
    text-decoration: none;\
    overflow: hidden;\
    -webkit-tap-highlight-color: transparent;\
    border: none;\
}\
.chw-wa-btn::after {\
    content: "";\
    position: absolute;\
    top: -50%;\
    left: -80%;\
    width: 55%;\
    height: 200%;\
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);\
    transform: skewX(-20deg);\
    animation: chwWaBtnShimmer 3s ease-in-out infinite;\
    pointer-events: none;\
}\
.chw-wa-btn i { position: relative; z-index: 1; }\
.chw-wa-btn:hover {\
    transform: scale(1.06);\
    box-shadow: 0 8px 28px rgba(37,211,102,.45);\
}\
.chw-wa-btn:active { transform: scale(.97); }\
@keyframes chwWaBarShimmer {\
    0% { background-position: 200% 0; }\
    100% { background-position: -200% 0; }\
}\
@keyframes chwWaBtnShimmer {\
    0% { left: -80%; }\
    50%, 100% { left: 130%; }\
}\
@media (max-width: 600px) {\
    .chw-wa-widget { right: 12px; bottom: 12px; }\
    .chw-wa-btn { width: 58px; height: 58px; font-size: 28px; }\
    .chw-wa-bubble { width: min(280px, calc(100vw - 24px)); }\
    .chw-wa-bubble-inner { padding: 16px 14px 14px; }\
    .chw-wa-bubble-msg { font-size: .85rem; }\
}\
@media (prefers-reduced-motion: reduce) {\
    .chw-wa-bubble, .chw-wa-btn { transition: none; }\
    .chw-wa-bubble::before, .chw-wa-btn::after { animation: none; }\
}\
';
    document.head.appendChild(style);

    var widget = document.createElement('div');
    widget.className = 'chw-wa-widget';
    widget.id = 'chwWaWidget';
    widget.innerHTML = '\
<div class="chw-wa-bubble" id="chwWaBubble" role="dialog" aria-label="WhatsApp chat invitation">\
    <span class="chw-wa-bubble-tail" aria-hidden="true"></span>\
    <button class="chw-wa-bubble-close" id="chwWaBubbleClose" aria-label="Close">&times;</button>\
    <div class="chw-wa-bubble-inner">\
        <div class="chw-wa-bubble-header">\
            <div class="chw-wa-bubble-avatar"><i class="fab fa-whatsapp"></i></div>\
            <div class="chw-wa-bubble-meta">\
                <h4>Chase Healthcare</h4>\
                <span class="chw-wa-bubble-status">Online now</span>\
            </div>\
        </div>\
        <p class="chw-wa-bubble-msg">\
            <strong>👋 Hi! Need any help?</strong>\
            Our team is ready to assist you with products, orders, and inquiries. Chat with us on WhatsApp - we typically reply within minutes.\
        </p>\
        <a href="' + WA_URL + '" class="chw-wa-bubble-cta" id="chwWaBubbleCta" target="_blank" rel="noopener noreferrer">\
            <i class="fab fa-whatsapp"></i> Start a Conversation\
        </a>\
    </div>\
</div>\
<div class="chw-wa-btn-wrap">\
    <button type="button" class="chw-wa-btn" id="chwWaBtn" aria-label="Chat on WhatsApp" aria-expanded="false" aria-controls="chwWaBubble">\
        <i class="fab fa-whatsapp" aria-hidden="true"></i>\
    </button>\
</div>';
    document.body.appendChild(widget);

    var bubble = document.getElementById('chwWaBubble');
    var closeBtn = document.getElementById('chwWaBubbleClose');
    var btn = document.getElementById('chwWaBtn');
    var cta = document.getElementById('chwWaBubbleCta');

    function showBubble() {
        bubble.classList.add('show');
        btn.setAttribute('aria-expanded', 'true');
        mobileOpen = true;
    }

    function hideBubble() {
        bubble.classList.remove('show');
        btn.setAttribute('aria-expanded', 'false');
        mobileOpen = false;
    }

    closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        hideBubble();
    });

    btn.addEventListener('click', function (e) {
        if (!isMobileView()) {
            window.open(WA_URL, '_blank', 'noopener,noreferrer');
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (mobileOpen) {
            hideBubble();
        } else {
            showBubble();
        }
    });

    cta.addEventListener('click', function () {
        hideBubble();
    });

    document.addEventListener('click', function (e) {
        if (!isMobileView() || !mobileOpen) return;
        if (!widget.contains(e.target)) hideBubble();
    });
})();
