import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Html, Line, OrbitControls, Stars } from "@react-three/drei"
import { Globe, Map, Minus, Plus, RotateCcw } from "lucide-react"
import * as THREE from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { useLanguage } from "../components/language-context"
import landGeoJsonRaw from "../data/ne_110m_land.geojson?raw"

const GLOBE_RADIUS = 1.56
const LATITUDE_BANDS = [-60, -30, 0, 30, 60]
const LONGITUDE_BANDS = [-120, -60, 0, 60, 120]
const BASE_ROTATION: [number, number, number] = [0.42, -2.45, 0.06]
const CAMERA_POSITION: [number, number, number] = [0, 0.08, 5.02]
const FLAT_MAP_WIDTH = 1400
const FLAT_MAP_HEIGHT = 760
const DEFAULT_FLAT_TRANSFORM = { x: 0, y: 0, scale: 1.04 }
const BEACON_COLOR = "#3cf0d7"

type ViewMode = "3d" | "2d"
type PresenceStatus = "existing" | "future" | "hq"

type PresenceNode = {
  key: string
  labelKey: string
  lat: number
  lng: number
  status: PresenceStatus
  labelOffset3d: {
    x: number
    y: number
  }
  labelOffset2d: {
    x: number
    y: number
  }
}

type Point3 = [number, number, number]
type GeoCoordinate = [number, number]
type GeoRing = GeoCoordinate[]
type GeoPolygon = GeoRing[]
type FlatTransform = {
  x: number
  y: number
  scale: number
}

type LandFeatureCollection = {
  features: Array<{
    geometry:
      | {
          type: "Polygon"
          coordinates: GeoPolygon
        }
      | {
          type: "MultiPolygon"
          coordinates: GeoPolygon[]
        }
  }>
}

const presenceNodes: PresenceNode[] = [
  {
    key: "kazakhstan",
    labelKey: "presence.point.kazakhstan",
    lat: 51.1694,
    lng: 71.4491,
    status: "existing",
    labelOffset3d: { x: 16, y: -14 },
    labelOffset2d: { x: 16, y: -16 },
  },
  {
    key: "iraq",
    labelKey: "presence.point.iraq",
    lat: 33.3152,
    lng: 44.3661,
    status: "future",
    labelOffset3d: { x: -16, y: -12 },
    labelOffset2d: { x: -12, y: -16 },
  },
  {
    key: "saudiArabia",
    labelKey: "presence.point.saudiArabia",
    lat: 24.7136,
    lng: 46.6753,
    status: "existing",
    labelOffset3d: { x: -36, y: 2 },
    labelOffset2d: { x: -40, y: 0 },
  },
  {
    key: "bahrain",
    labelKey: "presence.point.bahrain",
    lat: 26.0667,
    lng: 50.5577,
    status: "future",
    labelOffset3d: { x: 18, y: 0 },
    labelOffset2d: { x: 16, y: -10 },
  },
  {
    key: "qatar",
    labelKey: "presence.point.qatar",
    lat: 25.2854,
    lng: 51.531,
    status: "future",
    labelOffset3d: { x: -2, y: 16 },
    labelOffset2d: { x: -2, y: 16 },
  },
  {
    key: "uae",
    labelKey: "presence.point.uae",
    lat: 24.4539,
    lng: 54.3773,
    status: "existing",
    labelOffset3d: { x: 14, y: 14 },
    labelOffset2d: { x: 18, y: 12 },
  },
  {
    key: "oman",
    labelKey: "presence.point.oman",
    lat: 23.588,
    lng: 58.3829,
    status: "future",
    labelOffset3d: { x: 20, y: 18 },
    labelOffset2d: { x: 18, y: 18 },
  },
  {
    key: "india",
    labelKey: "presence.point.india",
    lat: 26.9124,
    lng: 75.7873,
    status: "hq",
    labelOffset3d: { x: 14, y: 0 },
    labelOffset2d: { x: 16, y: 0 },
  },
  {
    key: "kenya",
    labelKey: "presence.point.kenya",
    lat: -1.2864,
    lng: 36.8172,
    status: "future",
    labelOffset3d: { x: -10, y: 18 },
    labelOffset2d: { x: -4, y: 18 },
  },
]

