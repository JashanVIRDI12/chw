const PAGE_SIZE = 25;

let firebase;
let authApi;
let auth;
let adminUser = null;
let authVersion = 0;
let loadVersion = 0;

let allLeads   = [];
let filtered   = [];
let sortCol    = 'created_at';
let sortAsc    = false;
let currentPage = 1;

/* ── Auth ── */
function showLoginError(message) {
    const error = document.getElementById('login-error');
    error.textContent = message;
    error.style.display = 'block';
}

function resetDashboard() {
    adminUser = null;
    allLeads = [];
    filtered = [];
    currentPage = 1;
    ++loadVersion;
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-email-badge').textContent = '';
    document.getElementById('leads-body').innerHTML = '';
    document.getElementById('pagination').style.display = 'none';
    updateStats();
}

async function handleAuthState(user) {
    const version = ++authVersion;
    const btn = document.getElementById('login-btn');
    btn.disabled = true;
    resetDashboard();

    try {
        if (user) {
            const isAdmin = await firebase.isAdminUser(user);
            if (version !== authVersion) return;
            if (!isAdmin) throw new Error('This account does not have admin access.');
            adminUser = user;
            showDashboard(user);
        }
    } catch (error) {
        if (version !== authVersion) return;
        await authApi.signOut(auth);
        showLoginError(error.message);
    } finally {
        if (version === authVersion) {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }
}

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn   = document.getElementById('login-btn');
    const error = document.getElementById('login-error');
    btn.classList.add('loading');
    btn.disabled     = true;
    error.style.display = 'none';

    const email    = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;

    try {
        await authApi.signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        showLoginError(err.message);
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
});

document.getElementById('logout-btn').addEventListener('click', async function () {
    this.disabled = true;
    try {
        await authApi.signOut(auth);
        document.getElementById('admin-email').value = '';
        document.getElementById('admin-password').value = '';
    } catch (error) {
        alert('Sign out failed: ' + error.message);
    } finally {
        this.disabled = false;
    }
});

function showDashboard(user) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display    = 'block';
    document.getElementById('admin-email-badge').textContent = user.email;
    document.getElementById('admin-password').value = '';
    loadLeads();
}

/* ── Data ── */
async function loadLeads() {
    if (!adminUser) return;
    const version = ++loadVersion;
    const session = authVersion;
    setTableLoading();
    try {
        const data = await firebase.fetchLeads();
        // Ignore a response from an earlier refresh or a signed-out session.
        if (version !== loadVersion || session !== authVersion) return;
        allLeads = data;
        updateStats();
        applyFilters();
    } catch (error) {
        if (version !== loadVersion || session !== authVersion) return;
        allLeads = [];
        filtered = [];
        updateStats();
        setTableError(error.message);
    }
}

function updateStats() {
    const now   = new Date();
    const today = now.toISOString().slice(0, 10);
    const week  = new Date(now - 7 * 864e5).toISOString();

    document.getElementById('stat-total').textContent = allLeads.length;
    document.getElementById('stat-today').textContent =
        allLeads.filter(r => r.created_at && r.created_at.startsWith(today)).length;
    document.getElementById('stat-today-date').textContent =
        now.toLocaleDateString('en-IN', { day:'numeric', month:'short' });
    document.getElementById('stat-week').textContent =
        allLeads.filter(r => r.created_at && r.created_at > week).length;

    if (allLeads.length) {
        const latest = allLeads[0];
        document.getElementById('stat-latest').textContent = latest.name || '—';
        document.getElementById('stat-latest-time').textContent =
            latest.created_at ? fmtDate(latest.created_at) : '—';
    } else {
        document.getElementById('stat-latest').textContent = '—';
        document.getElementById('stat-latest-time').textContent = '—';
    }
}

/* ── Search & Sort ── */
document.getElementById('search-input').addEventListener('input', function () {
    currentPage = 1;
    applyFilters();
});

function applyFilters() {
    const q = document.getElementById('search-input').value.toLowerCase().trim();
    filtered = q
        ? allLeads.filter(r =>
            (r.name  || '').toLowerCase().includes(q) ||
            (r.email || '').toLowerCase().includes(q) ||
            (r.phone || '').toLowerCase().includes(q))
        : [...allLeads];

    sortFiltered();
    renderTable();
}

document.querySelectorAll('th[data-col]').forEach(th => {
    th.addEventListener('click', function () {
        const col = this.dataset.col;
        if (sortCol === col) {
            sortAsc = !sortAsc;
        } else {
            sortCol = col;
            sortAsc = col !== 'created_at';
        }
        document.querySelectorAll('th[data-col]').forEach(t => {
            t.classList.remove('sorted');
            t.querySelector('.sort-icon').textContent = '↕';
        });
        this.classList.add('sorted');
        this.querySelector('.sort-icon').textContent = sortAsc ? '↑' : '↓';
        currentPage = 1;
        sortFiltered();
        renderTable();
    });
});

