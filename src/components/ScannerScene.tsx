import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { Subsystem } from '../data/subsystems'

const palette: Record<string, number> = { source: 0xf472b6, illuminator: 0xa78bfa, reticle: 0x38bdf8, projection: 0x60a5fa, wafer: 0x22d3ee, metrology: 0x34d399, vacuum: 0xfbbf24 }
const moduleConfig = [
  { id: 'source', base: [-4.7, 0.65, 0] as const, factor: -1.8, size: [1.25, 1.8, 1.7] as const },
  { id: 'illuminator', base: [-3.1, 0.95, 0] as const, factor: -1.1, size: [1.3, 2.15, 1.85] as const },
  { id: 'reticle', base: [-1.35, 1.55, 0] as const, factor: -0.45, size: [1.25, 0.28, 1.5] as const },
  { id: 'projection', base: [0.45, 0.9, 0] as const, factor: 0.4, size: [2.1, 3.25, 2] as const },
  { id: 'wafer', base: [2.75, -0.35, 0] as const, factor: 1, size: [1.9, 0.38, 2.25] as const },
  { id: 'metrology', base: [4.25, 0.7, -0.15] as const, factor: 1.6, size: [1.2, 2.45, 1.8] as const },
]

export function ScannerScene({ selected, exploded, onSelect }: { selected: Subsystem; exploded: number; onSelect: (id: string) => void }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ selected: selected.id, exploded, onSelect })
  stateRef.current = { selected: selected.id, exploded, onSelect }

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050914)
    scene.fog = new THREE.Fog(0x050914, 12, 28)
    const camera = new THREE.PerspectiveCamera(41, 1, 0.1, 100)
    camera.position.set(8.3, 5.6, 10.8)
    camera.lookAt(0, 0, 0)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))
    renderer.shadowMap.enabled = true
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xb9dcff, 0x0b1020, 1.8))
    const key = new THREE.DirectionalLight(0xffffff, 2.8)
    key.position.set(6, 9, 5)
    key.castShadow = true
    scene.add(key)
    const accent = new THREE.PointLight(0x7dd3fc, 38, 16)
    accent.position.set(-6, 3, 4)
    scene.add(accent)

    const root = new THREE.Group()
    root.rotation.y = -0.1
    scene.add(root)
    const objects = new Map<string, THREE.Mesh>()
    const material = (id: string) => new THREE.MeshStandardMaterial({ color: palette[id], metalness: 0.66, roughness: 0.24, transparent: true, opacity: 0.84, emissive: palette[id], emissiveIntensity: 0.04 })

    moduleConfig.forEach((config) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(config.size[0], config.size[1], config.size[2]), material(config.id))
      mesh.position.set(config.base[0], config.base[1], config.base[2])
      mesh.castShadow = true
      mesh.userData.id = config.id
      root.add(mesh)
      objects.set(config.id, mesh)
    })

    const sourceFallback = objects.get('source')!
    const sourceMaterial = sourceFallback.material as THREE.MeshStandardMaterial
    sourceMaterial.opacity = 0.16
    const loader = new GLTFLoader()
    loader.load('/models/euv-source-collector-concept.gltf', (gltf) => {
      const model = gltf.scene
      model.scale.setScalar(0.42)
      model.rotation.y = Math.PI / 2
      model.position.set(0, -0.12, 0)
      model.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true
          node.receiveShadow = true
        }
      })
      sourceFallback.add(model)
    }, undefined, () => {
      sourceMaterial.opacity = 0.82
    })

    const vacuum = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.34, 2.85), material('vacuum'))
    vacuum.position.set(0, -1.35, -0.1)
    vacuum.userData.id = 'vacuum'
    root.add(vacuum)
    objects.set('vacuum', vacuum)

    const mirrorMaterial = new THREE.MeshPhysicalMaterial({ color: 0xc4b5fd, metalness: 0.9, roughness: 0.08, clearcoat: 1 })
    ;[[-0.45, 0.8, -0.25], [0.45, 0.2, 0.25], [-0.45, -0.45, -0.25]].forEach(([x, y, rz]) => {
      const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 40), mirrorMaterial)
      mirror.position.set(x, y, 0)
      mirror.rotation.set(Math.PI / 2, 0, rz)
      objects.get('projection')!.add(mirror)
    })

    const wafer = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.06, 64), new THREE.MeshPhysicalMaterial({ color: 0x67e8f9, metalness: 0.45, roughness: 0.18, iridescence: 0.85 }))
    wafer.position.set(0, 0.26, 0)
    objects.get('wafer')!.add(wafer)

    const beamMaterial = new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.82 })
    const beamGeometry = new THREE.BufferGeometry()
    root.add(new THREE.Line(beamGeometry, beamMaterial))
    const grid = new THREE.GridHelper(30, 60, 0x25415f, 0x13233a)
    grid.position.y = -1.62
    scene.add(grid)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let dragging = false
    let downX = 0
    let downY = 0
    let prevX = 0
    let prevY = 0
    let targetX = -0.06
    let targetY = -0.1
    const point = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }
    const pointerDown = (event: PointerEvent) => { dragging = true; downX = prevX = event.clientX; downY = prevY = event.clientY }
    const pointerMove = (event: PointerEvent) => {
      if (!dragging) return
      targetY += (event.clientX - prevX) * 0.006
      targetX = THREE.MathUtils.clamp(targetX + (event.clientY - prevY) * 0.004, -0.6, 0.45)
      prevX = event.clientX
      prevY = event.clientY
    }
    const pointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - downX, event.clientY - downY) < 5) {
        point(event)
        raycaster.setFromCamera(pointer, camera)
        const hit = raycaster.intersectObjects([...objects.values()], false)[0]
        if (hit?.object.userData.id) stateRef.current.onSelect(hit.object.userData.id)
      }
      dragging = false
    }
    const wheel = (event: WheelEvent) => {
      camera.position.multiplyScalar(event.deltaY > 0 ? 1.06 : 0.94)
      camera.position.setLength(THREE.MathUtils.clamp(camera.position.length(), 7, 22))
    }
    renderer.domElement.addEventListener('pointerdown', pointerDown)
    window.addEventListener('pointermove', pointerMove)
    window.addEventListener('pointerup', pointerUp)
    renderer.domElement.addEventListener('wheel', wheel, { passive: true })

    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    let frame = 0
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate)
      root.rotation.y += (targetY - root.rotation.y) * 0.08
      root.rotation.x += (targetX - root.rotation.x) * 0.08
      root.position.y = Math.sin(time * 0.0005) * 0.05
      const { exploded: amount, selected: selectedId } = stateRef.current
      moduleConfig.forEach((config) => {
        const mesh = objects.get(config.id)!
        mesh.position.x += ((config.base[0] + amount * config.factor) - mesh.position.x) * 0.1
        const meshMaterial = mesh.material as THREE.MeshStandardMaterial
        meshMaterial.opacity = config.id === 'source' ? (config.id === selectedId ? 0.3 : 0.12) : (config.id === selectedId ? 1 : 0.82)
        meshMaterial.emissiveIntensity = config.id === selectedId ? 0.34 : 0.035
      })
      const vacuumMesh = objects.get('vacuum')!
      vacuumMesh.scale.x += (((9.8 + amount * 3.2) / 9.8) - vacuumMesh.scale.x) * 0.1
      const vacuumMaterial = vacuumMesh.material as THREE.MeshStandardMaterial
      vacuumMaterial.opacity = selectedId === 'vacuum' ? 1 : 0.72
      vacuumMaterial.emissiveIntensity = selectedId === 'vacuum' ? 0.3 : 0.02
      beamMaterial.opacity = 0.58 + Math.sin(time * 0.004) * 0.2
      const points = [
        [-4.6 - amount * 1.8, 0.8, 0],
        [-3.15 - amount * 1.1, 1.2, 0.05],
        [-1.45 - amount * 0.45, 1.1, 0],
        [-0.25, 1.9, 0],
        [1.35 + amount * 0.4, 0.95, 0],
        [3.25 + amount, 0.35, 0],
        [4.45 + amount * 1.6, -0.65, 0],
      ].map(([x, y, z]) => new THREE.Vector3(x, y, z))
      beamGeometry.setFromPoints(new THREE.CatmullRomCurve3(points).getPoints(90))
      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointerdown', pointerDown)
      window.removeEventListener('pointermove', pointerMove)
      window.removeEventListener('pointerup', pointerUp)
      renderer.domElement.removeEventListener('wheel', wheel)
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((entry) => entry.dispose())
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="scanner-canvas" ref={mountRef}><div className="canvas-help">drag to orbit · wheel to zoom · click a module</div><div className="canvas-caption">Conceptual public-source reconstruction · source uses original OpenEUV glTF · not ASML CAD</div></div>
}