const landData = JSON.parse(landGeoJsonRaw) as LandFeatureCollection
const latitudeLines = LATITUDE_BANDS.map((lat) => buildLatitudeRing(lat, GLOBE_RADIUS + 0.002))
const longitudeLines = LONGITUDE_BANDS.map((lng) => buildLongitudeRing(lng, GLOBE_RADIUS + 0.002))
const globeDotPositions = buildGlobeDotPositions(900)
const landOutlinePaths = buildLandOutlinePaths(landData, GLOBE_RADIUS + 0.018)
const flatMapPaths = buildFlatMapPaths(landData, FLAT_MAP_WIDTH, FLAT_MAP_HEIGHT)

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lng + 180)

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

function projectToFlatMap(lng: number, lat: number, width: number, height: number) {
  return {
    x: ((lng + 180) / 360) * width,
    y: ((90 - lat) / 180) * height,
  }
}

function vectorToPoint(vector: THREE.Vector3): Point3 {
  return [vector.x, vector.y, vector.z]
}

function buildLatitudeRing(lat: number, radius: number) {
  const ringRadius = Math.cos(THREE.MathUtils.degToRad(lat)) * radius
  const y = Math.sin(THREE.MathUtils.degToRad(lat)) * radius

  return Array.from({ length: 72 }, (_, index) => {
    const angle = (index / 71) * Math.PI * 2
    return [Math.cos(angle) * ringRadius, y, Math.sin(angle) * ringRadius] as Point3
  })
}

function buildLongitudeRing(lng: number, radius: number) {
  return Array.from({ length: 72 }, (_, index) => {
    const lat = -90 + (index / 71) * 180
    return vectorToPoint(latLngToVector3(lat, lng, radius))
  })
}

function buildGlobeDotPositions(count: number) {
  const points = Array.from({ length: count }, (_, index) => {
    const t = index / count
    const inclination = Math.acos(1 - 2 * t)
    const azimuth = Math.PI * (1 + Math.sqrt(5)) * index
    const radius = GLOBE_RADIUS + (index % 7 === 0 ? 0.008 : 0.003)
    const x = Math.sin(inclination) * Math.cos(azimuth) * radius
    const y = Math.cos(inclination) * radius
    const z = Math.sin(inclination) * Math.sin(azimuth) * radius
    return [x, y, z]
  }).flat()

  return new Float32Array(points)
}

function splitRingAtDateline(ring: GeoRing) {
  const normalizedRing =
    ring.length > 1 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1]
      ? ring.slice(0, -1)
      : ring

  const segments: GeoRing[] = []
  let currentSegment: GeoRing = []

  for (const coordinate of normalizedRing) {
    if (currentSegment.length === 0) {
      currentSegment.push(coordinate)
      continue
    }

    const previous = currentSegment[currentSegment.length - 1]
    const longitudeJump = Math.abs(coordinate[0] - previous[0])

    if (longitudeJump > 180) {
      if (currentSegment.length > 1) {
        segments.push(currentSegment)
      }
      currentSegment = [coordinate]
      continue
    }

    currentSegment.push(coordinate)
  }

  if (currentSegment.length > 1) {
    segments.push(currentSegment)
  }

  return segments
}

function buildLandOutlinePaths(data: LandFeatureCollection, radius: number) {
  const paths: Point3[][] = []

  for (const feature of data.features) {
    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates

    for (const polygon of polygons) {
      const outerRing = polygon[0]
      if (!outerRing || outerRing.length < 2) continue

      for (const segment of splitRingAtDateline(outerRing)) {
        const path = segment.map(([lng, lat]) => vectorToPoint(latLngToVector3(lat, lng, radius)))
        if (path.length > 1) {
          paths.push(path)
        }
      }
    }
  }

  return paths
}

function buildFlatMapPaths(data: LandFeatureCollection, width: number, height: number) {
  const paths: string[] = []

  for (const feature of data.features) {
    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates

    for (const polygon of polygons) {
      const outerRing = polygon[0]
      if (!outerRing || outerRing.length < 2) continue

      for (const segment of splitRingAtDateline(outerRing)) {
        const commands = segment
          .map(([lng, lat], index) => {
            const point = projectToFlatMap(lng, lat, width, height)
            return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
          })
          .join(" ")

        if (commands) {
          paths.push(commands)
        }
      }
    }
  }

  return paths
}

function createGlobeTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 2048
  canvas.height = 1024

  const context = canvas.getContext("2d")
  if (!context) {
    return new THREE.CanvasTexture(canvas)
  }

  context.fillStyle = "#575a66"
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = "#8e92a1"
  context.strokeStyle = "#d8dde6"
  context.lineWidth = 1.15
  context.lineJoin = "round"
  context.lineCap = "round"

  for (const feature of landData.features) {
    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates

    for (const polygon of polygons) {
      const outerRing = polygon[0]
      if (!outerRing || outerRing.length < 2) continue

      for (const segment of splitRingAtDateline(outerRing)) {
        context.beginPath()

        segment.forEach(([lng, lat], index) => {
          const point = projectToFlatMap(lng, lat, canvas.width, canvas.height)
          if (index === 0) {
            context.moveTo(point.x, point.y)
          } else {
            context.lineTo(point.x, point.y)
          }
        })

        context.closePath()
        context.fill()
        context.stroke()
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}

function clampFlatTransform(transform: FlatTransform) {
  const scale = THREE.MathUtils.clamp(transform.scale, 1, 2.4)
  const maxX = 240 * scale
  const maxY = 180 * scale

  return {
    scale,
    x: THREE.MathUtils.clamp(transform.x, -maxX, maxX),
    y: THREE.MathUtils.clamp(transform.y, -maxY, maxY),
  }
}

function getMarkerPalette(status: PresenceStatus) {
  switch (status) {
    case "existing":
      return {
        core: "#84cc16",
        glow: "rgba(163, 230, 53, 0.22)",
        line: "#84cc16",
        labelFill: "rgba(12, 24, 5, 0.82)",
        labelStroke: "rgba(132, 204, 22, 0.62)",
        labelText: "#ecfccb",
      }
    case "hq":
      return {
        core: "#ffffff",
        glow: "rgba(255, 255, 255, 0.28)",
        line: "#ffffff",
        labelFill: "rgba(15, 15, 15, 0.82)",
        labelStroke: "rgba(255, 255, 255, 0.62)",
        labelText: "#ffffff",
      }
    case "future":
    default:
      return {
        core: "#ef4444",
        glow: "rgba(248, 113, 113, 0.2)",
        line: "#ef4444",
        labelFill: "rgba(36, 8, 10, 0.82)",
        labelStroke: "rgba(248, 113, 113, 0.52)",
        labelText: "#fee2e2",
      }
  }
}

function GlobeSurfaceDots() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[globeDotPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f7f8fb"
        size={0.012}
        sizeAttenuation
        transparent
        opacity={0.08}
        depthWrite={false}
      />
    </points>
  )
}

function GlobeLandOutlines() {
  return (
    <>
      {landOutlinePaths.map((points, index) => (
        <group key={`land-${index}`}>
          <Line
            points={points}
            color="#fbfbfd"
            lineWidth={0.55}
            transparent
            opacity={0.08}
            depthWrite={false}
          />
          <Line
            points={points}
            color="#ffffff"
            lineWidth={1.1}
            transparent
            opacity={0.03}
            depthWrite={false}
          />
        </group>
      ))}
    </>
  )
}

function PresenceMarker3D({ node, label }: { node: PresenceNode; label: string }) {
  const anchorPosition = latLngToVector3(node.lat, node.lng, GLOBE_RADIUS + 0.02)
  const markerPosition = anchorPosition.clone().normalize().multiplyScalar(GLOBE_RADIUS + 0.075)
  const badgePosition = markerPosition.clone().normalize().multiplyScalar(GLOBE_RADIUS + 0.16)
  const palette = getMarkerPalette(node.status)

  return (
    <>
      <Line
        points={[vectorToPoint(anchorPosition), vectorToPoint(markerPosition)]}
        color={BEACON_COLOR}
        lineWidth={0.58}
        transparent
        opacity={0.52}
        depthWrite={false}
      />

      <group position={vectorToPoint(markerPosition)}>
        <mesh>
          <sphereGeometry args={[0.055, 18, 18]} />
          <meshBasicMaterial color={BEACON_COLOR} transparent opacity={0.18} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.026, 16, 16]} />
          <meshBasicMaterial color={BEACON_COLOR} />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <sphereGeometry args={[0.01, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <Html position={vectorToPoint(badgePosition)} center occlude distanceFactor={12}>
        <div
          title={label}
          className="pointer-events-none hidden h-5 w-5 items-center justify-center rounded-[0.45rem] border sm:flex"
          style={{
            transform: `translate(${Math.round(node.labelOffset3d.x * 0.45)}px, ${Math.round(node.labelOffset3d.y * 0.45)}px)`,
            background: "rgba(7, 10, 16, 0.94)",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.38)",
          }}
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{ backgroundColor: palette.core, boxShadow: `0 0 10px ${palette.core}` }}
          />
        </div>
      </Html>
    </>
  )
}