function sortFiltered() {
    filtered.sort(function (a, b) {
        const av = (a[sortCol] || '').toString().toLowerCase();
        const bv = (b[sortCol] || '').toString().toLowerCase();
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
}

/* ── Render ── */
function renderTable() {
    const tbody  = document.getElementById('leads-body');
    const total  = filtered.length;
    const pages  = Math.ceil(total / PAGE_SIZE);
    currentPage  = Math.min(currentPage, pages || 1);
    const start  = (currentPage - 1) * PAGE_SIZE;
    const slice  = filtered.slice(start, start + PAGE_SIZE);

    if (!total) {
        tbody.innerHTML = `<tr><td colspan="6">
            <div class="table-state">
                <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>${allLeads.length ? 'No leads match your search.' : 'No leads yet — they will appear here after the first PDF download.'}</p>
            </div>
        </td></tr>`;
        document.getElementById('pagination').style.display = 'none';
        return;
    }

    tbody.innerHTML = slice.map(function (r, i) {
        return `<tr data-id="${esc(r.id)}">
            <td class="td-name">${start + i + 1}. ${esc(r.name || '—')}</td>
            <td class="td-phone"><a href="tel:${esc(r.phone)}">${esc(r.phone || '—')}</a></td>
            <td class="td-email"><a href="mailto:${esc(r.email)}">${esc(r.email || '—')}</a></td>
            <td><span class="td-page">${esc(r.page || '—')}</span></td>
            <td class="td-date">${r.created_at ? fmtDate(r.created_at) : '—'}</td>
            <td class="td-action">
                <button class="btn-delete" data-id="${esc(r.id)}" data-name="${esc(r.name || '')}">
                    <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    Delete
                </button>
            </td>
        </tr>`;
    }).join('');

    /* Attach delete listeners */
    tbody.querySelectorAll('.btn-delete').forEach(function (btn) {
        btn.addEventListener('click', function () {
            deleteLead(this.dataset.id, this.dataset.name, this);
        });
    });

    /* Pagination */
    const pg = document.getElementById('pagination');
    const pi = document.getElementById('page-info');
    pg.style.display = 'flex';
    pi.textContent   = `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, total)} of ${total} leads`;

    const btns = document.getElementById('page-btns');
    btns.innerHTML = '';
    const prev = mk('button', 'page-btn', '← Prev');
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', function () { currentPage--; renderTable(); });
    btns.appendChild(prev);

    const maxBtn = Math.min(pages, 7);
    const start_ = Math.max(1, currentPage - 3);
    for (let p = start_; p <= Math.min(start_ + maxBtn - 1, pages); p++) {
        const b = mk('button', 'page-btn' + (p === currentPage ? ' active' : ''), p);
        b.addEventListener('click', (function(pp){ return function(){ currentPage = pp; renderTable(); }; })(p));
        btns.appendChild(b);
    }

    const next = mk('button', 'page-btn', 'Next →');
    next.disabled = currentPage === pages;
    next.addEventListener('click', function () { currentPage++; renderTable(); });
    btns.appendChild(next);
}

function setTableLoading() {
    document.getElementById('leads-body').innerHTML =
        `<tr><td colspan="6"><div class="table-state"><p>Loading leads…</p></div></td></tr>`;
    document.getElementById('pagination').style.display = 'none';
}

function setTableError(msg) {
    document.getElementById('leads-body').innerHTML =
        `<tr><td colspan="6"><div class="table-state"><p style="color:#dc2626">Error: ${esc(msg)}</p></div></td></tr>`;
}

/* ── Delete ── */
async function deleteLead(id, name, btn) {
    if (!adminUser) return;
    if (!confirm('Delete lead "' + name + '"? This cannot be undone.')) return;
    const session = authVersion;
    btn.disabled = true;
    btn.textContent = '…';

    try {
        await firebase.deleteLeadById(id);
    } catch (error) {
        if (session !== authVersion) return;
        alert('Delete failed: ' + error.message);
        btn.disabled = false;
        btn.innerHTML = `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> Delete`;
        return;
    }

    /* Remove from local arrays and re-render without a full reload */
    if (session !== authVersion) return;
    ++loadVersion;
    allLeads = allLeads.filter(function (r) { return r.id !== id; });
    updateStats();
    applyFilters();
}

/* ── Export CSV ── */
document.getElementById('export-btn').addEventListener('click', function () {
    if (!filtered.length) return;
    const rows = [['Name','Phone','Email','Page','Date']];
    filtered.forEach(function (r) {
        rows.push([r.name, r.phone, r.email, r.page, r.created_at ? fmtDate(r.created_at) : '']);
    });
    const csv  = rows.map(r => r.map(c => '"' + String(c || '').replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'chw-leads-' + new Date().toISOString().slice(0,10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
});

/* ── Refresh ── */
document.getElementById('refresh-btn').addEventListener('click', loadLeads);

/* ── Helpers ── */
function fmtDate(iso) {
    return new Date(iso).toLocaleString('en-IN', {
        day:'2-digit', month:'short', year:'numeric',
        hour:'2-digit', minute:'2-digit', hour12: true
    });
}
function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function mk(tag, cls, text) {
    const el = document.createElement(tag);
    el.className = cls;
    el.textContent = text;
    return el;
}

/* ── Boot ── */
async function boot() {
    document.getElementById('login-btn').disabled = true;
    try {
        [firebase, authApi] = await Promise.all([
            import('./firebase-client.js'),
            import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js')
        ]);
        auth = authApi.getAuth(firebase.getFirebaseApp());
        // Firebase restores the browser session before notifying this listener.
        authApi.onAuthStateChanged(auth, handleAuthState, error => showLoginError(error.message));
    } catch (error) {
        showLoginError(error.message);
    }
}

boot();
