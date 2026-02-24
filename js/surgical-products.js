/**
 * Surgical Products - Modal, Carousel & Category Filter
 */

// ── Product Data ──
const productData = {
    'gauze-swab': {
        name: 'Gauze Swab',
        tagline: 'PureSwab',
        number: '01',
        tag: 'Sterile Available',
        description: 'Soft, sterile gauze swabs designed for effective wound cleaning and dressing. High absorbency helps manage fluids efficiently. Gentle on sensitive skin. Provides reliable protection during healing. Suitable for First aid and clinical use.',
        features: [
            'High absorbency for effective wound management',
            'Gentle on sensitive skin',
            'Available in sterile and non-sterile options',
            'Smooth plunger glide with precise graduation markings',
            'Ultra-smooth insertion with optimal flow design'
        ],
        specs: {
            'Material': 'Soft Cotton',
            'Size': 'Multiple sizes available',
            'Packaging': 'Sterile packs',
            'Certification': 'GMP & ISO Certified'
        },
        useCase: 'High absorbency with soft, skin-friendly fabric for effective wound clearing and dressing.',
        images: [
            'images/Surgical Products/Gauze_Swab/Design B1.webp',
            'images/Surgical Products/Gauze_Swab/Design B4.webp',
            'images/Surgical Products/Gauze_Swab/Design B5.webp',
            'images/Surgical Products/Gauze_Swab/Design B6.webp'
        ]
    },
    'abdominal-sponges': {
        name: 'Abdominal Sponges',
        tagline: 'AbdomCare',
        number: '02',
        tag: 'Surgical Grade',
        description: 'Surgical abdominal sponges with superior absorbency and strength. Designed to manage fluids during procedures effectively. Reduces tissue irritation. Trusted for operating room and surgical applications.',
        features: [
            'Superior fluid absorption with strong fabric integrity',
            'High-capacity sponges for optimal patient comfort',
            'Durable construction for secure handling',
            'X-ray detectable for safety',
            'Pre-washed and sterilized'
        ],
        specs: {
            'Material': 'Medical-grade cotton',
            'Type': 'Lap sponges',
            'Sterilization': 'Gamma sterilized',
            'Certification': 'Surgical Grade Certified'
        },
        useCase: 'Superior fluid absorption with strong fabric integrity for safe use during surgical procedures.',
        images: [
            'images/Surgical Products/Abdominal_Sponges/Design A1.webp',
            'images/Surgical Products/Abdominal_Sponges/Design A2.webp',
            'images/Surgical Products/Abdominal_Sponges/Design A3.webp',
            'images/Surgical Products/Abdominal_Sponges/Design A4.webp'
        ]
    },
    'gauze-than': {
        name: 'Gauze Than (Roll)',
        tagline: 'Softan',
        number: '03',
        tag: 'Medical Grade',
        description: 'Premium gauze rolls suitable for wound dressing and bandaging. Provides consistent breathable coverage. Made from flexible materials. Ideal for hospitals, clinics, and home care.',
        features: [
            'Breathable cotton fabric for optimal patient comfort',
            'Soft texture for delicate wound care',
            'Easy to cut and customize',
            'Lint-free for clean application',
            'Suitable for multiple medical uses'
        ],
        specs: {
            'Material': 'Pure cotton gauze',
            'Width': 'Various widths available',
            'Length': 'Standard roll lengths',
            'Grade': 'Medical Grade BP/USP'
        },
        useCase: 'Breathable and easy-to-wrap gauze rolls for comfortable and reliable wound dressing.',
        images: [
            'images/Surgical Products/Gauze_Than_(Roll)/Design B1.webp',
            'images/Surgical Products/Gauze_Than_(Roll)/Design B2.webp'
        ]
    },
    'gamjee-roll': {
        name: 'Gamjee Roll',
        tagline: 'GamRoll',
        number: '04',
        tag: 'High Absorbency',
        description: 'Premium gamjee rolls for wound dressing. Made from high-quality cotton layers for added comfort. Helps protect injured areas and improves comfort during healing.',
        features: [
            'Extra cushioning and padding support',
            'Soft cotton layers for patient comfort',
            'High absorbency for fluid management',
            'Durable outer layer for protection',
            'Easy to apply and secure'
        ],
        specs: {
            'Composition': 'Cotton wool with gauze cover',
            'Absorbency': 'High',
            'Size': 'Standard widths and lengths',
            'Applications': 'Padding and support'
        },
        useCase: 'Extra cushioning and padding support that protects wounds and improves comfort during recovery.',
        images: [
            'images/Surgical Products/Gamjee_Roll/Design B1.webp',
            'images/Surgical Products/Gamjee_Roll/Design B2.webp',
            'images/Surgical Products/Gamjee_Roll/Design B3.webp'
        ]
    },
    'gamjee-pad': {
        name: 'Gamjee Pad',
        tagline: 'GamjePro',
        number: '05',
        tag: 'Sterile Pack',
        description: 'Highly absorbent gamjee pads designed for effective wound protection. Soft and cushioned to enhance patient comfort. Helps prevent leakage and supports faster healing.',
        features: [
            'Highly absorbent pads with cushioning',
            'Soft cushioning for wound protection',
            'Sterile packaging options',
            'Various sizes for different applications',
            'Ideal for post-operative care'
        ],
        specs: {
            'Material': 'Absorbent cotton with gauze',
            'Thickness': 'Multiple thickness options',
            'Packaging': 'Individual sterile packs',
            'Usage': 'Single use recommended'
        },
        useCase: 'Highly absorbent pads cushioned and designed to prevent leakage and support faster healing.',
        images: [
            'images/Surgical Products/Gamjee_Pad/Design A2.webp',
            'images/Surgical Products/Gamjee_Pad/Design A3.webp',
            'images/Surgical Products/Gamjee_Pad/Design B11.webp',
            'images/Surgical Products/Gamjee_Pad/Design B3.webp'
        ]
    },
    'absorbent-cotton-gauze': {
        name: 'Absorbent Cotton Gauze',
        tagline: 'Absorb Gauze',
        number: '06',
        tag: '100% Cotton',
        description: 'Made from high-quality cotton for maximum absorbency. Soft, breathable, and gentle on sensitive skin. Suitable for wound cleaning, dressing, and packing.',
        features: [
            '100% pure cotton material',
            'Maximum absorbency',
            'Soft and breathable',
            'Lint-free construction',
            'Medical grade quality'
        ],
        specs: {
            'Purity': '100% Cotton',
            'Type': 'Absorbent gauze',
            'Applications': 'Wound care, cleaning, packing',
            'Standards': 'BP/USP Compliant'
        },
        useCase: 'Premium cotton softness with maximum absorbency for gentle yet effective wound care.',
        images: [
            'images/Surgical Products/Absorbent_Cotton_Gauze/WhatsApp Image 2026-02-10 at 3.12.19 PM.webp',
            'images/Surgical Products/Absorbent_Cotton_Gauze/WhatsApp Image 2026-02-10 at 3.19.02 PM (1).webp',
            'images/Surgical Products/Absorbent_Cotton_Gauze/WhatsApp Image 2026-02-10 at 3.19.02 PM.webp'
        ]
    },
    'elastic-adhesive-bandage': {
        name: 'Elastic Adhesive Bandage',
        tagline: 'StickerPro',
        number: '07',
        tag: 'Self-Adhesive',
        description: 'Flexible elastic adhesive bandages that provide secure support. Stretches comfortably with body movement. Ideal for fixation, compression, and joint support.',
        features: [
            'Self-adhesive for easy application',
            'Stretchable for comfortable fit',
            'Breathable material',
            'Water-resistant',
            'No pins or clips needed'
        ],
        specs: {
            'Adhesion': 'Self-adhesive',
            'Elasticity': 'High stretch',
            'Width': 'Multiple widths available',
            'Material': 'Elastic fabric with adhesive'
        },
        useCase: 'Strong sticking power with stretchable comfort for secure fixation and flexible movement.',
        images: [
            'images/Surgical Products/Elastic_Adhesive_Bandage/Design B2.webp',
            'images/Surgical Products/Elastic_Adhesive_Bandage/Design B3.webp'
        ]
    },
    'cotton-crepe-bandage': {
        name: 'Cotton Crepe Bandage',
        tagline: 'CrepePro',
        number: '08',
        tag: 'Reusable',
        description: 'Cotton crepe bandages offer controlled compression and firm support. Lightweight and breathable for extended wear. Suitable for sprains, strains, and post-injury support.',
        features: [
            'Reusable and washable',
            'Controlled compression',
            'Breathable cotton material',
            'Durable construction',
            'Ideal for sprains and support'
        ],
        specs: {
            'Material': 'Cotton crepe',
            'Elasticity': 'Medium stretch',
            'Reusability': 'Washable and reusable',
            'Applications': 'Compression, support'
        },
        useCase: 'Balanced compression and breathable cotton comfort for sprain support and swelling control.',
        images: [
            'images/Surgical Products/Cotton_Crepe_Bandage/Design A1.webp',
            'images/Surgical Products/Cotton_Crepe_Bandage/Design A2.webp'
        ]
    },
    'syringes': {
        name: 'Syringes',
        tagline: 'Erecta',
        number: '09',
        tag: 'Single Use',
        description: 'Our syringes are designed for accurate dosing and smooth injection. Manufactured using medical-grade materials. Clear barrel markings for precise graduation. Suitable for clinical, labs, and hospital use.',
        features: [
            'Precision-engineered for accurate dosing',
            'Clear graduation markings',
            'Smooth plunger operation',
            'Sterile and single-use',
            'Available in multiple sizes'
        ],
        specs: {
            'Material': 'Medical-grade plastic',
            'Sizes': '1ml, 2ml, 5ml, 10ml, 20ml',
            'Needle': 'With or without needle options',
            'Packaging': 'Individual sterile packs'
        },
        useCase: 'Smooth plunger glide with precise graduation markings for accurate dosing and safe injections.',
        images: [
            'images/Surgical Products/Syringes/Design A2.webp',
            'images/Surgical Products/Syringes/Design A5.webp',
            'images/Surgical Products/Syringes/Design A6.webp'
        ]
    },
    'cannulas': {
        name: 'Cannulas',
        tagline: 'FlowCath',
        number: '10',
        tag: 'Multiple Sizes',
        description: 'High-quality cannulas engineered for smooth insertion and optimal patient comfort. Made from flexible, biocompatible materials. Ensures reliable IV access.',
        features: [
            'Smooth insertion for patient comfort',
            'Color-coded for easy size identification',
            'Flexible and kink-resistant',
            'Sharp beveled needle',
            'Sterile and single-use'
        ],
        specs: {
            'Sizes': '14G to 24G',
            'Material': 'Biocompatible plastic',
            'Type': 'IV cannula with injection port',
            'Sterilization': 'ETO sterilized'
        },
        useCase: 'Ultra-smooth insertion with optimal flow design for low-pressure IV access.',
        images: [
            'images/Surgical Products/Cannulas/Design A2.webp',
            'images/Surgical Products/Cannulas/Design A3.webp',
            'images/Surgical Products/Cannulas/Design A4.webp',
            'images/Surgical Products/Cannulas/Design A5.webp'
        ]
    },
    'examination-gloves': {
        name: 'Examination Gloves',
        tagline: 'HandsaPro',
        number: '11',
        tag: 'Powder-Free',
        description: 'Disposable examination gloves provide reliable barrier protection. Designed for comfort, flexibility, and tactile sensitivity. Helps maintain hygiene during medical examinations.',
        features: [
            'Latex and nitrile options',
            'Powder-free for reduced allergies',
            'Textured fingertips for better grip',
            'Ambidextrous design',
            'High tactile sensitivity'
        ],
        specs: {
            'Material': 'Latex/Nitrile',
            'Sizes': 'XS, S, M, L, XL',
            'Thickness': 'Standard medical grade',
            'Packaging': 'Box of 100'
        },
        useCase: 'Comfort-fit barrier protection with enhanced tactile sensitivity for safe examinations.',
        images: [
            'images/Surgical Products/Examination_Gloves/Design A2.webp',
            'images/Surgical Products/Examination_Gloves/Design A3.webp',
            'images/Surgical Products/Examination_Gloves/Design A4.webp'
        ]
    },
    'surgical-gloves': {
        name: 'Surgical Gloves',
        tagline: 'ProGlove',
        number: '12',
        tag: 'Sterile',
        description: 'Sterile, high-durability gloves with superior grip and tactile control. Tested for strength and pin-hole integrity. Ensures maximum hygiene during critical surgical procedures.',
        features: [
            'Superior tactile sensitivity',
            'Excellent grip for surgical instruments',
            'Tested for pin-hole integrity',
            'Anatomically designed',
            'Double-gloving compatible'
        ],
        specs: {
            'Material': 'Natural latex/Synthetic',
            'Sizes': '6.0, 6.5, 7.0, 7.5, 8.0, 8.5',
            'Sterility': 'Gamma sterilized',
            'Packaging': 'Sterile pairs'
        },
        useCase: 'Sterile, high-durability protection with precision grip for critical surgical performance.',
        images: [
            'images/Surgical Products/Surgical_Gloves/Design A1.webp',
            'images/Surgical Products/Surgical_Gloves/Design A2.webp',
            'images/Surgical Products/Surgical_Gloves/Design A3.webp',
            'images/Surgical Products/Surgical_Gloves/Design A4.webp'
        ]
    }
};

