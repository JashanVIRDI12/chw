/**
 * CHW — Global Markets globe island.
 * Mounts <Globe3D> into every `.gm-visual` on the page once it scrolls near the
 * viewport. The CSS Earth stays visible until WebGL, the component chunk
 * and the Earth textures are ready. If any of those fail, js/globe-loader.js
 * switches to the local Three.js bundle instead of leaving the flat animation.
 * React DOM and three.js are loaded lazily, so the upfront script stays small.
 */
import cssText from "./chw-globe.css?inline";
import { Component, useState, type ReactNode } from "react";
import type { Globe3DConfig, GlobeMarker } from "@/components/ui/3d-globe";

const TEXTURE = "images/globe/earth-blue-marble.jpg";
const TEXTURE_FALLBACK = "images/globe/earth-web.jpg";
const BUMP = "images/globe/earth-bump.png";

const HQ: GlobeMarker = {
  lat: 28.54,
  lng: 77.39,
  label: "India - HQ",
  hub: true,
  labelOffset: { x: 36, y: -14 },
};

// Region markers matching target visual design
const MARKERS: GlobeMarker[] = [
  HQ,
  { lat: 24, lng: 45, label: "Middle East", labelOffset: { x: -8, y: -22 } },
  { lat: 4, lng: 22, label: "Africa", labelOffset: { x: -32, y: 0 } },
  { lat: 50, lng: 10, label: "Europe", labelOffset: { x: 0, y: -22 } },
  { lat: 23.7, lng: 90.4, label: "Asia", labelOffset: { x: 26, y: -16 } },
  { lat: 14, lng: 106, label: "SE Asia", target: true, labelOffset: { x: 34, y: 0 } },
  { lat: 48, lng: 68, label: "CIS", target: true, labelOffset: { x: 0, y: -22 } },
];

const MARKER_DESCRIPTIONS: Record<string, string> = {
  "India - HQ": "India · CHW headquarters",
  "Middle East": "Middle East · Active market",
  "Africa": "Africa · Active market",
  "Europe": "Europe · Active market",
  "Asia": "Asia · Active market",
  "SE Asia": "Southeast Asia · Target market",
  "CIS": "CIS & Central Asia · Target market",
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const BASE_CONFIG: Globe3DConfig = {
  bumpScale: 1,
  autoRotateSpeed: reducedMotion ? 0 : 0.22,
  // Tilted north and oriented so India, Middle East, Europe, Africa, Asia, SE Asia and CIS are all in view
  initialRotation: { x: 0.32, y: -2.65 },
  showAtmosphere: false,
  ambientIntensity: 1.2,
  pointLightIntensity: 1.4,
  showArcs: true,
  arcColor: "#e8c98e",
  arcOpacity: 0.75,
};

const HINT = "Drag to explore our export regions";

type Globe3DType = typeof import("@/components/ui/3d-globe").Globe3D;

function failHost(host: HTMLElement, error: unknown) {
  const mountNode = host.querySelector(".gm-globe");
  if (mountNode) mountNode.remove();
  delete host.dataset.globeMounted;
  host.classList.remove("is-globe-ready");
  console.warn("CHW globe unavailable, trying local 3D fallback.", error);
  window.dispatchEvent(new CustomEvent("chw-globe:failed", { detail: { host } }));
}

class GlobeBoundary extends Component<{ onError: (error: unknown) => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    this.props.onError(error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function GlobeIsland({
  Globe3D,
  host,
  config,
}: {
  Globe3D: Globe3DType;
  host: HTMLElement;
  config: Globe3DConfig;
}) {
  const [hovered, setHovered] = useState<GlobeMarker | null>(null);
  const captionText = hovered?.label ? (MARKER_DESCRIPTIONS[hovered.label] ?? hovered.label) : HINT;

  return (
    <GlobeBoundary onError={(error) => failHost(host, error)}>
      <Globe3D className="h-full w-full" markers={MARKERS} config={config} onMarkerHover={setHovered} />
      <p className="gm-globe__caption" aria-live="polite">
        {captionText}
      </p>
    </GlobeBoundary>
  );
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function preloadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

function injectStyles() {
  if (document.getElementById("chw-globe-styles")) return;
  const style = document.createElement("style");
  style.id = "chw-globe-styles";
  style.textContent = cssText;
  document.head.appendChild(style);
}

async function resolveTextures(): Promise<Globe3DConfig> {
  try {
    await preloadImage(TEXTURE);
    try {
      await preloadImage(BUMP);
      return { ...BASE_CONFIG, textureUrl: TEXTURE, bumpMapUrl: BUMP };
    } catch {
      return { ...BASE_CONFIG, textureUrl: TEXTURE, bumpMapUrl: TEXTURE };
    }
  } catch {
    await preloadImage(TEXTURE_FALLBACK);
    return { ...BASE_CONFIG, textureUrl: TEXTURE_FALLBACK, bumpMapUrl: TEXTURE_FALLBACK };
  }
}

async function mount(host: HTMLElement) {
  if (host.dataset.globeMounted) return;
  host.dataset.globeMounted = "pending";
  try {
    const [globe, reactDom, config] = await Promise.all([
      import("@/components/ui/3d-globe"),
      import("react-dom/client"),
      resolveTextures(),
    ]);
    injectStyles();
    const mountNode = document.createElement("div");
    mountNode.className = "gm-globe";
    host.appendChild(mountNode);
    host.dataset.globeMounted = "true";
    reactDom.createRoot(mountNode).render(
      <GlobeIsland Globe3D={globe.Globe3D} host={host} config={config} />,
    );
    waitUntilDrawn(host);
  } catch (error) {
    failHost(host, error);
  }
}

function waitUntilDrawn(host: HTMLElement) {
  const started = Date.now();
  const tick = () => {
    const loading = /\bLoading globe/.test(host.textContent || "");
    const canvas = host.querySelector("canvas");
    if (canvas && !loading) {
      host.classList.add("is-globe-ready");
      return;
    }
    if (Date.now() - started > 12000) {
      if (canvas) host.classList.add("is-globe-ready");
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function init() {
  const hosts = Array.from(document.querySelectorAll<HTMLElement>(".gm-visual"));
  if (!hosts.length || !hasWebGL()) return;

  if (!("IntersectionObserver" in window)) {
    hosts.forEach(mount);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        mount(entry.target as HTMLElement);
      });
    },
    { rootMargin: "400px 0px" },
  );
  hosts.forEach((host) => io.observe(host));
}

init();