function GlobeScene({
  labels,
  controlsRef,
  performanceMode,
}: {
  labels: Record<string, string>
  controlsRef: RefObject<OrbitControlsImpl | null>
  performanceMode: boolean
}) {
  const globeTexture = useMemo(() => createGlobeTexture(), [])

  useEffect(() => {
    return () => {
      globeTexture.dispose()
    }
  }, [globeTexture])

  return (
    <>
      <ambientLight intensity={0.58} color="#d8dce6" />
      <directionalLight position={[4.2, 2.8, 5.4]} intensity={1.72} color="#ffffff" />
      <directionalLight position={[-4, -1, -3]} intensity={0.3} color="#9ca3af" />

      <Stars
        radius={18}
        depth={7}
        count={performanceMode ? 180 : 260}
        factor={performanceMode ? 1.8 : 2}
        saturation={0}
        fade
        speed={0}
      />

      <group rotation={BASE_ROTATION}>
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 72, 72]} />
          <meshStandardMaterial
            map={globeTexture}
            color="#ffffff"
            emissive="#0b0d13"
            emissiveIntensity={0.08}
            metalness={0.03}
            roughness={0.92}
          />
        </mesh>

        <mesh scale={1.03}>
          <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
          <meshBasicMaterial color="#e9eef9" transparent opacity={0.045} side={THREE.BackSide} />
        </mesh>

        {latitudeLines.map((points, index) => (
          <Line
            key={`lat-${index}`}
            points={points}
            color="#f8fafc"
            lineWidth={0.24}
            transparent
            opacity={0.05}
            depthWrite={false}
          />
        ))}

        {longitudeLines.map((points, index) => (
          <Line
            key={`lng-${index}`}
            points={points}
            color="#f8fafc"
            lineWidth={0.24}
            transparent
            opacity={0.045}
            depthWrite={false}
          />
        ))}

        <GlobeSurfaceDots />
        <GlobeLandOutlines />

        {presenceNodes.map((node) => (
          <PresenceMarker3D key={node.key} node={node} label={labels[node.key]} />
        ))}
      </group>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping={false}
        enableRotate
        enableZoom
        enablePan
        rotateSpeed={0.55}
        zoomSpeed={0.72}
        panSpeed={0.5}
        minDistance={3.95}
        maxDistance={6.9}
        target={[0, 0, 0]}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
      />
    </>
  )
}