// ── Carousel state ──
let surgicalImgIdx = 0;
let surgicalImgs = [];

function surgicalCarousel(dir) {
    if (surgicalImgs.length <= 1) return;
    surgicalImgIdx = (surgicalImgIdx + dir + surgicalImgs.length) % surgicalImgs.length;
    const img = document.getElementById('surgicalModalImg');
    if (img) img.src = surgicalImgs[surgicalImgIdx];
}

// ── Main init ──
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('productModal');

    // Category pill filter
    const pills = document.querySelectorAll('.nutra-pill');
    const blocks = document.querySelectorAll('.nutra-category-block');

    pills.forEach(pill => {
        pill.addEventListener('click', function () {
            pills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const cat = this.dataset.category;
            blocks.forEach(block => {
                if (cat === 'all' || block.dataset.cat === cat) {
                    block.classList.remove('hidden');
                } else {
                    block.classList.add('hidden');
                }
            });
        });
    });

    // Open modal on product card click
    document.querySelectorAll('.nutra-product-card[data-product]').forEach(card => {
        card.addEventListener('click', function () {
            openModal(this.dataset.product);
        });
    });

    // Close modal
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    function openModal(productId) {
        const product = productData[productId];
        if (!product || !modal) return;

        document.getElementById('surgicalModalTag').textContent = product.tag || '';
        document.getElementById('surgicalModalName').textContent = product.name;
        document.getElementById('surgicalModalTagline').textContent = product.tagline;
        document.getElementById('surgicalModalDesc').textContent = product.description;

        // Features
        const featEl = document.getElementById('surgicalModalFeatures');
        if (featEl) featEl.innerHTML = product.features.map(f => `<li>${f}</li>`).join('');

        // Specs
        const specsEl = document.getElementById('surgicalModalSpecs');
        if (specsEl) {
            specsEl.innerHTML = Object.entries(product.specs).map(([k, v]) => `
                <div style="background:var(--bg-cream);padding:0.6rem 0.85rem;border-radius:10px;font-size:0.82rem;">
                    <span style="color:var(--text-muted);font-size:0.72rem;text-transform:uppercase;display:block;margin-bottom:.15rem;">${k}</span>
                    <span style="color:var(--text-dark);font-weight:600;">${v}</span>
                </div>`).join('');
        }

        // Carousel
        surgicalImgs = product.images || [];
        surgicalImgIdx = 0;
        const img = document.getElementById('surgicalModalImg');
        if (img) { img.src = surgicalImgs[0] || ''; img.alt = product.name; }

        const prevBtn = modal.querySelector('.nutra-modal-carousel-btn--prev');
        const nextBtn = modal.querySelector('.nutra-modal-carousel-btn--next');
        const showNav = surgicalImgs.length > 1;
        if (prevBtn) prevBtn.style.display = showNav ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = showNav ? 'flex' : 'none';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Expose globally for onclick attributes
    window.closeSurgicalModal = closeModal;
});
