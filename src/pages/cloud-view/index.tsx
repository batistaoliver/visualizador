import React from 'react'
import { Points, Scene, MeshBasicMaterial } from 'three'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'
import { Button, ButtonGroup } from 'react-bootstrap'
import BasicScene from "components/BasicScene"
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ScaleButton from 'components/action-tools/ScaleButton'
import RotateButton from 'components/action-tools/RotateButton'
import LoadingSpinner from 'components/LoadingSpinner'
import styles from './index.scss'
import TranslateButton from 'components/action-tools/TranslateButton'

type State = {
  activePopover?: 'rotate' | 'scale' | 'translate'
  isLoading: boolean
  mesh?: Points
  meshCopy?: Points
  mouseInteraction: boolean
  scene?: Scene
  showAxes: boolean
  showOriginalCopy: boolean
}

const DEFAULT_SCALE = 4

export default class CloudView extends React.PureComponent<any, State> {
  loader: PCDLoader = new PCDLoader()
  state: State = {
    showAxes: true,
    isLoading: false,
    mouseInteraction: true,
    showOriginalCopy: false,
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    this.loader.load(this.props.url, this.onLoad, this.onLoadProgress, this.onLoadError)
  }

  onLoad = (mesh: Points) => {
    mesh.scale.fromArray([DEFAULT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE])
    this.setState({
      mesh,
      meshCopy: mesh.clone(),
    }, () => {
      this.state.mesh.material = new MeshBasicMaterial( { color: 0xF76E6E, wireframe: true } );
      this.state.meshCopy.material = new MeshBasicMaterial( { color: 0xAAAAAA, wireframe: true } );
    })
    this.setState({ isLoading: false })
  }

  onLoadProgress = (xhr: ProgressEvent) => {
    console.log(Number(xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded')
  }

  onLoadError = (error: ErrorEvent) => {
    alert('Erro ao carregar nuvem de pontos :(')
    console.log('An error occurred: ', error)
    this.setState({ isLoading: false })
  }

  sceneGetter = (scene: Scene) => {
    this.setState({ scene })
  }

  renderChangesViewer = () => {
    const { mesh } = this.state
    const scales = mesh.scale.toArray()
    const rotations = mesh.rotation.toArray().map(rad => Math.round((180 * rad) / Math.PI) + '°')
    const positions = mesh.position.toArray()

    return (
      <div className={styles.changesViewer}>
        Rotation: [{rotations[0]}, {rotations[1]}, {rotations[2]}] <br />
        Translation: [{positions[0]}, {positions[1]}, {positions[2]}] <br />
        Scale: [{scales[0]}, {scales[1]}, {scales[2]}]
      </div>
    )
  }

  rerender = () => this.forceUpdate()

  toggleShowOriginalCopy = () => this.setState(state => ({ showOriginalCopy: !state.showOriginalCopy }), () => {
    const { meshCopy, scene, showOriginalCopy } = this.state

    if (showOriginalCopy) {
      scene.add(meshCopy)
    } else {
      scene.remove(meshCopy)
    }
  })

  render() {
    const {
      activePopover,
      isLoading,
      mesh,
      mouseInteraction,
      showAxes,
      showOriginalCopy,
    } = this.state

    if (isLoading) {
      return <LoadingSpinner label="Loading..." />
    }

    if (!mesh) return null

    return (
      <div className={styles.page}>
        <div className={styles.viewContent}>
          <Modal.Dialog className={styles.modalSize}>
            <Modal.Header>
              <Modal.Title>View Point Cloud</Modal.Title>
              <Button className="float-right btn-sm" children="Voltar" href="/clouds" />
            </Modal.Header>
            <Modal.Body className={styles.body}>
              <BasicScene
                mesh={mesh}
                width="65rem"
                height="27rem"
                showAxes={showAxes}
                mouseInteraction={mouseInteraction}
                getScene={this.sceneGetter}
              />
              {this.renderChangesViewer()}
            </Modal.Body>
            <Modal.Footer className={styles.footer}>
              <Form.Row className={styles.checkboxes}>
                <Form.Check
                  checked={showAxes}
                  label={<small>Show axes</small>}
                  onChange={() => this.setState(state => ({ showAxes: !state.showAxes }))}
                />
                <Form.Check
                  checked={mouseInteraction}
                  label={<small>Enable Mouse Camera Control</small>}
                  onChange={() => this.setState(state => ({ mouseInteraction: !state.mouseInteraction }))}
                />
                <Form.Check
                  checked={showOriginalCopy}
                  label={<small>Show Original Copy</small>}
                  onChange={this.toggleShowOriginalCopy}
                />
              </Form.Row>
              <ButtonGroup className={styles.buttonGroup}>
                <ScaleButton
                  className={styles.button}
                  mesh={mesh}
                  onClick={() => this.setState({ activePopover: 'scale' })}
                  onClose={() => this.setState({ activePopover: undefined })}
                  onUpdate={this.rerender}
                  showContent={activePopover === 'scale'}
                />
                <RotateButton
                  className={styles.button}
                  mesh={mesh}
                  onClick={() => this.setState({ activePopover: 'rotate' })}
                  onClose={() => this.setState({ activePopover: undefined })}
                  onUpdate={this.rerender}
                  showContent={activePopover === 'rotate'}
                />
                <TranslateButton
                  className={styles.button}
                  mesh={mesh}
                  onClick={() => this.setState({ activePopover: 'translate' })}
                  onClose={() => this.setState({ activePopover: undefined })}
                  onUpdate={this.rerender}
                  showContent={activePopover === 'translate'}
                />
              </ButtonGroup>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      </div>
    )
  }
}