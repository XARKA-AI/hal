"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Color, Fog, Group, Scene, Vector3 } from "three"
import ThreeGlobe from "three-globe"
import countries from "@/data/globe.json"

const RING_PROPAGATION_SPEED = 3
const cameraZ = 300

export type Position = {
  order: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  arcAlt: number
  color: string
}

export type GlobeConfig = {
  pointSize?: number
  globeColor?: string
  showAtmosphere?: boolean
  atmosphereColor?: string
  atmosphereAltitude?: number
  emissive?: string
  emissiveIntensity?: number
  shininess?: number
  polygonColor?: string
  ambientLight?: string
  directionalLeftLight?: string
  directionalTopLight?: string
  pointLight?: string
  backgroundColor?: string
  fogColor?: string
  arcTime?: number
  arcLength?: number
  rings?: number
  maxRings?: number
  initialPosition?: {
    lat: number
    lng: number
  }
  autoRotate?: boolean
  autoRotateSpeed?: number
  is2D?: boolean
}

interface WorldProps {
  globeConfig: GlobeConfig
  data: Position[]
}

function GlobeMesh({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null)
  const groupRef = useRef<Group | null>(null)
  // `globeRef.current` itself acts as the "initialized" flag. Subsequent
  // effects below run in declaration order on first mount, so by the time they
  // execute the init effect has already populated the ref. This avoids a
  // synchronous setState-in-effect (and the second render it forces) while
  // keeping the lazy three-globe construction.
  const is2D = globeConfig.is2D ?? false

  const defaultProps: Required<
    Pick<
      GlobeConfig,
      | "pointSize"
      | "atmosphereColor"
      | "showAtmosphere"
      | "atmosphereAltitude"
      | "polygonColor"
      | "globeColor"
      | "emissive"
      | "emissiveIntensity"
      | "shininess"
      | "arcTime"
      | "arcLength"
      | "rings"
      | "maxRings"
    >
  > = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  }

  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe()
      groupRef.current.add(globeRef.current as never)
    }
  }, [])

  useEffect(() => {
    if (!globeRef.current) return

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color
      emissive: Color
      emissiveIntensity: number
      shininess: number
    }
    globeMaterial.color = new Color(defaultProps.globeColor)
    globeMaterial.emissive = new Color(defaultProps.emissive)
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity
    globeMaterial.shininess = defaultProps.shininess
  }, [defaultProps.emissive, defaultProps.emissiveIntensity, defaultProps.globeColor, defaultProps.shininess])

  useEffect(() => {
    if (!globeRef.current || !data.length) return

    const points = data.flatMap((arc) => [
      {
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      },
      {
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      },
    ])

    const filteredPoints = points.filter(
      (point, i, all) =>
        all.findIndex(
          (candidate) => candidate.lat === point.lat && candidate.lng === point.lng,
        ) === i,
    )

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(4)
      .hexPolygonMargin(0.3)
      .showAtmosphere(is2D ? false : defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor)
      .hexPolygonUseDots(true)
      .hexPolygonsTransitionDuration(0)

    globeRef.current
      .polygonsData(countries.features)
      .polygonCapColor(() => "rgba(34, 197, 94, 0.2)")
      .polygonSideColor(() => "rgba(22, 163, 74, 0.08)")
      .polygonStrokeColor(() => "rgba(134, 239, 172, 0.85)")
      .polygonAltitude(is2D ? 0 : 0.01)
      .polygonsTransitionDuration(0)

    globeRef.current
      .arcsData(data)
      .arcStartLat((d: object) => (d as Position).startLat)
      .arcStartLng((d: object) => (d as Position).startLng)
      .arcEndLat((d: object) => (d as Position).endLat)
      .arcEndLng((d: object) => (d as Position).endLng)
      .arcColor((d: object) => (d as Position).color)
      .arcAltitude((d: object) => (is2D ? 0 : (d as Position).arcAlt))
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((d: object) => (d as Position).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime)

    globeRef.current
      .pointsData(filteredPoints)
      .pointColor((d: object) => (d as { color: string }).color)
      .pointsMerge(true)
      .pointAltitude(0)
      .pointRadius(2)

    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings)
  }, [
    data,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.atmosphereAltitude,
    defaultProps.atmosphereColor,
    defaultProps.maxRings,
    defaultProps.pointSize,
    defaultProps.polygonColor,
    defaultProps.rings,
    defaultProps.showAtmosphere,
    is2D,
  ])

  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.scale.set(1, is2D ? 0.62 : 1, 1)
  }, [is2D])

  useEffect(() => {
    if (!globeRef.current || !data.length || is2D) {
      globeRef.current?.ringsData([])
      return
    }

    const interval = window.setInterval(() => {
      if (!globeRef.current) return

      const selected = genRandomNumbers(0, data.length, Math.floor((data.length * 4) / 5))
      const ringsData = data
        .filter((_d, i) => selected.includes(i))
        .map((d) => ({ lat: d.startLat, lng: d.startLng, color: d.color }))

      globeRef.current.ringsData(ringsData)
    }, 2000)

    return () => window.clearInterval(interval)
  }, [data, is2D])

  return <group ref={groupRef} />
}

function WebGLRendererConfig({ clearColor = "#020617" }: { clearColor?: string }) {
  const { gl, size } = useThree()

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio)
    gl.setSize(size.width, size.height)
    gl.setClearColor(new Color(clearColor), 1)
  }, [clearColor, gl, size.height, size.width])

  return null
}

export function World(props: WorldProps) {
  const { globeConfig } = props
  const is2D = globeConfig.is2D ?? false

  const scene = useMemo(() => {
    const fogColor = globeConfig.fogColor ?? globeConfig.backgroundColor ?? "#020617"
    const builtScene = new Scene()
    builtScene.fog = new Fog(new Color(fogColor), 400, 1600)
    return builtScene
  }, [globeConfig.backgroundColor, globeConfig.fogColor])

  return (
    <Canvas
      scene={scene}
      camera={{ fov: 50, near: 180, far: 1800, position: [0, 0, is2D ? 360 : cameraZ] }}
      dpr={[1, 1.8]}
    >
      <WebGLRendererConfig clearColor={globeConfig.backgroundColor} />
      <ambientLight color={globeConfig.ambientLight ?? "#ffffff"} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight ?? "#ffffff"}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight ?? "#ffffff"}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight ?? "#ffffff"}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <GlobeMesh {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={!is2D}
        minDistance={is2D ? 360 : cameraZ}
        maxDistance={is2D ? 360 : cameraZ}
        autoRotateSpeed={globeConfig.autoRotateSpeed ?? 1}
        autoRotate={!is2D && (globeConfig.autoRotate ?? true)}
        minPolarAngle={is2D ? Math.PI / 2 : Math.PI / 3.5}
        maxPolarAngle={is2D ? Math.PI / 2 : Math.PI - Math.PI / 3}
      />
    </Canvas>
  )
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const expandedHex = hex.replace(shorthandRegex, (_m, r: string, g: string, b: string) => {
    return `${r}${r}${g}${g}${b}${b}`
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expandedHex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = []

  while (arr.length < count && max > min) {
    const random = Math.floor(Math.random() * (max - min)) + min
    if (!arr.includes(random)) arr.push(random)
  }

  return arr
}
