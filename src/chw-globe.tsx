/**
 * CHW — Global Markets globe island.
 * Mounts <Globe3D> into every `.gm-visual` on the page once it scrolls near the
 * viewport. The inline SVG globe stays visible until WebGL, the component chunk
 * and the Earth textures are ready, and remains as the fallback if any of them fail.
 * React DOM and three.js are loaded lazily, so the upfront script stays small.
 */
import cssText from "./chw-globe.css?inline";
import { Component, useState, type ReactNode } from "react";
import type { Globe3DConfig, GlobeMarker } from "@/components/ui/3d-globe";

const TEXTURE = "images/globe/earth-blue-marble.jpg";
const BUMP = "images/globe/earth-bump.png";
const HQ = { lat: 28.54, lng: 77.39 }; // Greater Noida, India

// Marker art: a filled dot with a contrasting outline, padded so it reads as a small pin head.
function dot(fill: string, stroke: string, r: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="6"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const HQ_ICON = dot("#e8c98e", "#ffffff", 24);
const ACTIVE_ICON = dot("#e8c98e", "#01261a", 17);
const TARGET_ICON = dot("#ffffff", "#c8a96e", 15);

// Region markers use approximate regional centres, not specific cities.
const MARKERS: GlobeMarker[] = [
  { ...HQ, src: HQ_ICON, label: "India · CHW headquarters" },
  { lat: 24, lng: 45, src: ACTIVE_ICON, label: "Middle East · Active market" },
  { lat: 4, lng: 22, src: ACTIVE_ICON, label: "Africa · Active market" },
  { lat: 50, lng: 10, src: ACTIVE_ICON, label: "Europe · Active market" },
  { lat: 23.7, lng: 90.4, src: ACTIVE_ICON, label: "Asia · Active market" },
  { lat: 14, lng: 106, src: TARGET_ICON, label: "Southeast Asia · Target market" },
  { lat: 48, lng: 68, src: TARGET_ICON, label: "CIS & Central Asia · Target market" },
];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CONFIG: Globe3DConfig = {
  textureUrl: TEXTURE,
  bumpMapUrl: BUMP,
  bumpScale: 5,
  autoRotateSpeed: reducedMotion ? 0 : 0.25,
  // Start just east of India, tilted north; the slow auto-rotate then carries India
  // through the centre of the view and on towards the Middle East, Africa and Europe.
  initialRotation: { x: 0.35, y: (-(HQ.lng + 25 + 90) * Math.PI) / 180 },
  showAtmosphere: false,
  ambientIntensity: 0.9,
  pointLightIntensity: 1.6,
};

const HINT = "Drag to explore our export regions";

type Globe3DType = typeof import("@/components/ui/3d-globe").Globe3D;

class GlobeBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("CHW globe unavailable, showing static map instead.", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function GlobeIsland({ Globe3D, host }: { Globe3D: Globe3DType; host: HTMLElement }) {
  const [hovered, setHovered] = useState<GlobeMarker | null>(null);
  return (
    <GlobeBoundary onError={() => host.classList.remove("is-globe-ready")}>
      <Globe3D className="h-full w-full" markers={MARKERS} config={CONFIG} onMarkerHover={setHovered} />
      <p className="gm-globe__caption" aria-live="polite">
        {hovered?.label ?? HINT}
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

async function mount(host: HTMLElement) {
  if (host.dataset.globeMounted) return;
  host.dataset.globeMounted = "true";
  try {
    const [globe, reactDom] = await Promise.all([
      import("@/components/ui/3d-globe"),
      import("react-dom/client"),
      preloadImage(TEXTURE),
      preloadImage(BUMP),
    ]);
    injectStyles();
    const mountNode = document.createElement("div");
    mountNode.className = "gm-globe";
    host.appendChild(mountNode);
    reactDom.createRoot(mountNode).render(<GlobeIsland Globe3D={globe.Globe3D} host={host} />);
    requestAnimationFrame(() => host.classList.add("is-globe-ready"));
  } catch (error) {
    console.warn("CHW globe failed to load, keeping static map.", error);
  }
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
