/**
 * PDF Download — Lead Capture
 * Intercepts catalogue download clicks, collects lead info, saves to Supabase.
 *
 * Setup (one-time):
 *  1. Go to https://supabase.com → New project (free)
 *  2. Open SQL Editor and run:
 *       create table leads (
 *         id bigint generated always as identity primary key,
 *         created_at timestamptz default now(),
 *         name text not null,
 *         phone text not null,
 *         email text not null,
 *         page text
 *       );
 *       alter table leads enable row level security;
 *       create policy "insert only" on leads for insert to anon with check (true);
 *  3. Go to Project Settings → API → copy Project URL and anon public key below.
 */

const SUPABASE_URL  = (typeof CHW_CONFIG !== 'undefined') ? CHW_CONFIG.SUPABASE_URL  : '';
const SUPABASE_ANON = (typeof CHW_CONFIG !== 'undefined') ? CHW_CONFIG.SUPABASE_ANON : '';

(function () {
    'use strict';

    /* ── Inject modal HTML + styles once ── */
    function injectModal() {
        if (document.getElementById('pdf-lead-overlay')) return;

        const style = document.createElement('style');
        style.textContent = `
            #pdf-lead-overlay {
                position: fixed; inset: 0; z-index: 99999;
                background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
                display: flex; align-items: center; justify-content: center;
                padding: 1rem;
                opacity: 0; transition: opacity 0.25s ease;
                pointer-events: none;
            }
            #pdf-lead-overlay.visible {
                opacity: 1; pointer-events: all;
            }
            #pdf-lead-modal {
                background: #fff; border-radius: 16px;
                padding: 2.5rem 2rem; width: 100%; max-width: 440px;
                box-shadow: 0 24px 60px rgba(0,0,0,0.18);
                transform: translateY(24px) scale(0.97);
                transition: transform 0.28s cubic-bezier(.34,1.56,.64,1);
                position: relative;
            }
            #pdf-lead-overlay.visible #pdf-lead-modal {
                transform: translateY(0) scale(1);
            }
            #pdf-lead-modal .plm-close {
                position: absolute; top: 1rem; right: 1rem;
                background: none; border: none; cursor: pointer;
                font-size: 1.25rem; color: #888; line-height: 1;
                padding: 0.25rem 0.4rem; border-radius: 50%;
                transition: color 0.2s, background 0.2s;
            }
            #pdf-lead-modal .plm-close:hover { color: #333; background: #f0f0f0; }
            #pdf-lead-modal .plm-icon {
                width: 56px; height: 56px; border-radius: 12px;
                background: linear-gradient(135deg,#006241,#008a5c);
                display: flex; align-items: center; justify-content: center;
                margin-bottom: 1.25rem;
            }
            #pdf-lead-modal .plm-icon i { color:#fff; font-size:1.5rem; }
            #pdf-lead-modal .plm-title {
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.6rem; font-weight: 700;
                color: #1a1a1a; margin: 0 0 0.35rem;
            }
            #pdf-lead-modal .plm-sub {
                font-size: 0.875rem; color: #666;
                margin: 0 0 1.5rem; line-height: 1.5;
            }
            #pdf-lead-form .plm-field { margin-bottom: 1rem; }
            #pdf-lead-form label {
                display: block; font-size: 0.8rem; font-weight: 600;
                color: #444; margin-bottom: 0.35rem; letter-spacing: 0.04em;
                text-transform: uppercase;
            }
            #pdf-lead-form input {
                width: 100%; padding: 0.7rem 1rem;
                border: 1.5px solid #ddd; border-radius: 8px;
                font-size: 0.95rem; color: #1a1a1a;
                outline: none; transition: border-color 0.2s, box-shadow 0.2s;
                box-sizing: border-box; font-family: 'Inter', sans-serif;
            }
            #pdf-lead-form input:focus {
                border-color: #006241;
                box-shadow: 0 0 0 3px rgba(0,98,65,0.12);
            }
            #pdf-lead-form input.plm-error { border-color: #e53935; }
            #pdf-lead-form .plm-err-msg {
                font-size: 0.78rem; color: #e53935;
                margin-top: 0.3rem; display: none;
            }
            #pdf-lead-form input.plm-error + .plm-err-msg { display: block; }
            #pdf-lead-submit {
                width: 100%; padding: 0.85rem;
                background: #006241; color: #fff;
                border: none; border-radius: 8px; cursor: pointer;
                font-size: 1rem; font-weight: 600;
                font-family: 'Inter', sans-serif; margin-top: 0.5rem;
                display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
            }
            #pdf-lead-submit:hover:not(:disabled) {
                background: #004d33;
                box-shadow: 0 8px 20px rgba(0,98,65,0.3);
                transform: translateY(-1px);
            }
            #pdf-lead-submit:disabled { opacity: 0.7; cursor: not-allowed; }
            #pdf-lead-submit .plm-spinner {
                width: 16px; height: 16px;
                border: 2px solid rgba(255,255,255,0.4);
                border-top-color: #fff; border-radius: 50%;
                animation: plm-spin 0.7s linear infinite; display: none;
            }
            #pdf-lead-submit.loading .plm-spinner { display: block; }
            #pdf-lead-submit.loading .plm-btn-text { display: none; }
            @keyframes plm-spin { to { transform: rotate(360deg); } }
            #plm-success {
                text-align: center; padding: 1rem 0; display: none;
            }
            #plm-success i { font-size: 2.5rem; color: #006241; margin-bottom: 0.75rem; display: block; }
            #plm-success h3 {
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.4rem; color: #1a1a1a; margin: 0 0 0.4rem;
            }
            #plm-success p { font-size: 0.875rem; color: #666; margin: 0; }
            #plm-err-banner {
                background: #fff3f3; border: 1px solid #ffc0c0; border-radius: 8px;
                color: #c62828; font-size: 0.82rem; padding: 0.6rem 0.9rem;
                margin-bottom: 0.75rem; display: none;
            }
            .plm-privacy {
                text-align: center; font-size: 0.75rem; color: #aaa; margin-top: 0.75rem;
            }
            .plm-privacy i { margin-right: 0.25rem; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'pdf-lead-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'plm-title');
        overlay.innerHTML = `
            <div id="pdf-lead-modal">
                <button class="plm-close" aria-label="Close">&times;</button>
                <div class="plm-icon"><i class="fas fa-file-pdf"></i></div>
                <h2 class="plm-title" id="plm-title">Get Your Free Catalogue</h2>
                <p class="plm-sub">Enter your details — your download will start instantly.</p>

                <div id="plm-err-banner"></div>

                <form id="pdf-lead-form" novalidate>
                    <div class="plm-field">
                        <label for="plm-name">Full Name *</label>
                        <input type="text" id="plm-name" name="name"
                               placeholder="e.g. Rahul Sharma" autocomplete="name" required>
                        <div class="plm-err-msg">Please enter your name.</div>
                    </div>
                    <div class="plm-field">
                        <label for="plm-phone">Phone Number *</label>
                        <input type="tel" id="plm-phone" name="phone"
                               placeholder="e.g. +91 98765 43210" autocomplete="tel" required>
                        <div class="plm-err-msg">Please enter a valid phone number.</div>
                    </div>
                    <div class="plm-field">
                        <label for="plm-email">Email Address *</label>
                        <input type="email" id="plm-email" name="email"
                               placeholder="e.g. rahul@company.com" autocomplete="email" required>
                        <div class="plm-err-msg">Please enter a valid email.</div>
                    </div>
                    <button type="submit" id="pdf-lead-submit">
                        <span class="plm-spinner"></span>
                        <span class="plm-btn-text"><i class="fas fa-download"></i> Download PDF Now</span>
                    </button>
                    <p class="plm-privacy"><i class="fas fa-lock"></i> We never share your information.</p>
                </form>

                <div id="plm-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>Download Starting!</h3>
                    <p>Thank you. Your catalogue is downloading now.</p>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal();
        });
        overlay.querySelector('.plm-close').addEventListener('click', closeModal);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });
        document.getElementById('pdf-lead-form').addEventListener('submit', handleSubmit);
    }

    let pendingHref = '';
    let pendingFilename = '';

    function openModal(href, filename) {
        pendingHref = href;
        pendingFilename = filename;
        const overlay = document.getElementById('pdf-lead-overlay');
        const form    = document.getElementById('pdf-lead-form');
        const success = document.getElementById('plm-success');
        const banner  = document.getElementById('plm-err-banner');
        form.style.display    = '';
        success.style.display = 'none';
        banner.style.display  = 'none';
        form.reset();
        form.querySelectorAll('input').forEach(function (i) { i.classList.remove('plm-error'); });
        var btn = document.getElementById('pdf-lead-submit');
        btn.classList.remove('loading');
        btn.disabled = false;
        overlay.classList.add('visible');
        setTimeout(function () { document.getElementById('plm-name').focus(); }, 100);
    }

    function closeModal() {
        document.getElementById('pdf-lead-overlay').classList.remove('visible');
    }

    function validate() {
        var ok    = true;
        var name  = document.getElementById('plm-name');
        var phone = document.getElementById('plm-phone');
        var email = document.getElementById('plm-email');

        var nameOk = name.value.trim().length >= 2;
        name.classList.toggle('plm-error', !nameOk);
        if (!nameOk) ok = false;

        var phoneVal = phone.value.trim().replace(/[\s\-().+]/g, '');
        var phoneOk  = phoneVal.length >= 7 && !isNaN(phoneVal);
        phone.classList.toggle('plm-error', !phoneOk);
        if (!phoneOk) ok = false;

        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        email.classList.toggle('plm-error', !emailOk);
        if (!emailOk) ok = false;

        return ok;
    }

    function saveLead(payload) {
        if (!SUPABASE_URL || !SUPABASE_ANON) return Promise.resolve();

        return fetch(SUPABASE_URL + '/rest/v1/leads', {
            method: 'POST',
            headers: {
                'apikey':        SUPABASE_ANON,
                'Authorization': 'Bearer ' + SUPABASE_ANON,
                'Content-Type':  'application/json',
                'Prefer':        'return=minimal'
            },
            body: JSON.stringify(payload)
        }).then(function (res) {
            if (!res.ok) return res.text().then(function (t) { throw new Error(t); });
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        var btn    = document.getElementById('pdf-lead-submit');
        var banner = document.getElementById('plm-err-banner');
        btn.classList.add('loading');
        btn.disabled          = true;
        banner.style.display  = 'none';

        var payload = {
            name:  document.getElementById('plm-name').value.trim(),
            phone: document.getElementById('plm-phone').value.trim(),
            email: document.getElementById('plm-email').value.trim(),
            page:  window.location.pathname
        };

        saveLead(payload)
            .then(function () {
                triggerDownload();
                document.getElementById('pdf-lead-form').style.display = 'none';
                document.getElementById('plm-success').style.display   = 'block';
                setTimeout(closeModal, 2800);
            })
            .catch(function () {
                /* Still let them download — don't punish the user for a DB error */
                triggerDownload();
                document.getElementById('pdf-lead-form').style.display = 'none';
                document.getElementById('plm-success').style.display   = 'block';
                setTimeout(closeModal, 2800);
            });
    }

    function triggerDownload() {
        var a      = document.createElement('a');
        a.href     = pendingHref;
        a.download = pendingFilename || 'CHW_Product_Catalogue.pdf';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { document.body.removeChild(a); }, 500);
    }

    /* ── Intercept all PDF download links ── */
    function interceptDownloadLinks() {
        document.querySelectorAll('a[download]').forEach(function (link) {
            if (!link.href.toLowerCase().includes('.pdf')) return;
            link.addEventListener('click', function (e) {
                e.preventDefault();
                injectModal();
                openModal(link.href, link.getAttribute('download'));
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', interceptDownloadLinks);
    } else {
        interceptDownloadLinks();
    }

})();
