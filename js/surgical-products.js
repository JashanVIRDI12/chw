/**
 * Surgical Products - Modal & Carousel Functionality
 */

// Product Data with all details
const productData = {
    'gauze-swab': {
        name: 'Gauze Swab',
        tagline: 'PureSwab',
        number: '01',
        tag: 'Sterile Available',
        description: 'Soft, sterile gauze swabs designed for effective wound cleaning and dressing. High absorbency helps manage fluids efficiently. Gentle on sensitive skin. Provides reliable protection during healing. Suitable for First aid and clinical use. Provides reliable protection during healing.',
        features: [
            'Smooth plunger glide with precise graduation markings for accurate dosing and safe injections.',
            'Ultra-smooth insertion with optimal flow design for low-pressure IV access.',
            'High absorbency for effective wound management',
            'Gentle on sensitive skin',
            'Available in sterile and non-sterile options'
        ],
        specs: {
            'Material': 'Soft Cotton, Strong Care',
            'Size': 'Multiple sizes available',
            'Packaging': 'Sterile packs',
            'Certification': 'GMP & ISO Certified'
        },
        useCase: 'High absorbency with soft, skin-friendly fabric for effective wound clearing and dressing.',
        images: [
            'images/Surgical Products/Gauze_Swab/Design B1.png',
            'images/Surgical Products/Gauze_Swab/Design B4.png',
            'images/Surgical Products/Gauze_Swab/Design B5.png',
            'images/Surgical Products/Gauze_Swab/Design B6.png'
        ]
    },
    'abdominal-sponges': {
        name: 'Abdominal Sponges',
        tagline: 'AbdomCare',
        number: '02',
        tag: 'Surgical Grade',
        description: 'Surgical abdominal sponges with superior absorbency and strength. Designed to manage fluids during procedures effectively. Reduces tissue irritation. Trusted for operating room and surgical applications.',
        features: [
            'Superior fluid absorption with strong fabric integrity for safe use during surgical procedures.',
            'High-capacity sponges engineered for smooth insertion and optimal patient comfort',
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
            'images/Surgical Products/Abdominal_Sponges/Design A1.png',
            'images/Surgical Products/Abdominal_Sponges/Design A2.png',
            'images/Surgical Products/Abdominal_Sponges/Design A3.png',
            'images/Surgical Products/Abdominal_Sponges/Design A4.png'
        ]
    },
    'gauze-than': {
        name: 'Gauze Than (Roll)',
        tagline: 'Softan',
        number: '03',
        tag: 'Medical Grade',
        description: 'Premium gauze rolls suitable for wound dressing and bandaging. Provides consistent breathable coverage. Made from flexible, breathable materials. Ideal for hospitals, clinics, and home care. Ensures hygienic and effective care.',
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
        useCase: 'Breathable and easy-to-wrap gauze rolls with consistent quality for comfortable and reliable wound dressing.',
        images: [
            'images/Surgical Products/Gauze_Than_(Roll)/Design B1.png',
            'images/Surgical Products/Gauze_Than_(Roll)/Design B2.png'
        ]
    },
    'gamjee-roll': {
        name: 'Gamjee Roll',
        tagline: 'GamRoll',
        number: '04',
        tag: 'High Absorbency',
        description: 'Premium gauze rolls suitable for wound dressing and bandaging. Provides consistent absorbent coverage. Made from high-quality cotton layers for added comfort. Helps protect injured areas and improves comfort during healing. Ideal for hospitals and home care.',
        features: [
            'Extra cushioning and padding support that protects wounds and improves comfort during recovery.',
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
            'images/Surgical Products/Gamjee_Roll/Design B1.png',
            'images/Surgical Products/Gamjee_Roll/Design B2.png',
            'images/Surgical Products/Gamjee_Roll/Design B3.png'
        ]
    },
    'gamjee-pad': {
        name: 'Gamjee Pad',
        tagline: 'GamjePro',
        number: '05',
        tag: 'Sterile Pack',
        description: 'Highly absorbent gamjee pads designed for effective wound protection. Soft and cushioned to enhance patient comfort. Helps prevent leakage and supports faster healing. Ideal for surgical and general dressing needs.',
        features: [
            'Highly absorbent pads cushioned and designed to prevent leakage and support faster healing.',
            'Soft cushioning for wound protection',
            'Highly absorbent core',
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
            'images/Surgical Products/Gamjee_Pad/Design A2.png',
            'images/Surgical Products/Gamjee_Pad/Design A3.png',
            'images/Surgical Products/Gamjee_Pad/Design B11.png',
            'images/Surgical Products/Gamjee_Pad/Design B3.png'
        ]
    },
    'absorbent-cotton-gauze': {
        name: 'Absorbent Cotton Gauze',
        tagline: 'Absorb Gauze',
        number: '06',
        tag: '100% Cotton',
        description: 'Made from high-quality cotton for maximum absorbency. Soft, breathable, and gentle on sensitive skin. Suitable for wound cleaning, dressing, and packing. Ensures hygienic and effective care.',
        features: [
            'Premium cotton softness with maximum absorbency for gentle yet effective wound care.',
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
            'images/Surgical Products/Absorbent_Cotton_Gauze/WhatsApp Image 2026-02-10 at 3.12.19 PM.jpeg',
            'images/Surgical Products/Absorbent_Cotton_Gauze/WhatsApp Image 2026-02-10 at 3.19.02 PM (1).jpeg',
            'images/Surgical Products/Absorbent_Cotton_Gauze/WhatsApp Image 2026-02-10 at 3.19.02 PM.jpeg'
        ]
    },
    'elastic-adhesive-bandage': {
        name: 'Elastic Adhesive Bandage',
        tagline: 'StickerPro',
        number: '07',
        tag: 'Self-Adhesive',
        description: 'Flexible elastic adhesive bandages that provide secure support. Stretches comfortably with body movement while staying in place. Ideal for fixation, compression, and joint support. Designed for long-lasting adhesion.',
        features: [
            'Strong sticking power with stretchable comfort for secure fixation and flexible movement.',
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
            'images/Surgical Products/Elastic_Adhesive_Bandage/Design B2.png',
            'images/Surgical Products/Elastic_Adhesive_Bandage/Design B3.png'
        ]
    },
    'cotton-crepe-bandage': {
        name: 'Cotton Crepe Bandage',
        tagline: 'CrepePro',
        number: '08',
        tag: 'Reusable',
        description: 'Cotton crepe bandages offer controlled compression and firm support. Lightweight and breathable for extended wear. Suitable for sprains, strains, and post-injury support. Ensures hygienic and effective care.',
        features: [
            'Balanced compression and breathable cotton comfort for sprain support and swelling control.',
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
            'images/Surgical Products/Cotton_Crepe_Bandage/Design A1.png',
            'images/Surgical Products/Cotton_Crepe_Bandage/Design A2.png'
        ]
    },
    'syringes': {
        name: 'Syringes',
        tagline: 'Erecta',
        number: '09',
        tag: 'Single Use',
        description: 'Our syringes are designed for accuracy dosing and smooth injection. Manufactured using medical-grade materials to ensure safety and reliability. Clear barrel markings for precise graduation. Suitable for clinical, labs, and hospital use.',
        features: [
            'Smooth plunger glide with precise graduation markings for accurate dosing and safe injections.',
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
            'images/Surgical Products/Syringes/Design A2.png',
            'images/Surgical Products/Syringes/Design A5.png',
            'images/Surgical Products/Syringes/Design A6.png'
        ]
    },
    'cannulas': {
        name: 'Cannulas',
        tagline: 'FlowCath',
        number: '10',
        tag: 'Multiple Sizes',
        description: 'High-quality cannulas engineered for smooth insertion and optimal patient comfort. Made from flexible, biocompatible materials. Ensures reliable IV access. Suitable for emergency care and routine insertion. Trusted by healthcare professionals.',
        features: [
            'Ultra-smooth insertion with optimal flow design for low-pressure IV access.',
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
            'images/Surgical Products/Cannulas/Design A2.png',
            'images/Surgical Products/Cannulas/Design A3.png',
            'images/Surgical Products/Cannulas/Design A4.png',
            'images/Surgical Products/Cannulas/Design A5.png'
        ]
    },
    'examination-gloves': {
        name: 'Examination Gloves',
        tagline: 'HandsaPro',
        number: '11',
        tag: 'Powder-Free',
        description: 'Disposable examination gloves provide reliable barrier protection. Designed for comfort, flexibility, and tactile sensitivity. Helps maintain hygienic during medical examinations. Suitable for clinics, labs, and general healthcare settings.',
        features: [
            'Comfort-fit barrier protection with enhanced tactile sensitivity for safe examinations.',
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
            'images/Surgical Products/Examination_Gloves/Design A2.png',
            'images/Surgical Products/Examination_Gloves/Design A3.png',
            'images/Surgical Products/Examination_Gloves/Design A4.png'
        ]
    },
    'surgical-gloves': {
        name: 'Surgical Gloves',
        tagline: 'ProGlove',
        number: '12',
        tag: 'Sterile',
        description: 'Sterile, high-durability gloves with superior grip and tactile control. Tested for strength and pin-hole integrity. Ensures maximum hygiene during critical surgical procedures. Trusted protection for surgeons and operating room staff.',
        features: [
            'Sterile, high-durability protection with precision grip for critical surgical performance.',
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
            'images/Surgical Products/Surgical_Gloves/Design A1.png',
            'images/Surgical Products/Surgical_Gloves/Design A2.png',
            'images/Surgical Products/Surgical_Gloves/Design A3.png',
            'images/Surgical Products/Surgical_Gloves/Design A4.png'
        ]
    }
};

