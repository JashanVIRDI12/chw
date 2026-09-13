/**
 * CHW — B2B Enquiry Form
 * Wires every <form class="b2b-form">: enquiry-type tabs, URL prefill
 * (?type=quote&category=surgical&product=Syringes), country suggestions,
 * floating select labels and submission through EmailJS.
 *
 * EmailJS: the existing template (template_jwwwpzk) keeps receiving its
 * original variables (first_name, user_email, phone, company, country,
 * inquiry_type, message). All new B2B fields are also written into
 * `message`, so they arrive without any template change. They are sent
 * separately too (buyer_type, product_category, quantity, whatsapp)
 * for use once the template is updated.
 */
(function () {
    'use strict';

    var EMAILJS_PUBLIC_KEY = 'TjqiXbxf6gOXDaq0X';
    var EMAILJS_SERVICE = 'service_q0zwt6a';
    var EMAILJS_TEMPLATE = 'template_jwwwpzk';
    var FALLBACK_EMAIL = 'export@chw.co.in';

    var TYPES = {
        requirement: { label: 'Business Requirement', button: 'Send Requirement' },
        quote: { label: 'Request a Quote', button: 'Request Quote' },
        pricelist: { label: 'Export Price List Request', button: 'Request Export Price List' },
        distributor: { label: 'Distribution Partnership', button: 'Apply for Distributorship' },
        oem: { label: 'OEM / Private Label', button: 'Request OEM Consultation' },
        meeting: { label: 'Meeting Request — Vietnam Exhibition', button: 'Request a Meeting' },
        catalogue: { label: 'Catalogue Request', button: 'Request Catalogue' }
    };

    var CATEGORY_KEYS = {
        surgical: 'Surgical & Medical Products',
        nutra: 'Nutraceuticals',
        herbal: 'Wellness Vitantra / Herbal Products',
        oem: 'OEM / Private Label',
        multiple: 'Multiple Categories'
    };

    var BUYER_KEYS = {
        importer: 'Importer',
        distributor: 'Distributor',
        wholesaler: 'Wholesaler',
        hospital: 'Hospital',
        retail: 'Retail Chain',
        oem: 'OEM Buyer'
    };

    var COUNTRIES = ['Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria',
        'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Benin', 'Bhutan', 'Bolivia',
        'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia',
        'Cameroon', 'Canada', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Costa Rica', "Côte d'Ivoire", 'Croatia',
        'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominican Republic',
        'Ecuador', 'Egypt', 'El Salvador', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
        'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala', 'Guinea', 'Guyana', 'Haiti',
        'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
        'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
        'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
        'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Mongolia', 'Montenegro',
        'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
        'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea',
        'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
        'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
        'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden',
        'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Trinidad and Tobago',
        'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
        'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];

    if (window.emailjs && typeof window.emailjs.init === 'function') {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    document.querySelectorAll('form.b2b-form').forEach(initForm);

    function initForm(form) {
        var scope = form.closest('[data-b2b-enquiry]') || form.parentNode;
        var typeInput = form.elements.inquiryType;
        var submitBtn = form.querySelector('button[type="submit"]');
        var submitLabel = submitBtn.querySelector('.cf-submit-label');
        var status = form.querySelector('.cf-status');
        var tabs = scope.querySelectorAll('.inquiry-tab[data-type]');

        fillCountries(form);

        function setType(type) {
            if (!TYPES[type]) return;
            typeInput.value = type;
            if (submitLabel) submitLabel.textContent = TYPES[type].button;
            tabs.forEach(function (tab) {
                var on = tab.dataset.type === type;
                tab.classList.toggle('active', on);
                tab.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
            if (type === 'oem') setSelect(form.elements.category, CATEGORY_KEYS.oem, true);
            if (type === 'oem') setSelect(form.elements.buyerType, BUYER_KEYS.oem, true);
            if (type === 'distributor') setSelect(form.elements.buyerType, BUYER_KEYS.distributor, true);
        }

        tabs.forEach(function (tab) {
            tab.setAttribute('role', 'button');
            tab.setAttribute('tabindex', '0');
            tab.addEventListener('click', function () { setType(tab.dataset.type); });
            tab.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setType(tab.dataset.type); }
            });
        });

        // Floating labels for selects
        form.querySelectorAll('.cf-field select').forEach(function (select) {
            var sync = function () { select.parentNode.classList.toggle('is-filled', !!select.value); };
            select.addEventListener('change', sync);
            sync();
        });

        // Prefill from URL
        var params = new URLSearchParams(window.location.search);
        setType(params.get('type') || typeInput.value || 'requirement');
        if (CATEGORY_KEYS[params.get('category')]) {
            setSelect(form.elements.category, CATEGORY_KEYS[params.get('category')], false);
        }
        if (BUYER_KEYS[params.get('buyer')]) {
            setSelect(form.elements.buyerType, BUYER_KEYS[params.get('buyer')], false);
        }
        var product = params.get('product');
        if (product && form.elements.message && !form.elements.message.value) {
            form.elements.message.value = 'Product of interest: ' + product.slice(0, 80) + '\n';
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            hideStatus();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            var data = collect(form);
            var original = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

            var done = function () {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Enquiry Sent';
                submitBtn.classList.add('success');
                showStatus('success', 'Thank you, ' + data.fullName.split(' ')[0] +
                    '. Your enquiry has reached our export team — we reply within one business day.');
                form.reset();
                form.querySelectorAll('.cf-field').forEach(function (f) { f.classList.remove('is-filled'); });
                setType(data.inquiryType);
                setTimeout(function () {
                    submitBtn.innerHTML = original;
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                }, 4000);
            };

            var fail = function (err) {
                if (err) console.error('EmailJS error:', err);
                submitBtn.innerHTML = original;
                submitBtn.disabled = false;
                var mailto = 'mailto:' + FALLBACK_EMAIL + '?subject=' + encodeURIComponent('B2B Enquiry — ' + data.company) +
                    '&body=' + encodeURIComponent(data.summary);
                showStatus('error', 'We could not send the form just now. Please <a href="' + mailto +
                    '">email your requirement</a> to ' + FALLBACK_EMAIL + ' or WhatsApp +91 95603 69222.');
            };

            if (!window.emailjs || typeof window.emailjs.send !== 'function') {
                fail(new Error('EmailJS not loaded'));
                return;
            }

            window.emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
                first_name: data.fullName,
                last_name: '',
                user_email: data.email,
                phone: data.phone,
                whatsapp: data.phone,
                company: data.company,
                country: data.country,
                inquiry_type: TYPES[data.inquiryType] ? TYPES[data.inquiryType].label : data.inquiryType,
                buyer_type: data.buyerType,
                product_category: data.category,
                quantity: data.quantity || 'Not specified',
                customer_message: data.message || '—',
                page: window.location.pathname,
                message: data.summary
            }).then(done, fail);
        });

        function showStatus(kind, html) {
            if (!status) return;
            status.className = 'cf-status is-' + kind;
            status.innerHTML = html;
        }

        function hideStatus() {
            if (status) status.className = 'cf-status';
        }
    }

    function collect(form) {
        var val = function (name) {
            var el = form.elements[name];
            return el ? String(el.value || '').trim() : '';
        };
        var type = val('inquiryType');
        var data = {
            inquiryType: type,
            fullName: val('fullName'),
            company: val('company'),
            country: val('country'),
            email: val('email'),
            phone: val('phone'),
            buyerType: val('buyerType'),
            category: val('category'),
            quantity: val('quantity'),
            message: val('message')
        };
        data.summary = [
            'Enquiry type: ' + (TYPES[type] ? TYPES[type].label : type),
            'Buyer type: ' + data.buyerType,
            'Product category: ' + data.category,
            'Approximate quantity: ' + (data.quantity || 'Not specified'),
            '',
            'Name: ' + data.fullName,
            'Company: ' + data.company,
            'Country: ' + data.country,
            'Email: ' + data.email,
            'WhatsApp / Phone: ' + data.phone,
            '',
            'Message:',
            data.message || '—'
        ].join('\n');
        return data;
    }

    function setSelect(select, value, onlyIfEmpty) {
        if (!select || (onlyIfEmpty && select.value)) return;
        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value === value) {
                select.value = value;
                select.dispatchEvent(new Event('change'));
                return;
            }
        }
    }

    function fillCountries(form) {
        var input = form.querySelector('input[list]');
        if (!input) return;
        var list = document.getElementById(input.getAttribute('list'));
        if (!list || list.options.length) return;
        var frag = document.createDocumentFragment();
        COUNTRIES.forEach(function (name) {
            var opt = document.createElement('option');
            opt.value = name;
            frag.appendChild(opt);
        });
        list.appendChild(frag);
    }
})();