function FlatMapView({
  labels,
  transform,
}: {
  labels: Record<string, string>
  transform: FlatTransform
}) {
  return (
    <svg
      viewBox={`0 0 ${FLAT_MAP_WIDTH} ${FLAT_MAP_HEIGHT}`}
      className="h-full w-full max-w-none"
      style={{
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        transformOrigin: "50% 50%",
      }}
      aria-hidden="true"
    >
      <rect width={FLAT_MAP_WIDTH} height={FLAT_MAP_HEIGHT} fill="#06080d" />

      <g opacity="0.12">
        {LATITUDE_BANDS.map((lat) => {
          const y = projectToFlatMap(0, lat, FLAT_MAP_WIDTH, FLAT_MAP_HEIGHT).y
          return (
            <line
              key={`flat-lat-${lat}`}
              x1="0"
              y1={y}
              x2={FLAT_MAP_WIDTH}
              y2={y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          )
        })}
        {LONGITUDE_BANDS.map((lng) => {
          const x = projectToFlatMap(lng, 0, FLAT_MAP_WIDTH, FLAT_MAP_HEIGHT).x
          return (
            <line
              key={`flat-lng-${lng}`}
              x1={x}
              y1="0"
              x2={x}
              y2={FLAT_MAP_HEIGHT}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          )
        })}
      </g>

      <g>
        {flatMapPaths.map((path, index) => (
          <path
            key={`flat-land-${index}`}
            d={path}
            fill="none"
            stroke="#dfe5ee"
            strokeOpacity="0.52"
            strokeWidth="1.25"
          />
        ))}
      </g>

      {presenceNodes.map((node) => {
        const point = projectToFlatMap(node.lng, node.lat, FLAT_MAP_WIDTH, FLAT_MAP_HEIGHT)
        const palette = getMarkerPalette(node.status)
        const label = labels[node.key]
        const labelWidth = Math.max(56, label.length * 5.8 + 16)
        const labelX = point.x + node.labelOffset2d.x
        const labelY = point.y + node.labelOffset2d.y

        return (
          <g key={`flat-node-${node.key}`}>
            <line
              x1={point.x}
              y1={point.y}
              x2={labelX}
              y2={labelY}
              stroke={palette.line}
              strokeOpacity="0.78"
              strokeWidth="1"
            />
            <circle cx={point.x} cy={point.y} r="9" fill={palette.glow} />
            <circle cx={point.x} cy={point.y} r="4.2" fill={palette.core} />
            <circle cx={point.x} cy={point.y} r="1.7" fill="#ffffff" />

            <g transform={`translate(${labelX}, ${labelY})`}>
              <rect
                x={-labelWidth / 2}
                y={-14}
                width={labelWidth}
                height="28"
                rx="14"
                fill={palette.labelFill}
                stroke={palette.labelStroke}
                strokeWidth="1.1"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fill={palette.labelText}
                fontSize="8"
                fontWeight="700"
                letterSpacing="1.4"
              >
                {label.toUpperCase()}
              </text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}

function LegendChip({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-md">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/72">{label}</span>
    </div>
  )
}

export function Presence() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement | null>(null)
  const orbitControlsRef = useRef<OrbitControlsImpl | null>(null)
  const dragStateRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)

  const [mode, setMode] = useState<ViewMode>("3d")
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [flatTransform, setFlatTransform] = useState(DEFAULT_FLAT_TRANSFORM)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncMotionPreference = () => {
      setReducedMotion(
        mediaQuery.matches || document.documentElement.classList.contains("hal-pref-reduce-motion")
      )
    }

    syncMotionPreference()
    mediaQuery.addEventListener("change", syncMotionPreference)

    return () => mediaQuery.removeEventListener("change", syncMotionPreference)
  }, [])

  const performanceMode = useMemo(() => {
    const nav = navigator as Navigator & { deviceMemory?: number }
    const lowHardwareThreads = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 6
    const lowDeviceMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4
    return reducedMotion || lowHardwareThreads || lowDeviceMemory
  }, [reducedMotion])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.12,
    })

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const labels = useMemo(
    () => ({
      kazakhstan: t("presence.point.kazakhstan"),
      iraq: t("presence.point.iraq"),
      saudiArabia: t("presence.point.saudiArabia"),
      bahrain: t("presence.point.bahrain"),
      qatar: t("presence.point.qatar"),
      uae: t("presence.point.uae"),
      oman: t("presence.point.oman"),
      india: t("presence.point.india"),
      kenya: t("presence.point.kenya"),
    }),
    [t]
  )

  function zoomGlobe(direction: "in" | "out") {
    const controls = orbitControlsRef.current
    if (!controls) return

        if (direction === "in") {
          controls.dollyIn(1.16)
        } else {
          controls.dollyOut(1.16)
        }

    controls.update()
  }

  function resetGlobeView() {
    const controls = orbitControlsRef.current
    if (!controls) return

    const camera = controls.object as THREE.PerspectiveCamera
    camera.position.set(...CAMERA_POSITION)
    controls.target.set(0, 0, 0)
    controls.update()
  }

  function zoomFlat(factor: number) {
    setFlatTransform((current) =>
      clampFlatTransform({
        ...current,
        scale: current.scale * factor,
      })
    )
  }

  function resetFlatView() {
    setFlatTransform(DEFAULT_FLAT_TRANSFORM)
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault()
    const factor = event.deltaY < 0 ? 1.12 : 0.9
    zoomFlat(factor)
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (mode !== "2d") return

    event.currentTarget.setPointerCapture(event.pointerId)
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: flatTransform.x,
      originY: flatTransform.y,
    }
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) return

    const nextX = dragStateRef.current.originX + (event.clientX - dragStateRef.current.startX)
    const nextY = dragStateRef.current.originY + (event.clientY - dragStateRef.current.startY)

    setFlatTransform((current) =>
      clampFlatTransform({
        ...current,
        x: nextX,
        y: nextY,
      })
    )
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragStateRef.current?.pointerId !== event.pointerId) return
    dragStateRef.current = null
  }

  function handleZoomIn() {
    if (mode === "3d") {
      zoomGlobe("in")
      return
    }

    zoomFlat(1.16)
  }

  function handleZoomOut() {
    if (mode === "3d") {
      zoomGlobe("out")
      return
    }

    zoomFlat(0.88)
  }

  function handleReset() {
    if (mode === "3d") {
      resetGlobeView()
      return
    }

    resetFlatView()
  }

  return (
    <section
      id="presence"
      ref={sectionRef}
      className="relative min-h-[460px] overflow-hidden bg-[#05070d] sm:min-h-[560px] lg:min-h-[700px]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55 }}
        className="absolute inset-0"
      >
        {mode === "3d" ? (
          <div className="absolute inset-0" onContextMenu={(event) => event.preventDefault()}>
            {isVisible ? (
              <Canvas
                frameloop="demand"
                dpr={performanceMode ? 1 : [1, 1.2]}
                camera={{ position: CAMERA_POSITION, fov: 34 }}
                gl={{ antialias: !performanceMode, alpha: true, powerPreference: "low-power" }}
              >
                <GlobeScene
                  labels={labels}
                  controlsRef={orbitControlsRef}
                  performanceMode={performanceMode}
                />
              </Canvas>
            ) : null}
          </div>
        ) : (
          <div
            className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <FlatMapView labels={labels} transform={flatTransform} />
          </div>
        )}
      </motion.div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 sm:h-[34rem] sm:w-[34rem]" />
        <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035] sm:h-[46rem] sm:w-[46rem]" />
        <div className="absolute left-1/2 top-1/2 h-[48rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.02] sm:h-[58rem] sm:w-[58rem]" />
      </div>

      <div className="pointer-events-auto absolute right-4 top-4 z-20 flex flex-wrap items-center gap-2 sm:right-6 sm:top-6">
        <div
          className="flex rounded-full border border-white/10 bg-black/35 p-1 backdrop-blur-xl"
          aria-label={t("presence.viewToggleAria")}
        >
          <button
            type="button"
            onClick={() => setMode("3d")}
            aria-pressed={mode === "3d"}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
              mode === "3d" ? "bg-fuchsia-400/18 text-white" : "text-white/56 hover:text-white/82"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            {t("presence.view3d")}
          </button>
          <button
            type="button"
            onClick={() => setMode("2d")}
            aria-pressed={mode === "2d"}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
              mode === "2d" ? "bg-fuchsia-400/18 text-white" : "text-white/56 hover:text-white/82"
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            {t("presence.view2d")}
          </button>
        </div>

        <div className="flex rounded-full border border-white/10 bg-black/35 p-1 backdrop-blur-xl">
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label={t("presence.control.zoomOut")}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label={t("presence.control.zoomIn")}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label={t("presence.control.reset")}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-20 hidden flex-wrap items-center gap-2 sm:flex sm:left-6 sm:bottom-6">
        <LegendChip color="#84cc16" label={t("presence.legend.existing")} />
        <LegendChip color="#ef4444" label={t("presence.legend.future")} />
        <LegendChip color="#ffffff" label={t("presence.legend.hq")} />
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 z-20 hidden rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/64 backdrop-blur-md sm:block sm:right-6 sm:bottom-6">
        {mode === "3d" ? t("presence.mapHint3d") : t("presence.mapHint2d")}
      </div>
    </section>
  )
}