// Modal and Carousel functionality
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('productModal');
    const productCards = document.querySelectorAll('.product-card-enhanced');
    const closeButtons = document.querySelectorAll('.modal-close, .modal-close-btn');

    let currentImageIndex = 0;
    let currentProductImages = [];

    // Open modal when product card is clicked
    productCards.forEach(card => {
        const viewBtn = card.querySelector('.view-details-btn');
        viewBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = card.getAttribute('data-product');
            openModal(productId);
        });

        // Also allow clicking the card itself
        card.addEventListener('click', function (e) {
            if (!e.target.closest('.view-details-btn')) {
                const productId = card.getAttribute('data-product');
                openModal(productId);
            }
        });
    });

    // Close modal
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Carousel navigation
    document.querySelector('.carousel-prev').addEventListener('click', () => {
        navigateCarousel(-1);
    });

    document.querySelector('.carousel-next').addEventListener('click', () => {
        navigateCarousel(1);
    });

    // Keyboard navigation for carousel
    document.addEventListener('keydown', function (e) {
        if (modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                navigateCarousel(-1);
            } else if (e.key === 'ArrowRight') {
                navigateCarousel(1);
            }
        }
    });

    function openModal(productId) {
        const product = productData[productId];
        if (!product) return;

        // Populate modal content
        document.querySelector('.modal-product-number').textContent = product.number;
        document.querySelector('.modal-product-name').textContent = product.name;
        document.querySelector('.modal-product-tagline').textContent = product.tagline;
        document.querySelector('.modal-product-tag').textContent = product.tag;
        document.querySelector('.modal-description').textContent = product.description;
        document.querySelector('.modal-use-case').textContent = product.useCase;

        // Populate features
        const featuresList = document.querySelector('.modal-features');
        featuresList.innerHTML = '';
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle"></i> ${feature}`;
            featuresList.appendChild(li);
        });

        // Populate specifications
        const specsDiv = document.querySelector('.modal-specs');
        specsDiv.innerHTML = '';
        Object.entries(product.specs).forEach(([key, value]) => {
            const specItem = document.createElement('div');
            specItem.className = 'spec-item';
            specItem.innerHTML = `<strong>${key}:</strong> <span>${value}</span>`;
            specsDiv.appendChild(specItem);
        });

        // Setup carousel
        currentProductImages = product.images;
        currentImageIndex = 0;
        setupCarousel();

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function setupCarousel() {
        const carouselContainer = document.querySelector('.carousel-images');
        const indicatorsContainer = document.querySelector('.carousel-indicators');

        // Clear existing content
        carouselContainer.innerHTML = '';
        indicatorsContainer.innerHTML = '';

        // Add images
        currentProductImages.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `Product image ${index + 1}`;
            img.className = index === 0 ? 'active' : '';
            carouselContainer.appendChild(img);

            // Add indicator
            const indicator = document.createElement('button');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        // Update carousel visibility
        updateCarouselButtons();
    }

    function navigateCarousel(direction) {
        currentImageIndex += direction;

        // Loop around
        if (currentImageIndex < 0) {
            currentImageIndex = currentProductImages.length - 1;
        } else if (currentImageIndex >= currentProductImages.length) {
            currentImageIndex = 0;
        }

        updateCarousel();
    }

    function goToSlide(index) {
        currentImageIndex = index;
        updateCarousel();
    }

    function updateCarousel() {
        const images = document.querySelectorAll('.carousel-images img');
        const indicators = document.querySelectorAll('.carousel-indicator');

        images.forEach((img, index) => {
            img.classList.toggle('active', index === currentImageIndex);
        });

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentImageIndex);
        });

        updateCarouselButtons();
    }

    function updateCarouselButtons() {
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');

        // Show/hide buttons based on number of images
        if (currentProductImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }
});
