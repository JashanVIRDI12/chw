/**
 * CHW globe loader.
 *
 * The React island (chw-globe.js) splits React and react-dom into two copies,
 * which crashes with "Cannot read properties of null (reading 'useState')"
 * and leaves the CSS map on screen. The live globe is the vanilla Three.js
 * bundle, which owns one WebGL scene and its own HTML labels.
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

    var script = document.createElement("script");
    script.src = base + "globe/earth-globe-standalone.js" + query;
    script.async = true;
    script.onerror = function () {
        console.warn("CHW globe: 3D globe failed to load.");
    };
    (document.head || document.documentElement).appendChild(script);
})();
