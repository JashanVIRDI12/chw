// ============================
// VITANTRA PAGE — Single Herb Grid + Product Modal
// ============================

document.addEventListener('DOMContentLoaded', function () {
    renderSingleHerbGrid();
    updateVitantraHeroBadges();
});

function updateVitantraHeroBadges() {
    const hero = document.querySelector('.vitantra-hero-section');
    if (!hero) return;

    const badges = hero.querySelectorAll('.nutra-hero-badge');
    if (!badges.length) return;

    const productCount = window.singleHerbProducts ? Object.keys(window.singleHerbProducts).length : 0;

    badges.forEach((badge) => {
        const text = badge.textContent || '';
        if (/gmp/i.test(text)) {
            badge.innerHTML = '<i class="fas fa-check-circle"></i> WHO-GMP Certified';
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

let vitantraModalImages = [];
let vitantraModalImageIndex = 0;

function normalizeSingleHerbImagePath(path) {
    if (!path) return '';
    // Folder is 'Single herb' — no translation needed
    return path;
}

function normalizeListValue(value) {
    if (Array.isArray(value)) return value.join(' | ');
    return value || '';
}

function normalizeTitleKey(value) {
    return (value || '')
        .toLowerCase()
        .replace(/ksm-66/g, '')
        .replace(/capsules?/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function toCardDataset(product) {
    const image = normalizeSingleHerbImagePath(product.image);
    const image2 = normalizeSingleHerbImagePath(product.image2);

    const primaryImage = image2 || image;

    return {
        category: '',
        title: product.title || 'Product',
        tagline: product.tagline || '',
        image: primaryImage || '',
        image2: image2 || '',
        why: product.why || '',
        ingredients: normalizeListValue(product.ingredients) || '',
        benefits: normalizeListValue(product.benefits) || '',
        dosage: product.dosage || '',
        who: product.who || ''
    };
}

function renderSingleHerbGrid() {
    const grid = document.getElementById('vitantraProductsGrid');
    if (!grid) return;
    if (!window.singleHerbProducts) return;

    const herbs = Object.values(window.singleHerbProducts)
        .filter((p) => p && p.title)
        .slice()
        .sort((a, b) => normalizeTitleKey(a.title).localeCompare(normalizeTitleKey(b.title)));

    grid.innerHTML = '';

    herbs.forEach((product) => {
        const dataset = toCardDataset(product);

        const card = document.createElement('div');
        card.className = 'nutra-product-card';
        Object.entries(dataset).forEach(([key, value]) => {
            card.dataset[key] = value;
        });

        card.innerHTML = `
            <div class="nutra-card-img"><img src="${dataset.image}" alt="${dataset.title}"></div>
            <div class="nutra-card-body">
                <h3>${dataset.title}</h3>
                <p>${dataset.tagline}</p>
            </div>
            <div class="nutra-card-action"><span>Learn More</span><i class="fas fa-arrow-right"></i></div>
        `;

        card.addEventListener('click', function () {
            openVitantraModal(this.dataset);
        });

        grid.appendChild(card);
    });
}

function openVitantraModal(product) {
    const modal = document.getElementById('vitantraModal');
    const imgContainer = document.getElementById('vitantraModalImage');

    if (!modal || !imgContainer) return;

    const images = [product.image, product.image2].filter(Boolean);
    vitantraModalImages = [...new Set(images)];
    vitantraModalImageIndex = 0;
    renderVitantraModalImage(imgContainer, product.title || 'Product');

    const categoryEl = document.getElementById('vitantraModalCategory');
    if (categoryEl) {
        categoryEl.textContent = '';
        categoryEl.style.display = 'none';
    }
    document.getElementById('vitantraModalTitle').textContent = product.title || '';
    document.getElementById('vitantraModalTagline').textContent = product.tagline || '';
    document.getElementById('vitantraModalWhy').textContent = normalizeWhoGmpText(product.why || '');
    document.getElementById('vitantraModalDosage').textContent = normalizeWhoGmpText(product.dosage || '');
    document.getElementById('vitantraModalWho').textContent = normalizeWhoGmpText(product.who || '');

    const ingredientsList = document.getElementById('vitantraModalIngredients');
    const benefitsList = document.getElementById('vitantraModalBenefits');

    const ingredients = normalizeWhoGmpText(product.ingredients || '')
        .split('|')
        .map((x) => x.trim())
        .filter(Boolean);

    const benefits = normalizeWhoGmpText(product.benefits || '')
        .split('|')
        .map((x) => x.trim())
        .filter(Boolean);

    ingredientsList.innerHTML = ingredients.map(item => `<li>${item}</li>`).join('');
    benefitsList.innerHTML = benefits.map(item => `<li>${item}</li>`).join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function renderVitantraModalImage(imgContainer, title) {
    if (!imgContainer || !vitantraModalImages.length) return;

    const currentImage = vitantraModalImages[vitantraModalImageIndex];
    imgContainer.innerHTML = `<img src="${currentImage}" alt="${title}">`;

    if (vitantraModalImages.length <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'nutra-modal-carousel-btn nutra-modal-carousel-btn--prev';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nutra-modal-carousel-btn nutra-modal-carousel-btn--next';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';

    const indicators = document.createElement('div');
    indicators.className = 'nutra-modal-indicators';
    indicators.innerHTML = vitantraModalImages
        .map((_, index) => `<button class="nutra-modal-indicator ${index === vitantraModalImageIndex ? 'active' : ''}" data-index="${index}" aria-label="Go to image ${index + 1}"></button>`)
        .join('');

    imgContainer.appendChild(prevBtn);
    imgContainer.appendChild(nextBtn);
    imgContainer.appendChild(indicators);
}

function navigateVitantraModalImage(direction) {
    if (vitantraModalImages.length <= 1) return;

    vitantraModalImageIndex += direction;
    if (vitantraModalImageIndex < 0) vitantraModalImageIndex = vitantraModalImages.length - 1;
    if (vitantraModalImageIndex >= vitantraModalImages.length) vitantraModalImageIndex = 0;

    const title = document.getElementById('vitantraModalTitle')?.textContent || 'Product';
    renderVitantraModalImage(document.getElementById('vitantraModalImage'), title);
}

function closeVitantraModal() {
    const modal = document.getElementById('vitantraModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('nutra-modal-overlay')) {
        closeVitantraModal();
    }

    if (e.target.closest('.nutra-modal-carousel-btn--prev')) {
        navigateVitantraModalImage(-1);
    }

    if (e.target.closest('.nutra-modal-carousel-btn--next')) {
        navigateVitantraModalImage(1);
    }

    const indicator = e.target.closest('.nutra-modal-indicator');
    if (indicator) {
        vitantraModalImageIndex = Number(indicator.dataset.index) || 0;
        const title = document.getElementById('vitantraModalTitle')?.textContent || 'Product';
        renderVitantraModalImage(document.getElementById('vitantraModalImage'), title);
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeVitantraModal();
    }

    if (e.key === 'ArrowLeft') {
        navigateVitantraModalImage(-1);
    }

    if (e.key === 'ArrowRight') {
        navigateVitantraModalImage(1);
    }
});
