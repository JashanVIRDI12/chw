/**
 * Chase Healthcare Theme — Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       NAVBAR SCROLL
    ========================================================= */
    const navbar = document.querySelector('.navbar');
    const isHome = document.querySelector('.hero-slider') !== null;

    if (navbar) {
        if (!isHome) {
            navbar.classList.add('scrolled');
        }

        const onScroll = () => {
            if (isHome) {
                navbar.classList.toggle('scrolled', window.scrollY > 30);
            } else {
                navbar.classList.add('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* =========================================================
       MOBILE NAV — full drawer with sub-menus
    ========================================================= */
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Build overlay backdrop once
    let backdrop = document.querySelector('.mobile-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'mobile-backdrop';
        document.body.appendChild(backdrop);
    }

    function openNav() {
        // Push backdrop below the navbar so it only dims page content
        const navH = navbar ? navbar.offsetHeight : 70;
        backdrop.style.top = navH + 'px';

        navMenu.classList.add('mobile-open');
        mobileToggle.classList.add('is-open');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Make navbar solid so dark backdrop can't bleed through the glass
        navbar?.classList.add('nav-is-open');
        // icon: bars → X
        const icon = mobileToggle.querySelector('i');
        if (icon) { icon.className = 'fas fa-times'; }
    }

    function closeNav() {
        navMenu.classList.remove('mobile-open');
        mobileToggle.classList.remove('is-open');
        backdrop.classList.remove('active');
        backdrop.style.top = '';
        document.body.style.overflow = '';
        navbar?.classList.remove('nav-is-open');
        const icon = mobileToggle.querySelector('i');
        if (icon) { icon.className = 'fas fa-bars'; }
        // collapse all sub-menus
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('mob-open'));
    }

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.contains('mobile-open') ? closeNav() : openNav();
        });
    }

    backdrop.addEventListener('click', closeNav);

    // Close nav when any final link (non-trigger) is clicked
    navMenu?.querySelectorAll('a:not(.nav-dropdown-trigger)').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Mobile sub-menu accordion (tap trigger to expand)
    document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            // Only intercept on mobile
            if (window.innerWidth > 900) return;
            e.preventDefault();
            const dropdown = this.closest('.nav-dropdown');
            const isOpen = dropdown.classList.contains('mob-open');
            // close others
            document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('mob-open'));
            if (!isOpen) dropdown.classList.add('mob-open');
        });
    });

    /* =========================================================
       HERO GRID SPOTLIGHT
    ========================================================= */
    const heroHome = document.querySelector('.hero-home');
    const gridGlow = document.getElementById('gridGlow');
    const heroGrid = document.querySelector('.hero-grid');

    if (heroHome && gridGlow && heroGrid) {
        heroHome.addEventListener('mousemove', (e) => {
            const rect = heroHome.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            gridGlow.style.left = x + 'px';
            gridGlow.style.top = y + 'px';
            heroGrid.style.setProperty('--mouse-x', x + 'px');
            heroGrid.style.setProperty('--mouse-y', y + 'px');
        });
    }

    /* =========================================================
       ACCORDION
    ========================================================= */
    const accordionItems = Array.from(document.querySelectorAll('.accordion-item'));

    const setAccordionItemOpen = (item, open) => {
        const content = item.querySelector('.accordion-content');
        if (!content) return;
        if (open) {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            item.classList.remove('active');
            content.style.maxHeight = '0px';
        }
    };

    accordionItems.forEach(item => {
        setAccordionItemOpen(item, item.classList.contains('active'));
    });

    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            if (!item) return;
            const wasActive = item.classList.contains('active');
            accordionItems.forEach(i => setAccordionItemOpen(i, false));
            setAccordionItemOpen(item, !wasActive);
        });
    });

    /* =========================================================
       CATEGORY NAV
    ========================================================= */
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    /* =========================================================
       SMOOTH SCROLL
    ========================================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    /* =========================================================
       CONTACT FORM
    ========================================================= */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending…';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }

});
