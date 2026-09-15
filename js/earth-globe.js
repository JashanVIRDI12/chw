import * as THREE from "three";

/**
 * CHW — self-contained photorealistic Earth for .gm-visual.
 * Bundled as js/globe/earth-globe-standalone.js and used by js/globe-loader.js
 * when the React island cannot start (file:// or a mount failure).
 */
(function () {
    "use strict";

    var LOCAL_MAP = "images/globe/earth-web.jpg";

    var HQ = { lat: 28.54, lng: 77.39, label: "India - HQ", hub: true, labelOffset: { x: -92, y: -18 } };
    var MARKERS = [
        HQ,
        { lat: 24, lng: 45, label: "Middle East", labelOffset: { x: -108, y: -22 } },
        { lat: 4, lng: 22, label: "Africa", labelOffset: { x: -72, y: 12 } },
        { lat: 50, lng: 10, label: "Europe", labelOffset: { x: -28, y: -28 } },
        { lat: 23.7, lng: 90.4, label: "Asia", labelOffset: { x: 14, y: -22 } },
        { lat: 14, lng: 106, label: "SE Asia", target: true, labelOffset: { x: 14, y: 10 } },
        { lat: 48, lng: 68, label: "CIS", target: true, labelOffset: { x: -18, y: -28 } },
    ];

    var MARKER_DESCRIPTIONS = {
        "India - HQ": "India · CHW headquarters",
        "Middle East": "Middle East · Active market",
        "Africa": "Africa · Active market",
        "Europe": "Europe · Active market",
        "Asia": "Asia · Active market",
        "SE Asia": "Southeast Asia · Target market",
        "CIS": "CIS & Central Asia · Target market",
    };

    var HINT = "Drag to explore our export regions";
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function hasWebGL() {
        try {
            var canvas = document.createElement("canvas");
            return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
        } catch (err) {
            return false;
        }
    }

    function loadImageTexture(src, cors, srgb) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            if (cors) img.crossOrigin = "anonymous";
            img.onload = function () {
                var tex = new THREE.Texture(img);
                if (srgb && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
                tex.anisotropy = 8;
                tex.needsUpdate = true;
                resolve(tex);
            };
            img.onerror = function () {
                reject(new Error("Failed to load " + src));
            };
            img.src = src;
        });
    }

    function loadTextures() {
        return loadImageTexture(LOCAL_MAP, false, true);
    }

    function latLngToVector3(lat, lng, radius) {
        var phi = ((90 - lat) * Math.PI) / 180;
        var theta = ((lng + 180) * Math.PI) / 180;
        return new THREE.Vector3(
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    }

    function addArc(group, from, to, radius) {
        var start = latLngToVector3(from.lat, from.lng, radius * 1.014);
        var end = latLngToVector3(to.lat, to.lng, radius * 1.014);
        var distance = start.distanceTo(end);
        var currentAltitude = radius * (1.12 + (distance / (radius * 2)) * 0.1);
        var mid = start.clone().add(end).normalize().multiplyScalar(currentAltitude);
        var curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        var geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
        var line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
                color: 0xe8c98e,
                transparent: true,
                opacity: 0.75,
            })
        );
        group.add(line);
    }

    function addMarkers(group, radius, labelLayer, onHover) {
        return MARKERS.map(function (marker) {
            var pos = latLngToVector3(marker.lat, marker.lng, radius);
            var pin = new THREE.Mesh(
                new THREE.SphereGeometry(marker.hub ? 0.034 * radius : (marker.target ? 0.02 * radius : 0.022 * radius), 16, 16),
                new THREE.MeshBasicMaterial({
                    color: marker.target ? 0xffffff : 0xe8c98e,
                })
            );
            pin.position.copy(pos.clone().setLength(radius * 1.014));
            group.add(pin);

            if (marker.hub) {
                var halo = new THREE.Mesh(
                    new THREE.SphereGeometry(0.052 * radius, 24, 24),
                    new THREE.MeshBasicMaterial({
                        color: 0xe8c98e,
                        transparent: true,
                        opacity: 0.28,
                    })
                );
                halo.position.copy(pin.position);
                halo.userData.pulse = true;
                group.add(halo);
            }

            if (marker.target) {
                var normal = pos.clone().normalize();
                var ringQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
                var ring = new THREE.Mesh(
                    new THREE.RingGeometry(0.028 * radius, 0.042 * radius, 32),
                    new THREE.MeshBasicMaterial({
                        color: 0xc8a96e,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.95,
                    })
                );
                ring.position.copy(pin.position);
                ring.quaternion.copy(ringQuat);
                group.add(ring);
            }

            if (!marker.hub) addArc(group, HQ, marker, radius);

            var el = document.createElement("span");
            el.className = "gm-pin" + (marker.hub ? " is-hub" : "") + (marker.target ? " is-target" : "");
            el.innerHTML = "<b>" + marker.label + "</b>";
            labelLayer.appendChild(el);

            return {
                el: el,
                marker: marker,
                local: pos.clone().setLength(radius * 1.014),
            };
        });
    }

    function mount(host) {
        if (host.dataset.globeMounted === "true") return;
        host.dataset.globeMounted = "true";

        var radius = 1;
        var start = { x: 0.32, y: -2.65 };

        var mountNode = document.createElement("div");
        mountNode.className = "gm-globe";
        host.appendChild(mountNode);

        var caption = document.createElement("p");
        caption.className = "gm-globe__caption";
        caption.textContent = HINT;
        mountNode.appendChild(caption);

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
        camera.position.set(0, 0, 3.15);

        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        if (renderer.outputColorSpace && THREE.SRGBColorSpace) {
            renderer.outputColorSpace = THREE.SRGBColorSpace;
        }
        var labelLayer = document.createElement("div");
        labelLayer.className = "gm-globe__pins";
        mountNode.insertBefore(renderer.domElement, caption);
        mountNode.insertBefore(labelLayer, caption);

        var globe = new THREE.Group();
        globe.rotation.set(start.x, start.y, 0);
        scene.add(globe);

        // Balanced natural lighting
        scene.add(new THREE.AmbientLight(0xffffff, 1.2));
        var key = new THREE.DirectionalLight(0xffffff, 1.4);
        key.position.set(4.5, 2.5, 4.5);
        scene.add(key);
        var fill = new THREE.DirectionalLight(0x93c5fd, 0.7);
        fill.position.set(-4, 1.5, -3);
        scene.add(fill);
        var front = new THREE.DirectionalLight(0xffffff, 0.35);
        front.position.set(0, 2, 6);
        scene.add(front);

        var earth = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 64, 64),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        globe.add(earth);
        var pins = addMarkers(globe, radius, labelLayer);

        var target = { x: start.x, y: start.y };
        var current = { x: start.x, y: start.y };
        var dragging = false;
        var lastX = 0;
        var lastY = 0;
        var running = true;

        function sizeToHost() {
            var width = host.clientWidth || 480;
            var height = host.clientHeight || width;
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        sizeToHost();

        function abandonGlobe(reason) {
            console.warn("CHW globe: " + reason);
            host.classList.remove("is-globe-ready");
            running = false;
            if (mountNode.parentNode) mountNode.parentNode.removeChild(mountNode);
        }

        function textureIsVisible() {
            try {
                var gl = renderer.getContext();
                var pixels = new Uint8Array(4);
                gl.readPixels(
                    Math.floor(renderer.domElement.width / 2),
                    Math.floor(renderer.domElement.height / 2),
                    1,
                    1,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    pixels
                );
                return pixels[0] + pixels[1] + pixels[2] > 50;
            } catch (err) {
                return false;
            }
        }

        loadTextures()
            .then(function (map) {
                earth.material.color.set(0xffffff);
                earth.material.map = map;
                earth.material.needsUpdate = true;
                requestAnimationFrame(function () {
                    renderer.render(scene, camera);
                    if (!textureIsVisible()) {
                        abandonGlobe("Earth texture did not draw, keeping the static Earth.");
                        return;
                    }
                    host.classList.add("is-globe-ready");
                });
            })
            .catch(function (error) {
                abandonGlobe("textures unavailable, keeping the static Earth. " + error);
            });

        var canvas = renderer.domElement;

        canvas.addEventListener("pointerdown", function (event) {
            dragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
            canvas.setPointerCapture(event.pointerId);
        });

        canvas.addEventListener("pointermove", function (event) {
            if (!dragging) return;
            var dx = event.clientX - lastX;
            var dy = event.clientY - lastY;
            lastX = event.clientX;
            lastY = event.clientY;
            target.y += dx * 0.005;
            target.x = Math.max(-0.9, Math.min(0.9, target.x + dy * 0.005));
        });

        function endDrag(event) {
            dragging = false;
            if (event && canvas.hasPointerCapture(event.pointerId)) {
                canvas.releasePointerCapture(event.pointerId);
            }
        }

        canvas.addEventListener("pointerup", endDrag);
        canvas.addEventListener("pointercancel", endDrag);
        canvas.addEventListener("lostpointercapture", function () {
            dragging = false;
        });

        var clock = new THREE.Clock();

        function tick() {
            if (!running) return;
            requestAnimationFrame(tick);

            var elapsed = clock.getElapsedTime();
            if (!dragging && !reducedMotion) target.y += 0.0016;

            current.x += (target.x - current.x) * 0.1;
            current.y += (target.y - current.y) * 0.1;
            globe.rotation.set(current.x, current.y, 0);

            var camDir = camera.position.clone().normalize();
            globe.traverse(function (child) {
                if (child.userData.pulse) {
                    var pulse = 1 + Math.sin(elapsed * 2.4) * 0.28;
                    child.scale.setScalar(pulse);
                    child.material.opacity = 0.32 - (pulse - 1) * 0.35;
                }
            });

            var width = renderer.domElement.clientWidth;
            var height = renderer.domElement.clientHeight;
            globe.updateMatrixWorld();
            pins.forEach(function (pin) {
                var world = pin.local.clone().applyMatrix4(globe.matrixWorld);
                var facing = world.clone().normalize().dot(camDir);
                var projected = world.clone().project(camera);
                var offX = pin.marker.labelOffset ? pin.marker.labelOffset.x : (pin.marker.hub ? 14 : 10);
                var offY = pin.marker.labelOffset ? pin.marker.labelOffset.y : -50;
                var yUnit = typeof offY === "number" && Math.abs(offY) <= 100 ? "%" : "px";
                pin.el.style.transform =
                    "translate(" +
                    ((projected.x * 0.5 + 0.5) * width) +
                    "px," +
                    ((-projected.y * 0.5 + 0.5) * height) +
                    "px) translate(" + offX + "px, " + offY + yUnit + ")";
                pin.el.style.opacity = facing > 0.08 ? "1" : "0";
            });

            renderer.render(scene, camera);
        }

        tick();

        var ro = new ResizeObserver(sizeToHost);
        ro.observe(host);
    }

    function init() {
        var hosts = Array.prototype.slice.call(document.querySelectorAll(".gm-visual"));
        if (!hosts.length || !hasWebGL()) return;

        if (!("IntersectionObserver" in window)) {
            hosts.forEach(mount);
            return;
        }

        var io = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    io.unobserve(entry.target);
                    mount(entry.target);
                });
            },
            { rootMargin: "500px 0px" }
        );
        hosts.forEach(function (host) {
            io.observe(host);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
