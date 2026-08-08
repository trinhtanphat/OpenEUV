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

const cameraPresets: Record<string, { position: [number, number, number]; lookAt: [number, number, number] }> = {
  overview: { position: [8.3, 5.6, 10.8], lookAt: [0, 0, 0] },
  source: { position: [0.2, 3.2, 7.4], lookAt: [-4.7, 0.65, 0] },
  reticle: { position: [4.4, 4.6, 8.2], lookAt: [-1.35, 1.55, 0] },
  projection: { position: [6.3, 4.1, 7.1], lookAt: [0.45, 0.9, 0] },
  wafer: { position: [7.6, 2.5, 5.9], lookAt: [2.75, -0.35, 0] },
}

type SelectHandler = (id: string, nodeName?: string) => void

type ScannerSceneProps = {
  selected: Subsystem
  exploded: number
  onSelect: SelectHandler
  highlightedNode?: string | null
  focusId?: string | null
}

export function ScannerScene({ selected, exploded, onSelect, highlightedNode = null, focusId = null }: ScannerSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ selected: selected.id, exploded, onSelect, highlightedNode, focusId })
  stateRef.current = { selected: selected.id, exploded, onSelect, highlightedNode, focusId }

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
    const conceptNodes = new Map<string, THREE.Mesh>()
    const material = (id: string) => new THREE.MeshStandardMaterial({ color: palette[id], metalness: 0.66, roughness: 0.24, transparent: true, opacity: 0.84, emissive: palette[id], emissiveIntensity: 0.04 })

    moduleConfig.forEach((config) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(config.size[0], config.size[1], config.size[2]), material(config.id))
      mesh.position.set(config.base[0], config.base[1], config.base[2])
      mesh.castShadow = true
      mesh.userData.id = config.id
      mesh.userData.assetLoaded = false
      root.add(mesh)
      objects.set(config.id, mesh)
    })

    const sourceAnimation = new THREE.Group()
    objects.get('source')!.add(sourceAnimation)
    const conceptualDroplet = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 18), new THREE.MeshBasicMaterial({ color: 0xfff0a8 }))
    conceptualDroplet.position.set(-0.18, 0.55, 0)
    const conceptualPlasma = new THREE.Mesh(new THREE.SphereGeometry(0.14, 22, 22), new THREE.MeshBasicMaterial({ color: 0x9deeff, transparent: true, opacity: 0.72 }))
    conceptualPlasma.position.set(0.08, 0.06, 0)
    sourceAnimation.add(conceptualDroplet, conceptualPlasma)

    const projectionDetails = new THREE.Group()
    objects.get('projection')!.add(projectionDetails)
    const mirrorMaterial = new THREE.MeshPhysicalMaterial({ color: 0xc4b5fd, metalness: 0.9, roughness: 0.08, clearcoat: 1 })
    ;[[-0.45, 0.8, -0.25], [0.45, 0.2, 0.25], [-0.45, -0.45, -0.25]].forEach(([x, y, rz]) => {
      const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 40), mirrorMaterial)
      mirror.position.set(x, y, 0)
      mirror.rotation.set(Math.PI / 2, 0, rz)
      projectionDetails.add(mirror)
    })

    const loader = new GLTFLoader()
    const loadConceptAsset = (id: 'source' | 'reticle' | 'projection', url: string, scale: number, rotationY = 0, offset: [number, number, number] = [0, 0, 0]) => {
      const fallback = objects.get(id)!
      loader.load(url, (gltf) => {
        const model = gltf.scene
        model.scale.setScalar(scale)
        model.rotation.y = rotationY
        model.position.set(offset[0], offset[1], offset[2])
        model.name = `OpenEUV-${id}-concept-asset`
        model.traverse((node) => {
          node.userData.subsystem = id
          if (node.name && !node.name.startsWith('OpenEUV-')) node.userData.conceptNodeName = node.name
          if (node instanceof THREE.Mesh) {
            node.castShadow = true
            node.receiveShadow = true
            node.material = Array.isArray(node.material) ? node.material.map((entry) => entry.clone()) : node.material.clone()
            if (node.name) conceptNodes.set(node.name, node)
          }
        })
        fallback.add(model)
        fallback.userData.assetLoaded = true
        if (id === 'projection') projectionDetails.visible = false
      }, undefined, () => {
        fallback.userData.assetLoaded = false
        if (id === 'projection') projectionDetails.visible = true
      })
    }

    loadConceptAsset('source', '/models/euv-source-collector-concept.gltf', 0.42, Math.PI / 2, [0, -0.12, 0])
    loadConceptAsset('reticle', '/models/euv-reticle-concept.gltf', 0.34, 0, [0, 0.08, 0])
    loadConceptAsset('projection', '/models/euv-projection-concept.gltf', 0.58, 0, [0, 0, 0])

    const vacuum = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.34, 2.85), material('vacuum'))
    vacuum.position.set(0, -1.35, -0.1)
    vacuum.userData.id = 'vacuum'
    root.add(vacuum)
    objects.set('vacuum', vacuum)

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
        const hit = raycaster.intersectObjects([...objects.values()], true)[0]
        const subsystemId = hit?.object.userData.id ?? hit?.object.userData.subsystem
        const nodeName = hit?.object.userData.conceptNodeName as string | undefined
        if (typeof subsystemId === 'string') stateRef.current.onSelect(subsystemId, nodeName)
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

    const lookTarget = new THREE.Vector3()
    let frame = 0
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate)
      root.rotation.y += (targetY - root.rotation.y) * 0.08
      root.rotation.x += (targetX - root.rotation.x) * 0.08
      root.position.y = Math.sin(time * 0.0005) * 0.05
      const { exploded: amount, selected: selectedId, highlightedNode: nodeToHighlight, focusId: cameraFocus } = stateRef.current

      if (cameraFocus && cameraPresets[cameraFocus]) {
        const preset = cameraPresets[cameraFocus]
        camera.position.lerp(new THREE.Vector3(...preset.position), 0.06)
        lookTarget.lerp(new THREE.Vector3(...preset.lookAt), 0.08)
        camera.lookAt(lookTarget)
      }

      conceptualDroplet.position.y = 0.55 - ((time * 0.00035) % 0.7)
      const pulse = 0.88 + (Math.sin(time * 0.008) + 1) * 0.22
      conceptualPlasma.scale.setScalar(pulse)
      ;(conceptualPlasma.material as THREE.MeshBasicMaterial).opacity = 0.42 + (Math.sin(time * 0.008) + 1) * 0.18

      moduleConfig.forEach((config) => {
        const mesh = objects.get(config.id)!
        mesh.position.x += ((config.base[0] + amount * config.factor) - mesh.position.x) * 0.1
        const meshMaterial = mesh.material as THREE.MeshStandardMaterial
        const hasAsset = mesh.userData.assetLoaded === true
        meshMaterial.opacity = hasAsset ? (config.id === selectedId ? 0.28 : 0.09) : (config.id === selectedId ? 1 : 0.82)
        meshMaterial.emissiveIntensity = config.id === selectedId ? 0.34 : 0.035
      })

      conceptNodes.forEach((mesh, nodeName) => {
        const highlighted = nodeName === nodeToHighlight
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        materials.forEach((entry) => {
          if (entry instanceof THREE.MeshStandardMaterial) {
            entry.emissive.setHex(highlighted ? 0x67e8f9 : 0x000000)
            entry.emissiveIntensity = highlighted ? 0.55 : 0
          }
        })
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

  return <div className="scanner-canvas" ref={mountRef}><div className="asset-layer-note">OpenEUV concept assets · source animation is illustrative, not timing/scale accurate</div><div className="canvas-help">drag to orbit · wheel to zoom · click a module or concept node</div><div className="canvas-caption">Public-source conceptual reconstruction · original OpenEUV glTF assets · not ASML CAD</div></div>
}
