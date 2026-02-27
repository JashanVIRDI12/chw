// ============================
// NUTRA PAGE — UI Logic Only
// Product content is hardcoded in each card's .nutra-product-detail div
// ============================

// Category Filter
document.addEventListener('DOMContentLoaded', function () {
    const pills = document.querySelectorAll('.nutra-pill');
    const blocks = document.querySelectorAll('.nutra-category-block');

    updateNutraHeroBadges();

    pills.forEach(pill => {
        pill.addEventListener('click', function () {
            pills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const cat = this.dataset.category;
            blocks.forEach(block => {
                if (cat === 'all' || block.dataset.cat === cat) {
                    block.classList.remove('hidden');
                    block.style.animation = 'none';
                    block.offsetHeight; // trigger reflow
                    block.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    block.classList.add('hidden');
                }
            });
        });
    });
});

function updateNutraHeroBadges() {
    const hero = document.querySelector('.nutra-hero-section');
    if (!hero) return;

    const badges = hero.querySelectorAll('.nutra-hero-badge');
    if (!badges.length) return;

    const productCount = Object.keys(getNutraHtmlProductData() || {}).length;

    badges.forEach((badge) => {
        const text = badge.textContent || '';
        if (/gmp/i.test(text)) {
            badge.innerHTML = '<i class="fas fa-check-circle"></i> WHO-GMP Certified';
            return;
        }

        if (/iso/i.test(text)) {
            badge.innerHTML = '<i class="fas fa-check-circle"></i> ISO Compliant';
            return;
        }

        if (/products?/i.test(text)) {
            const label = productCount ? `${productCount} Products` : 'Products';
            badge.innerHTML = `<i class="fas fa-check-circle"></i> ${label}`;
        }
    });
}

function normalizeWhoGmpText(value) {
    if (typeof value !== 'string') return value;
    return value
        .replace(/\bGMP\s*Certified\b/gi, 'WHO-GMP Certified')
        .replace(/\bGMP\s*certified\b/gi, 'WHO-GMP certified')
        .replace(/\bGMP-\s*certified\b/gi, 'WHO-GMP-certified')
        .replace(/\bGMP-certified\b/gi, 'WHO-GMP-certified');
}

// ============================
// Modal — reads content from nutra.html JSON (<script id="nutraProductData" type="application/json">)
// ============================
let nutraHtmlProductDataCache;

function getNutraHtmlProductData() {
    if (nutraHtmlProductDataCache) return nutraHtmlProductDataCache;
    const el = document.getElementById('nutraProductData');
    if (!el) {
        nutraHtmlProductDataCache = {};
        return nutraHtmlProductDataCache;
    }

    try {
        nutraHtmlProductDataCache = JSON.parse(el.textContent || '{}') || {};
    } catch {
        nutraHtmlProductDataCache = {};
    }

    return nutraHtmlProductDataCache;
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderListItems(items) {
    if (!items || !items.length) return '';
    return items.map((item) => `<li>${escapeHtml(normalizeWhoGmpText(item))}</li>`).join('');
}

function openProductModal(productId) {
    const htmlProductData = getNutraHtmlProductData();
    const baseProduct = htmlProductData[productId] || {};

    const card = document.querySelector(`.nutra-product-card[onclick="openProductModal('${productId}')"]`);
    const cardTitle = card?.querySelector('.nutra-card-body h3')?.textContent?.trim() || '';
    const cardTagline = card?.querySelector('.nutra-card-body p')?.textContent?.trim() || '';
    const cardImage = card?.querySelector('.nutra-card-img img')?.getAttribute('src') || '';

    const block = card?.closest('.nutra-category-block');
    const blockHeading = block?.querySelector('.nutra-category-header h2')?.textContent?.trim() || '';

    const product = {
        category: baseProduct.category || blockHeading || '',
        title: baseProduct.title || cardTitle || productId,
        tagline: baseProduct.tagline || cardTagline || '',
        image: baseProduct.image || cardImage || '',
        intro: baseProduct.intro || '',
        whyTitle: baseProduct.whyTitle || (baseProduct.title || cardTitle || 'This'),
        why: baseProduct.why || '',
        ingredients: Array.isArray(baseProduct.ingredients) ? baseProduct.ingredients : [],
        benefits: Array.isArray(baseProduct.benefits) ? baseProduct.benefits : [],
        dosage: baseProduct.dosage || 'As advised by your doctor or healthcare professional.',
        who: baseProduct.who || '',
        quality: Array.isArray(baseProduct.quality) ? baseProduct.quality : [],
        outro: baseProduct.outro || ''
    };

    if (!product.intro) product.intro = `Explore ${product.title} and discover how it can support your daily wellness goals.`;
    if (!product.why) product.why = `${product.title} is designed to complement a balanced lifestyle with targeted nutritional support.`;
    if (!product.who) product.who = 'Suitable for adults looking for daily wellness support.';
    if (!product.ingredients.length) product.ingredients = ['See pack label for the full ingredient list and nutritional information.'];
    if (!product.benefits.length) product.benefits = ['Supports everyday wellness as part of a healthy routine.'];

    const imgContainer = document.getElementById('modalImage');
    if (imgContainer) {
        imgContainer.innerHTML = product.image
            ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}">`
            : '';
    }

    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalTagline').textContent = product.tagline;

    const introEl = document.getElementById('modalIntro');
    if (introEl) introEl.textContent = product.intro;

    const whyTitleLabel = document.getElementById('whyTitleLabel');
    if (whyTitleLabel) whyTitleLabel.textContent = product.whyTitle || 'This';

    document.getElementById('modalWhy').textContent = product.why;
    document.getElementById('modalIngredients').innerHTML = renderListItems(product.ingredients);
    document.getElementById('modalBenefits').innerHTML = renderListItems(product.benefits);
    document.getElementById('modalDosage').textContent = product.dosage;
    document.getElementById('modalWho').textContent = product.who;

    const qualityEl = document.getElementById('modalQuality');
    if (qualityEl) {
        qualityEl.innerHTML = renderListItems(product.quality);
        const qSection = qualityEl.closest('.nutra-modal-section');
        if (qSection) qSection.style.display = product.quality.length ? '' : 'none';
    }

    const outroEl = document.getElementById('modalOutro');
    if (outroEl) outroEl.textContent = product.outro;

    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('nutra-modal-overlay')) closeProductModal();
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeProductModal();
});
