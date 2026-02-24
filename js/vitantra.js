// ============================
// VITANTRA PAGE — Category Filter + Product Modal
// ============================

document.addEventListener('DOMContentLoaded', function () {
    const pills = document.querySelectorAll('.nutra-pill');
    const blocks = document.querySelectorAll('.nutra-category-block');
    const cards = document.querySelectorAll('.nutra-product-card');

    hydrateVitantraCardsFromSingleHerb(cards);
    pruneNonSingleHerbCards(blocks);
    prepareShowcaseImages(cards);
    pruneMissingImageCards(blocks);

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

    cards.forEach(card => {
        card.addEventListener('click', function () {
            openVitantraModal(this.dataset);
        });
    });
});

function hasLoadableImage(path) {
    return new Promise((resolve) => {
        if (!path) {
            resolve(false);
            return;
        }

        const probe = new Image();
        probe.onload = () => resolve(true);
        probe.onerror = () => resolve(false);
        probe.src = path;
    });
}

function refreshCategoryCounts(blocks) {
    blocks.forEach((block) => {
        const countLabel = block.querySelector('.nutra-cat-count');
        if (!countLabel) return;
        const count = block.querySelectorAll('.nutra-product-card').length;
        countLabel.textContent = `${count} Products`;
    });
}

function pruneMissingImageCards(blocks) {
    const cards = document.querySelectorAll('.nutra-product-card');

    cards.forEach(async (card) => {
        const img = card.querySelector('.nutra-card-img img');
        const path = card.dataset.image || img?.getAttribute('src') || '';
        const exists = await hasLoadableImage(path);
        if (exists) return;

        card.remove();
        refreshCategoryCounts(blocks);
    });
}

let vitantraModalImages = [];
let vitantraModalImageIndex = 0;

function normalizeSingleHerbImagePath(path) {
    if (!path) return '';
    return path.replace('images/Single herb/', 'images/Single herb capsules/');
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

function hydrateVitantraCardsFromSingleHerb(cards) {
    if (!window.singleHerbProducts) return;

    const herbEntries = Object.values(window.singleHerbProducts);
    const herbLookup = new Map();

    herbEntries.forEach((product) => {
        herbLookup.set(normalizeTitleKey(product.title), product);
    });

    cards.forEach((card) => {
        const title = card.dataset.title || card.querySelector('.nutra-card-body h3')?.textContent || '';
        const matched = herbLookup.get(normalizeTitleKey(title));
        if (!matched) return;

        card.dataset.singleHerbMatched = 'true';

        const image = normalizeSingleHerbImagePath(matched.image);
        const image2 = normalizeSingleHerbImagePath(matched.image2);

        card.dataset.category = matched.category || card.dataset.category || '';
        card.dataset.title = matched.title || title;
        card.dataset.tagline = matched.tagline || card.dataset.tagline || '';
        card.dataset.image = image || card.dataset.image || '';
        card.dataset.image2 = image2 || card.dataset.image2 || '';
        card.dataset.why = matched.why || card.dataset.why || '';
        card.dataset.ingredients = normalizeListValue(matched.ingredients) || card.dataset.ingredients || '';
        card.dataset.benefits = normalizeListValue(matched.benefits) || card.dataset.benefits || '';
        card.dataset.dosage = matched.dosage || card.dataset.dosage || '';
        card.dataset.who = matched.who || card.dataset.who || '';

        const imageElement = card.querySelector('.nutra-card-img img');
        if (imageElement && image) {
            imageElement.setAttribute('src', image);
            imageElement.setAttribute('alt', matched.title || imageElement.getAttribute('alt') || 'Product');
        }

        const titleElement = card.querySelector('.nutra-card-body h3');
        if (titleElement && matched.title) {
            titleElement.textContent = matched.title;
        }

        const taglineElement = card.querySelector('.nutra-card-body p');
        if (taglineElement && matched.tagline) {
            taglineElement.textContent = matched.tagline;
        }
    });
}

function pruneNonSingleHerbCards(blocks) {
    const cards = document.querySelectorAll('.nutra-product-card');

    cards.forEach((card) => {
        if (card.dataset.singleHerbMatched === 'true') return;
        card.remove();
    });

    refreshCategoryCounts(blocks);
}

function deriveSecondImage(imagePath) {
    if (!imagePath || !imagePath.includes('/Single herb capsules/')) return '';

    const filename = imagePath.split('/').pop() || '';
    const plainName = filename
        .replace(/\.{2,}/g, '.')
        .replace(/\s+Capsules?/i, '')
        .replace(/\s+Guggulu/i, '');

    if (plainName === filename) return '';
    return imagePath.replace(filename, plainName);
}

function prepareShowcaseImages(cards) {
    cards.forEach((card) => {
        const imageElement = card.querySelector('.nutra-card-img img');
        if (!imageElement) return;

        const primaryImage = card.dataset.image || imageElement.getAttribute('src') || '';
        const derivedSecondary = card.dataset.image2 || deriveSecondImage(primaryImage);

        if (!derivedSecondary) {
            card.dataset.image = primaryImage;
            return;
        }

        const probe = new Image();
        probe.onload = () => {
            card.dataset.image = derivedSecondary;
            card.dataset.image2 = primaryImage;
            imageElement.setAttribute('src', derivedSecondary);
        };
        probe.onerror = () => {
            card.dataset.image = primaryImage;
        };
        probe.src = derivedSecondary;
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

    document.getElementById('vitantraModalCategory').textContent = product.category || '';
    document.getElementById('vitantraModalTitle').textContent = product.title || '';
    document.getElementById('vitantraModalTagline').textContent = product.tagline || '';
    document.getElementById('vitantraModalWhy').textContent = product.why || '';
    document.getElementById('vitantraModalDosage').textContent = product.dosage || '';
    document.getElementById('vitantraModalWho').textContent = product.who || '';

    const ingredientsList = document.getElementById('vitantraModalIngredients');
    const benefitsList = document.getElementById('vitantraModalBenefits');

    const ingredients = (product.ingredients || '')
        .split('|')
        .map(item => item.trim())
        .filter(Boolean);

    const benefits = (product.benefits || '')
        .split('|')
        .map(item => item.trim())
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
