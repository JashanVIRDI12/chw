/**
 * CHW — B2B pages: scroll reveal for .rv elements.
 * The page adds `rv-ready` to <html> in <head>, so content stays
 * visible if this script never runs.
 */
(function () {
    'use strict';

    var els = document.querySelectorAll('.rv');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('is-in'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { io.observe(el); });
})();
