import React, { PureComponent } from 'react'
import * as THREE from 'three'
import {Points, Scene, Camera, Renderer, Vector3} from 'three'
import {getMeshCenterPoint} from 'utils'

type Props = {
  width: string,
  height: string,
  onAnimate: Function
  mesh: Points
  showAxes?: boolean
}

export default class BasicScene extends PureComponent<Props> {
  state= {}

  static defaultProps = {
    width: '400px',
    height: '400px',
    onAnimate: Function.prototype,
    showAxes: false,
  }
  mount: HTMLDivElement
  scene: Scene
  camera: Camera
  renderer: Renderer
  frameId: number
  axesHelper: THREE.AxesHelper

  constructor(props: Props) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
    this.axesHelper = new THREE.AxesHelper(3)
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      2000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    camera.position.z = 3
    this.props.mesh.geometry.center()

    scene.add(this.props.mesh)
    renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    this.scene = scene
    this.camera = camera
    this.renderer = renderer

    if (this.props.showAxes) {
      this.scene.add(this.axesHelper)
    }

    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.showAxes && prevProps.showAxes !== this.props.showAxes) {
      this.scene.add(this.axesHelper)
    } else if (!this.props.showAxes && prevProps.showAxes !== this.props.showAxes) {
      this.scene.remove(this.axesHelper)
    }
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  animate() {
    this.props.onAnimate()
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    const { height, width } = this.props

    return (
      <div
        style={{ width, height }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}
