/**
 * CHW Homepage — Email contact popup (info@chw.co.in)
 */
(function () {
    'use strict';

    var EMAIL = 'info@chw.co.in';
    var STORAGE_KEY = 'chw_email_popup_dismissed';
    var SESSION_KEY = 'chw_email_popup_shown';
    var isHome = /(?:^|\/)index\.html?$/.test(window.location.pathname) ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/chw/') ||
        (window.location.pathname.endsWith('/') && !window.location.pathname.slice(0, -1).includes('/'));

    if (!isHome) return;
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;
    if (sessionStorage.getItem(SESSION_KEY) === 'true') return;
    if (document.getElementById('chwEmailPopup')) return;

    var style = document.createElement('style');
    style.textContent = '\
.chw-email-overlay {\
    position: fixed;\
    inset: 0;\
    z-index: 99998;\
    background: rgba(0, 25, 16, 0.6);\
    backdrop-filter: blur(10px);\
    -webkit-backdrop-filter: blur(10px);\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));\
    opacity: 0;\
    visibility: hidden;\
    transition: opacity .45s ease, visibility .45s ease;\
    overflow-y: auto;\
    -webkit-overflow-scrolling: touch;\
    overscroll-behavior: contain;\
}\
.chw-email-overlay.active { opacity: 1; visibility: visible; }\
.chw-email-box {\
    position: relative;\
    width: min(460px, 100%);\
    max-height: min(92dvh, 720px);\
    border-radius: clamp(16px, 4vw, 24px);\
    background: #fff;\
    box-shadow: 0 30px 70px rgba(0,0,0,.22), 0 0 0 1px rgba(0,98,65,.08);\
    overflow: hidden;\
    transform: scale(.9) translateY(30px);\
    opacity: 0;\
    transition: transform .5s cubic-bezier(.34,1.25,.64,1), opacity .5s ease;\
    display: flex;\
    flex-direction: column;\
    margin: auto;\
    flex-shrink: 0;\
}\
.chw-email-overlay.active .chw-email-box {\
    transform: scale(1) translateY(0);\
    opacity: 1;\
}\
.chw-email-hero {\
    position: relative;\
    flex-shrink: 0;\
    padding: clamp(1.25rem, 4vw, 1.75rem) clamp(1rem, 3vw, 1.5rem) clamp(2rem, 5vw, 2.5rem);\
    background: linear-gradient(145deg, #006241 0%, #008a5c 50%, #004d33 100%);\
    text-align: center;\
    overflow: hidden;\
}\
.chw-email-hero::before {\
    content: "";\
    position: absolute;\
    inset: 0;\
    background: url("images/mandala.webp") center / clamp(180px, 45vw, 280px) no-repeat;\
    opacity: .12;\
    pointer-events: none;\
}\
.chw-email-leaf {\
    position: absolute;\
    opacity: .35;\
    pointer-events: none;\
}\
.chw-email-leaf--tl { top: -8px; left: -8px; width: 70px; transform: rotate(-20deg); }\
.chw-email-leaf--tr { top: 10px; right: -5px; width: 55px; transform: rotate(25deg) scaleX(-1); }\
.chw-email-leaf--bl { bottom: 8px; left: 12px; width: 50px; transform: rotate(160deg); }\
.chw-email-close {\
    position: absolute;\
    top: max(10px, env(safe-area-inset-top));\
    right: max(10px, env(safe-area-inset-right));\
    width: clamp(34px, 9vw, 40px);\
    height: clamp(34px, 9vw, 40px);\
    min-width: 44px;\
    min-height: 44px;\
    border: none;\
    border-radius: 50%;\
    background: rgba(255,255,255,.2);\
    color: #fff;\
    font-size: clamp(18px, 4vw, 22px);\
    cursor: pointer;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    z-index: 5;\
    transition: background .2s ease, transform .2s ease;\
    backdrop-filter: blur(4px);\
    -webkit-tap-highlight-color: transparent;\
}\
.chw-email-close:hover { background: rgba(255,255,255,.35); transform: scale(1.08); }\
.chw-email-logo {\
    position: relative;\
    z-index: 1;\
    width: clamp(44px, 12vw, 52px);\
    height: clamp(44px, 12vw, 52px);\
    margin: 0 auto clamp(.65rem, 2vw, .85rem);\
    border-radius: 50%;\
    background: #fff;\
    padding: 6px;\
    box-shadow: 0 6px 20px rgba(0,0,0,.2);\
    object-fit: contain;\
}\
.chw-email-team {\
    position: relative;\
    z-index: 1;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    margin-bottom: .85rem;\
}\
.chw-email-avatar {\
    width: clamp(32px, 8vw, 38px);\
    height: clamp(32px, 8vw, 38px);\
    border-radius: 50%;\
    border: 2.5px solid rgba(255,255,255,.9);\
    background: linear-gradient(135deg, #c8a96e, #e8c98e);\
    color: #fff;\
    font-size: clamp(.62rem, 2.5vw, .72rem);\
    font-weight: 700;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    margin-left: -8px;\
    box-shadow: 0 3px 10px rgba(0,0,0,.15);\
    font-family: Inter, sans-serif;\
}\
.chw-email-avatar:first-child { margin-left: 0; background: linear-gradient(135deg, #7da87b, #006241); }\
.chw-email-avatar:nth-child(2) { background: linear-gradient(135deg, #008a5c, #004d33); }\
.chw-email-avatar:nth-child(3) { background: linear-gradient(135deg, #c8a96e, #8b7355); }\
.chw-email-hero h2 {\
    position: relative;\
    z-index: 1;\
    margin: 0;\
    padding: 0 clamp(.5rem, 2vw, 1rem);\
    font-family: "Cormorant Garamond", Georgia, serif;\
    font-size: clamp(1.35rem, 5vw, 1.85rem);\
    font-weight: 600;\
    color: #fff;\
    line-height: 1.2;\
}\
.chw-email-hero h2 em {\
    font-style: italic;\
    color: #e8c98e;\
}\
.chw-email-wave {\
    position: absolute;\
    bottom: -1px;\
    left: 0;\
    width: 100%;\
    height: clamp(20px, 4vw, 28px);\
    fill: #fff;\
}\
.chw-email-scroll {\
    flex: 1;\
    overflow-y: auto;\
    -webkit-overflow-scrolling: touch;\
    overscroll-behavior: contain;\
}\
.chw-email-body {\
    padding: clamp(1rem, 3vw, 1.25rem) clamp(1rem, 4vw, 1.75rem) clamp(1.15rem, 3vw, 1.5rem);\
    font-family: Inter, "Helvetica Neue", Arial, sans-serif;\
}\
.chw-email-note {\
    display: flex;\
    gap: .85rem;\
    align-items: flex-start;\
    margin-bottom: 1.25rem;\
    text-align: left;\
}\
.chw-email-note-icon {\
    flex-shrink: 0;\
    width: 42px;\
    height: 42px;\
    border-radius: 50% 50% 50% 6px;\
    background: linear-gradient(135deg, rgba(0,98,65,.1), rgba(0,98,65,.05));\
    border: 1px solid rgba(0,98,65,.12);\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    font-size: 1.1rem;\
}\
.chw-email-note-text {\
    flex: 1;\
    min-width: 0;\
    font-size: clamp(.82rem, 2.8vw, .9rem);\
    line-height: 1.65;\
    color: #444;\
}\
.chw-email-note-text strong {\
    display: block;\
    margin-bottom: .25rem;\
    font-size: clamp(.88rem, 3vw, .95rem);\
    color: #1a1a1a;\
}\
.chw-email-sign {\
    display: block;\
    margin-top: .65rem;\
    font-size: .82rem;\
    font-style: italic;\
    color: #006241;\
    font-weight: 500;\
}\
.chw-email-perks {\
    display: flex;\
    flex-wrap: wrap;\
    gap: clamp(.35rem, 1.5vw, .5rem);\
    margin-bottom: clamp(.85rem, 2.5vw, 1.15rem);\
    justify-content: flex-start;\
}\
.chw-email-perk {\
    display: inline-flex;\
    align-items: center;\
    gap: .35rem;\
    padding: .35rem clamp(.55rem, 2vw, .7rem);\
    border-radius: 50px;\
    background: #fffae9;\
    border: 1px solid rgba(200,169,110,.25);\
    font-size: clamp(.65rem, 2.2vw, .72rem);\
    font-weight: 500;\
    color: #5a4a30;\
    white-space: nowrap;\
}\
.chw-email-perk i { color: #006241; font-size: .7rem; }\
.chw-email-address {\
    display: flex;\
    align-items: center;\
    justify-content: flex-start;\
    gap: clamp(.5rem, 2vw, .65rem);\
    margin-bottom: clamp(.85rem, 2.5vw, 1.15rem);\
    padding: clamp(.75rem, 2.5vw, .9rem) clamp(.85rem, 3vw, 1rem);\
    border-radius: 14px;\
    background: linear-gradient(135deg, rgba(0,98,65,.07), rgba(0,98,65,.03));\
    border: 1.5px dashed rgba(0,98,65,.22);\
    font-size: clamp(.88rem, 3.2vw, 1.02rem);\
    font-weight: 600;\
    color: #006241;\
    word-break: break-word;\
    overflow-wrap: anywhere;\
}\
.chw-email-address span { flex: 1; min-width: 0; text-align: left; }\
.chw-email-address i {\
    width: 32px;\
    height: 32px;\
    border-radius: 8px;\
    background: #006241;\
    color: #fff;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    font-size: .85rem;\
    flex-shrink: 0;\
}\
.chw-email-actions {\
    display: flex;\
    flex-direction: column;\
    gap: clamp(.5rem, 2vw, .6rem);\
}\
.chw-email-btn {\
    display: inline-flex;\
    align-items: center;\
    justify-content: center;\
    gap: .5rem;\
    width: 100%;\
    min-height: 48px;\
    padding: clamp(.75rem, 2.5vw, .9rem) clamp(1rem, 3vw, 1.25rem);\
    border-radius: 50px;\
    font-size: clamp(.8rem, 2.8vw, .88rem);\
    font-weight: 600;\
    text-decoration: none;\
    cursor: pointer;\
    border: none;\
    transition: transform .2s ease, box-shadow .2s ease, background .2s ease;\
    font-family: inherit;\
    white-space: normal;\
    text-align: center;\
    line-height: 1.35;\
    -webkit-tap-highlight-color: transparent;\
    touch-action: manipulation;\
}\
.chw-email-btn .chw-email-btn-short { display: none; }\
.chw-email-btn-primary {\
    background: linear-gradient(135deg, #008a5c, #006241);\
    color: #fff;\
    box-shadow: 0 6px 22px rgba(0,98,65,.32);\
}\
.chw-email-btn-primary:hover {\
    transform: translateY(-2px);\
    box-shadow: 0 10px 28px rgba(0,98,65,.4);\
}\
.chw-email-btn-secondary {\
    background: #fff;\
    color: #006241;\
    border: 1.5px solid rgba(0,98,65,.22);\
}\
.chw-email-btn-secondary:hover { background: rgba(0,98,65,.05); }\
.chw-email-btn-secondary.copied {\
    background: rgba(0,98,65,.1);\
    border-color: #006241;\
}\
.chw-email-footer {\
    flex-shrink: 0;\
    padding: clamp(.6rem, 2vw, .75rem) clamp(1rem, 4vw, 1.75rem) clamp(.85rem, 2.5vw, 1.15rem);\
    text-align: center;\
    background: #fafafa;\
    border-top: 1px solid rgba(0,0,0,.05);\
}\
.chw-email-dismiss {\
    background: none;\
    border: none;\
    font-family: inherit;\
    font-size: clamp(.7rem, 2.5vw, .76rem);\
    color: #999;\
    cursor: pointer;\
    padding: .5rem .75rem;\
    min-height: 44px;\
    border-radius: 50px;\
    transition: color .2s ease;\
    line-height: 1.4;\
    -webkit-tap-highlight-color: transparent;\
}\
.chw-email-dismiss:hover { color: #006241; }\
\
/* Tablet & small laptop */\
@media (min-width: 600px) {\
    .chw-email-actions {\
        flex-direction: row;\
        flex-wrap: wrap;\
    }\
    .chw-email-btn-primary { flex: 1 1 55%; }\
    .chw-email-btn-secondary { flex: 1 1 40%; }\
    .chw-email-perks { justify-content: center; }\
}\
\
/* Large screens */\
@media (min-width: 1024px) {\
    .chw-email-box { max-width: 480px; }\
    .chw-email-overlay { padding: 24px; }\
}\
\
/* Small phones */\
@media (max-width: 380px) {\
    .chw-email-leaf { display: none; }\
    .chw-email-note { gap: .65rem; }\
    .chw-email-note-icon { width: 36px; height: 36px; font-size: .95rem; }\
    .chw-email-perk { white-space: normal; text-align: center; flex: 1 1 calc(50% - .35rem); justify-content: center; }\
    .chw-email-perk:last-child { flex: 1 1 100%; }\
    .chw-email-btn .chw-email-btn-full { display: none; }\
    .chw-email-btn .chw-email-btn-short { display: inline; }\
}\
\
/* Very small / old phones */\
@media (max-width: 320px) {\
    .chw-email-team { margin-bottom: .6rem; }\
    .chw-email-address { flex-direction: row; align-items: flex-start; }\
    .chw-email-dismiss { font-size: .68rem; }\
}\
\
/* Short viewports — landscape phones, small height */\
@media (max-height: 640px) {\
    .chw-email-box { max-height: 96dvh; }\
    .chw-email-hero { padding-top: 1rem; padding-bottom: 1.75rem; }\
    .chw-email-team { margin-bottom: .5rem; }\
    .chw-email-note { margin-bottom: .85rem; }\
    .chw-email-perks { margin-bottom: .75rem; }\
    .chw-email-logo { width: 40px; height: 40px; margin-bottom: .5rem; }\
    .chw-email-avatar { width: 30px; height: 30px; font-size: .58rem; }\
}\
\
@media (max-height: 520px) and (orientation: landscape) {\
    .chw-email-overlay { align-items: flex-start; padding-top: 8px; padding-bottom: 8px; }\
    .chw-email-hero { padding: .85rem 1rem 1.5rem; }\
    .chw-email-hero h2 { font-size: 1.2rem; }\
    .chw-email-team, .chw-email-leaf { display: none; }\
    .chw-email-logo { width: 36px; height: 36px; margin-bottom: .4rem; }\
    .chw-email-body { padding: .75rem 1rem 1rem; }\
    .chw-email-note-icon { width: 34px; height: 34px; }\
    .chw-email-footer { padding: .5rem 1rem; }\
    .chw-email-dismiss { min-height: 36px; padding: .25rem .5rem; }\
}\
\
/* Touch devices — no hover lift */\
@media (hover: none) {\
    .chw-email-btn-primary:hover,\
    .chw-email-btn-secondary:hover { transform: none; }\
    .chw-email-close:hover { transform: none; }\
}\
@media (prefers-reduced-motion: reduce) {\
    .chw-email-overlay, .chw-email-box { transition: none; }\
}\
';
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.className = 'chw-email-overlay';
    overlay.id = 'chwEmailPopup';
    overlay.innerHTML = '\
<div class="chw-email-box" role="dialog" aria-modal="true" aria-labelledby="chwEmailTitle">\
    <div class="chw-email-hero">\
        <button class="chw-email-close" id="chwEmailClose" aria-label="Close popup">&times;</button>\
        <svg class="chw-email-leaf chw-email-leaf--tl" viewBox="0 0 64 64"><path d="M32 4C18 18 6 34 10 50c10-6 18-14 22-26 4 12 12 20 22 26 4-16-8-32-22-46z" fill="rgba(255,255,255,.25)"/></svg>\
        <svg class="chw-email-leaf chw-email-leaf--tr" viewBox="0 0 64 64"><path d="M32 4C18 18 6 34 10 50c10-6 18-14 22-26 4 12 12 20 22 26 4-16-8-32-22-46z" fill="rgba(255,255,255,.2)"/></svg>\
        <svg class="chw-email-leaf chw-email-leaf--bl" viewBox="0 0 64 64"><path d="M32 4C18 18 6 34 10 50c10-6 18-14 22-26 4 12 12 20 22 26 4-16-8-32-22-46z" fill="rgba(255,255,255,.18)"/></svg>\
        <img src="images/2.webp" alt="" class="chw-email-logo" aria-hidden="true">\
        <div class="chw-email-team" aria-hidden="true">\
            <span class="chw-email-avatar">RK</span>\
            <span class="chw-email-avatar">MS</span>\
            <span class="chw-email-avatar">CHW</span>\
        </div>\
        <h2 id="chwEmailTitle">Hello, Friend <em>👋</em></h2>\
        <svg class="chw-email-wave" viewBox="0 0 460 28" preserveAspectRatio="none"><path d="M0,20 C80,0 160,28 230,14 C300,0 380,24 460,10 L460,28 L0,28 Z"/></svg>\
    </div>\
    <div class="chw-email-scroll">\
    <div class="chw-email-body">\
        <div class="chw-email-note">\
            <div class="chw-email-note-icon">💬</div>\
            <div class="chw-email-note-text">\
                <strong>Got a question? We\'re here for you.</strong>\
                Whether it\'s about our Ayurvedic products, surgical range, or a bulk order - just drop us a line. Real people from our team read every email and reply with care.\
                <span class="chw-email-sign">- With warmth, The CHW Team</span>\
            </div>\
        </div>\
        <div class="chw-email-perks">\
            <span class="chw-email-perk"><i class="fas fa-heart"></i> Personal replies</span>\
            <span class="chw-email-perk"><i class="fas fa-clock"></i> Within 24 hrs</span>\
            <span class="chw-email-perk"><i class="fas fa-leaf"></i> Wellness experts</span>\
        </div>\
        <div class="chw-email-address">\
            <i class="fas fa-envelope"></i>\
            <span>' + EMAIL + '</span>\
        </div>\
        <div class="chw-email-actions">\
            <a href="mailto:' + EMAIL + '?subject=Hello%20CHW%20Team" class="chw-email-btn chw-email-btn-primary" id="chwEmailSend">\
                <i class="fas fa-paper-plane"></i>\
                <span class="chw-email-btn-full">Write to Us - We\'d Love That</span>\
                <span class="chw-email-btn-short">Write to Us</span>\
            </a>\
            <button type="button" class="chw-email-btn chw-email-btn-secondary" id="chwEmailCopy">\
                <i class="fas fa-copy"></i> <span id="chwEmailCopyLabel">Copy Email Address</span>\
            </button>\
        </div>\
    </div>\
    </div>\
    <div class="chw-email-footer">\
        <button type="button" class="chw-email-dismiss" id="chwEmailDismiss">No thanks - don\'t show this again</button>\
    </div>\
</div>';
    document.body.appendChild(overlay);

    function openPopup() {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        sessionStorage.setItem(SESSION_KEY, 'true');
    }

    function dismissForever() {
        localStorage.setItem(STORAGE_KEY, 'true');
        closePopup();
    }

    setTimeout(openPopup, 2200);

    document.getElementById('chwEmailClose').addEventListener('click', closePopup);
    document.getElementById('chwEmailDismiss').addEventListener('click', dismissForever);

    document.getElementById('chwEmailCopy').addEventListener('click', function () {
        var btn = this;
        var icon = btn.querySelector('i');
        var label = document.getElementById('chwEmailCopyLabel');

        function onCopied() {
            btn.classList.add('copied');
            icon.className = 'fas fa-check';
            label.textContent = 'Copied - paste it anywhere!';
            setTimeout(function () {
                btn.classList.remove('copied');
                icon.className = 'fas fa-copy';
                label.textContent = 'Copy Email Address';
            }, 2200);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(EMAIL).then(onCopied).catch(function () {
                window.location.href = 'mailto:' + EMAIL;
            });
        } else {
            var input = document.createElement('input');
            input.value = EMAIL;
            document.body.appendChild(input);
            input.select();
            try {
                document.execCommand('copy');
                onCopied();
            } catch (e) {
                window.location.href = 'mailto:' + EMAIL;
            }
            document.body.removeChild(input);
        }
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closePopup();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closePopup();
    });
})();
