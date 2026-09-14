"use client";
import React, { useRef, useMemo, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface GlobeMarker {
  lat: number;
  lng: number;
  label?: string;
  hub?: boolean;
  target?: boolean;
  src?: string;
  size?: number;
  labelOffset?: { x?: number; y?: number };
}

export interface Globe3DConfig {
  /** Globe radius */
  radius?: number;
  /** Globe base color (used as fallback or tint) */
  globeColor?: string;
  /** URL to the Earth texture map */
  textureUrl?: string;
  /** URL to the bump/elevation map for terrain */
  bumpMapUrl?: string;
  /** Whether to show atmosphere glow */
  showAtmosphere?: boolean;
  /** Atmosphere color */
  atmosphereColor?: string;
  /** Atmosphere intensity */
  atmosphereIntensity?: number;
  /** Atmosphere blur/softness */
  atmosphereBlur?: number;
  /** Terrain bump scale (0 = flat, higher = more pronounced) */
  bumpScale?: number;
  /** Auto rotate speed (0 = disabled) */
  autoRotateSpeed?: number;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Enable pan */
  enablePan?: boolean;
  /** Min zoom distance */
  minDistance?: number;
  /** Max zoom distance */
  maxDistance?: number;
  /** Initial rotation */
  initialRotation?: { x: number; y: number };
  /** Marker default size */
  markerSize?: number;
  /** Show wireframe overlay */
  showWireframe?: boolean;
  /** Wireframe color */
  wireframeColor?: string;
  /** Ambient light intensity */
  ambientIntensity?: number;
  /** Point light intensity */
  pointLightIntensity?: number;
  /** Background color (null for transparent) */
  backgroundColor?: string | null;
  /** Whether to show export arcs */
  showArcs?: boolean;
  /** Export arc line color */
  arcColor?: string;
  /** Export arc opacity */
  arcOpacity?: number;
}

interface Globe3DProps {
  /** Array of markers to display on the globe */
  markers?: GlobeMarker[];
  /** Globe configuration */
  config?: Globe3DConfig;
  /** Additional CSS classes */
  className?: string;
  /** Callback when a marker is clicked */
  onMarkerClick?: (marker: GlobeMarker) => void;
  /** Callback when a marker is hovered */
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

// ============================================================================
// Constants - Earth Texture URLs (NASA Blue Marble)
// ============================================================================

const DEFAULT_EARTH_TEXTURE = "images/globe/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE = "images/globe/earth-bump.png";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert latitude/longitude to 3D cartesian coordinates
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// ============================================================================
// Marker Component
// ============================================================================

interface MarkerProps {
  marker: GlobeMarker;
  radius: number;
  onClick?: (marker: GlobeMarker) => void;
  onHover?: (marker: GlobeMarker | null) => void;
}

function Marker({ marker, radius, onClick, onHover }: MarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const haloRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const surfacePos = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.014);
  }, [marker.lat, marker.lng, radius]);

  // Surface normal quaternion for target ring
  const ringQuaternion = useMemo(() => {
    const normal = surfacePos.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [surfacePos]);

  // Visibility and pulse animation
  useFrame((state) => {
    if (!markerRef.current) return;
    const worldPos = new THREE.Vector3();
    markerRef.current.getWorldPosition(worldPos);

    const markerDir = worldPos.clone().normalize();
    const camDir = camera.position.clone().normalize();
    const dot = markerDir.dot(camDir);

    setIsVisible(dot > 0.08);

    // Pulse animation for HQ hub
    if (marker.hub && haloRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const pulse = 1 + Math.sin(elapsed * 2.4) * 0.28;
      haloRef.current.scale.setScalar(pulse);
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.32 - (pulse - 1) * 0.35;
      }
    }
  });

  const handlePointerEnter = useCallback(() => {
    setHovered(true);
    onHover?.(marker);
  }, [marker, onHover]);

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    onHover?.(null);
  }, [onHover]);

  const handleClick = useCallback(() => {
    onClick?.(marker);
  }, [marker, onClick]);

  const offX = marker.labelOffset?.x ?? (marker.hub ? 26 : 0);
  const offY = marker.labelOffset?.y ?? (marker.hub ? -14 : -20);
  const offYStr = typeof offY === "number" && Math.abs(offY) <= 100 ? `${offY}px` : `${offY}`;

  return (
    <group ref={markerRef} position={surfacePos} visible={isVisible}>
      {/* Interactive hit area */}
      <mesh
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        visible={false}
      >
        <sphereGeometry args={[radius * 0.07, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {marker.hub ? (
        // HQ Hub Marker: larger gold sphere + pulsing halo
        <>
          <mesh ref={haloRef}>
            <sphereGeometry args={[radius * 0.052, 24, 24]} />
            <meshBasicMaterial color="#e8c98e" transparent opacity={0.28} />
          </mesh>
          <mesh>
            <sphereGeometry args={[radius * 0.034, 24, 24]} />
            <meshBasicMaterial color={hovered ? "#fff2c6" : "#e8c98e"} />
          </mesh>
        </>
      ) : marker.target ? (
        // Target Market: white center dot + gold concentric ring
        <>
          <mesh>
            <sphereGeometry args={[radius * 0.02, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh quaternion={ringQuaternion}>
            <ringGeometry args={[radius * 0.028, radius * 0.042, 32]} />
            <meshBasicMaterial
              color="#c8a96e"
              side={THREE.DoubleSide}
              transparent
              opacity={0.95}
            />
          </mesh>
        </>
      ) : (
        // Active Market: gold sphere
        <mesh>
          <sphereGeometry args={[radius * 0.022, 16, 16]} />
          <meshBasicMaterial color={hovered ? "#fff2c6" : "#e8c98e"} />
        </mesh>
      )}

      {/* Label positioned on screen relative to marker dot */}
      {marker.label && (
        <Html
          position={[0, 0, 0]}
          center
          style={{
            pointerEvents: "none",
            userSelect: "none",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.2s ease-out",
          }}
        >
          <div
            className={marker.hub ? "gm-globe-label is-hub" : "gm-globe-label"}
            style={{
              transform: `translate(${offX}px, ${offYStr})`,
              whiteSpace: "nowrap",
              fontFamily: "var(--b2b-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
              fontSize: marker.hub ? "0.78rem" : "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.015em",
              color: marker.hub ? "#fde68a" : "#ffffff",
              textShadow:
                "0 0 5px rgba(1, 38, 26, 0.95), 0 1px 3px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.75)",
            }}
          >
            {marker.label}
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================================================
// Export Arcs Component
// ============================================================================

interface ExportArcsProps {
  hub: GlobeMarker;
  destinations: GlobeMarker[];
  radius: number;
  color?: string;
  opacity?: number;
}

function ExportArcs({
  hub,
  destinations,
  radius,
  color = "#e8c98e",
  opacity = 0.75,
}: ExportArcsProps) {
  const lineObjects = useMemo(() => {
    const hubPos = latLngToVector3(hub.lat, hub.lng, radius * 1.014);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: opacity,
    });

    return destinations.map((dest) => {
      const destPos = latLngToVector3(dest.lat, dest.lng, radius * 1.014);
      const distance = hubPos.distanceTo(destPos);
      const currentAltitude = radius * (1.12 + (distance / (radius * 2)) * 0.1);
      const mid = hubPos.clone().add(destPos).normalize().multiplyScalar(currentAltitude);
      const curve = new THREE.QuadraticBezierCurve3(hubPos, mid, destPos);
      const points = curve.getPoints(48);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geometry, material);
    });
  }, [hub, destinations, radius, color, opacity]);

  return (
    <group>
      {lineObjects.map((lineObj, i) => (
        <primitive key={`export-arc-${i}`} object={lineObj} />
      ))}
    </group>
  );
}

// ============================================================================
// Rotating Globe with Markers & Arcs
// ============================================================================

interface RotatingGlobeProps {
  config: Required<Globe3DConfig>;
  markers: GlobeMarker[];
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function RotatingGlobe({
  config,
  markers,
  onMarkerClick,
  onMarkerHover,
}: RotatingGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load Earth textures
  const [earthTexture, bumpTexture] = useTexture([
    config.textureUrl,
    config.bumpMapUrl,
  ]);

  // Configure textures
  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 16;
    }
    if (bumpTexture) {
      bumpTexture.anisotropy = 8;
    }
  }, [earthTexture, bumpTexture]);

  // Create geometries
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius, 64, 64);
  }, [config.radius]);

  const wireframeGeometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius * 1.002, 32, 16);
  }, [config.radius]);

  // Separate hub marker and destinations for connecting arcs
  const hubMarker = useMemo(() => markers.find((m) => m.hub) || markers[0], [markers]);
  const destMarkers = useMemo(
    () => markers.filter((m) => m !== hubMarker),
    [markers, hubMarker],
  );

  return (
    <group
      ref={groupRef}
      rotation={[config.initialRotation.x, config.initialRotation.y, 0]}
    >
      {/* Main globe mesh with Earth texture */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={config.bumpScale * 0.04}
          roughness={0.65}
          metalness={0.02}
        />
      </mesh>

      {/* Wireframe overlay if configured */}
      {config.showWireframe && (
        <mesh geometry={wireframeGeometry}>
          <meshBasicMaterial
            color={config.wireframeColor}
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      )}

      {/* Export flight/shipping arcs */}
      {config.showArcs && hubMarker && (
        <ExportArcs
          hub={hubMarker}
          destinations={destMarkers}
          radius={config.radius}
          color={config.arcColor}
          opacity={config.arcOpacity}
        />
      )}

      {/* Region Markers */}
      {markers.map((marker, index) => (
        <Marker
          key={`marker-${index}-${marker.lat}-${marker.lng}`}
          marker={marker}
          radius={config.radius}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Scene Component
// ============================================================================

interface SceneProps {
  markers: GlobeMarker[];
  config: Required<Globe3DConfig>;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function Scene({ markers, config, onMarkerClick, onMarkerHover }: SceneProps) {
  const { camera } = useThree();

  // Set initial camera position
  React.useEffect(() => {
    camera.position.set(0, 0, config.radius * 3.15);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  return (
    <>
      {/* Ambient Lighting - bright and natural */}
      <ambientLight intensity={config.ambientIntensity} color="#ffffff" />

      {/* Main sunlight / Key light */}
      <directionalLight
        position={[config.radius * 4.5, config.radius * 2.5, config.radius * 4.5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />

      {/* Soft blue fill light for shaded continents */}
      <directionalLight
        position={[-config.radius * 4, config.radius * 1.5, -config.radius * 3]}
        intensity={config.pointLightIntensity * 0.5}
        color="#93c5fd"
      />

      {/* Front fill light */}
      <directionalLight
        position={[0, config.radius * 2, config.radius * 6]}
        intensity={0.35}
        color="#ffffff"
      />

      {/* Rotating Globe with Markers & Arcs */}
      <RotatingGlobe
        config={config}
        markers={markers}
        onMarkerClick={onMarkerClick}
        onMarkerHover={onMarkerHover}
      />

      {/* Controls */}
      <OrbitControls
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.45}
        autoRotate={config.autoRotateSpeed > 0}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

// ============================================================================
// Loading Fallback
// ============================================================================

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex shrink-0 flex-col items-center gap-3">
        <span className="inline-block shrink-0 text-sm text-neutral-400">
          Loading globe...
        </span>
      </div>
    </Html>
  );
}

// ============================================================================
// Main Globe3D Component
// ============================================================================

const defaultConfig: Required<Globe3DConfig> = {
  radius: 2,
  globeColor: "#1a1a2e",
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  showAtmosphere: false,
  atmosphereColor: "#7ec8ff",
  atmosphereIntensity: 0,
  atmosphereBlur: 2.5,
  bumpScale: 1,
  autoRotateSpeed: 0.25,
  enableZoom: false,
  enablePan: false,
  minDistance: 5,
  maxDistance: 15,
  initialRotation: { x: 0.32, y: -2.65 },
  markerSize: 0.06,
  showWireframe: false,
  wireframeColor: "#4a9eff",
  ambientIntensity: 1.2,
  pointLightIntensity: 1.4,
  backgroundColor: null,
  showArcs: true,
  arcColor: "#e8c98e",
  arcOpacity: 0.75,
};

export function Globe3D({
  markers = [],
  config = {},
  className,
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );

  return (
    <div className={cn("relative h-[500px] w-full", className)}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{
          fov: 40,
          near: 0.1,
          far: 1000,
          position: [0, 0, mergedConfig.radius * 3.15],
        }}
        style={{
          background: mergedConfig.backgroundColor || "transparent",
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            markers={markers}
            config={mergedConfig}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Globe3D;
