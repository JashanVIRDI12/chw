/**
 * CHW globe loader.
 *
 * Served pages load the React 3D island (js/globe/chw-globe.js). If that
 * module cannot start — file://, missing chunks, or a later mount failure —
 * this falls back to the local Three.js bundle instead of leaving the CSS
 * Earth animation on screen.
 */
(function () {
    "use strict";

    var loader = document.currentScript;
    var base = "js/";
    var query = "";
    if (loader && loader.src) {
        var src = loader.src;
        var q = src.indexOf("?");
        query = q === -1 ? "" : src.slice(q);
        base = src.slice(0, src.lastIndexOf("/") + 1);
    }

    var MODULE = base + "globe/chw-globe.js";
    var STANDALONE = base + "globe/earth-globe-standalone.js" + query;
    var startedStandalone = false;

    function loadStandalone() {
        if (startedStandalone) return Promise.resolve();
        startedStandalone = true;

        return new Promise(function (resolve, reject) {
            var script = document.createElement("script");
            script.src = STANDALONE;
            script.async = true;
            script.onload = function () {
                resolve();
            };
            script.onerror = function () {
                console.warn("CHW globe: local 3D fallback failed to load.");
                reject(new Error("standalone load failed"));
            };
            (document.head || document.documentElement).appendChild(script);
        });
    }

    function importModule(url) {
        try {
            return new Function("u", "return import(u)")(url);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    function useLocalFallback(reason) {
        console.warn("CHW globe: React island unavailable, using local 3D fallback.", reason);
        return loadStandalone();
    }

    window.addEventListener("chw-globe:failed", function () {
        useLocalFallback("mount failed");
    });

    importModule(MODULE).catch(useLocalFallback);
})();
