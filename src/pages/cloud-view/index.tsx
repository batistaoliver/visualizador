import React from 'react'
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"
import BasicScene from "components/BasicScene"
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { Points } from 'three'
import ScaleButton from 'components/action-tools/ScaleButton'
import RotateButton from 'components/action-tools/RotateButton'
import { Button, ButtonGroup } from 'react-bootstrap'
import styles from './index.scss'
import LoadingSpinner from 'components/LoadingSpinner'

type State = {
  activePopover?: 'rotate' | 'scale' | undefined
  mesh?: Points
  showAxes: boolean
  isLoading: boolean
  mouseInteraction: boolean
}

const DEFAULT_SCALE = 3

export default class CloudView extends React.PureComponent<any, State> {
  loader: PCDLoader = new PCDLoader()
  state: State = { showAxes: false, isLoading: false, mouseInteraction: false }

  componentDidMount() {
    this.setState({ isLoading: true })
    this.loader.load(this.props.url, this.onLoad, this.onLoadProgress, this.onLoadError)
  }

  onLoad = (mesh: Points) => {
    mesh.scale.fromArray([DEFAULT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE])
    this.setState({ mesh })
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

  render() {
    const { activePopover, isLoading, mesh, mouseInteraction, showAxes } = this.state

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
            <Modal.Body>
              <BasicScene
                mesh={mesh}
                width="1065px"
                height="400px"
                showAxes={showAxes}
                mouseInteraction={mouseInteraction}
              />
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
              </Form.Row>
            </Modal.Body>
            <Modal.Footer>
              <ButtonGroup className={styles.buttonGroup}>
                <ScaleButton
                  className={styles.button}
                  mesh={mesh}
                  onClick={() => this.setState({ activePopover: 'scale' })}
                  onClose={() => this.setState({ activePopover: undefined })}
                  showContent={activePopover === 'scale'}
                />
                <RotateButton
                  className={styles.button}
                  mesh={mesh}
                  onClick={() => this.setState({ activePopover: 'rotate' })}
                  onClose={() => this.setState({ activePopover: undefined })}
                  showContent={activePopover === 'rotate'}
                />
              </ButtonGroup>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      </div>
    )
  }
}