import { PerspectiveCamera, Points, Renderer, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export const initialCameraPosition = [0, 0, 3]

export const assembleScene = (element: HTMLElement, mesh: Points) => {
  const width = element.clientWidth
  const height = element.clientHeight

  const scene = new Scene()
  const camera = new PerspectiveCamera(
    50,
    width / height,
    0.1,
    2000
  )
  const renderer = new WebGLRenderer({ antialias: true })

  camera.position.fromArray(initialCameraPosition)
  mesh.geometry.center()

  scene.add(mesh)
  renderer.setClearColor('#000000')
  renderer.setSize(width, height)

  element.appendChild(renderer.domElement)

  return { scene, camera, renderer }
}

export const applyOrbitControls = (camera: PerspectiveCamera, renderer: Renderer) => { // Mouse control
  const controls = new OrbitControls(camera, renderer.domElement)
  // controls.maxPolarAngle = Math.PI * 0.5
  controls.minDistance = 0
  // controls.maxDistance = 500

  return controls
}