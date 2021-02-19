import React, { PureComponent } from 'react'
import {
  AxesHelper,
  PerspectiveCamera,
  Points,
  Renderer,
  Scene,
} from 'three'
import { assembleScene, applyOrbitControls, initialCameraPosition } from 'components/BasicScene/util'

type Props = {
  getScene?: (scene: Scene) => void
  height: string,
  mesh: Points
  onAnimate: Function
  showAxes?: boolean
  width: string
  mouseInteraction?: boolean
}

export default class BasicScene extends PureComponent<Props> {
  state = {}

  static defaultProps = {
    width: '400px',
    height: '400px',
    onAnimate: Function.prototype,
    showAxes: false,
    mouseInteraction: false,
  }
  mount: HTMLDivElement
  scene: Scene
  camera: PerspectiveCamera
  renderer: Renderer
  frameId: number
  axesHelper: AxesHelper
  controls: ReturnType<typeof applyOrbitControls>

  constructor(props: Props) {
    super(props)
    this.axesHelper = new AxesHelper(3)
  }

  componentDidMount() {
    const { mouseInteraction, getScene, showAxes, mesh, onAnimate } = this.props
    const { scene, camera, renderer } = assembleScene(this.mount, mesh)

    this.scene = scene
    this.camera = camera
    this.renderer = renderer

    if (showAxes) {
      this.scene.add(this.axesHelper)
    }

    onAnimate && this.startAnimation()
    getScene && getScene(this.scene)
    mouseInteraction && applyOrbitControls(camera, renderer)
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { mouseInteraction, showAxes } = this.props

    if (showAxes && prevProps.showAxes !== showAxes) {
      this.scene.add(this.axesHelper)
    } else if (!showAxes && prevProps.showAxes !== showAxes) {
      this.scene.remove(this.axesHelper)
    }

    if (mouseInteraction && prevProps.mouseInteraction !== mouseInteraction) {
      this.enableMouseInteraction(this.camera, this.renderer)
    } else if (!mouseInteraction && prevProps.mouseInteraction !== mouseInteraction) {
      this.controls.reset()
      this.controls.dispose()
    }
  }

  enableMouseInteraction = (camera: PerspectiveCamera, renderer: Renderer) => {
    this.controls = applyOrbitControls(camera, renderer)
  }

  startAnimation = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop = () => {
    this.frameId && cancelAnimationFrame(this.frameId)
  }

  animate = () => {
    this.props.onAnimate()
    this.rerenderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  rerenderScene = () => {
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
