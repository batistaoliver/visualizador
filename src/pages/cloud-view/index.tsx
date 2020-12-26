import React, {ChangeEvent} from 'react'
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader"
import BasicScene from "components/BasicScene"
import Form from 'react-bootstrap/Form'
import {Object3D} from 'three'
import styles from './index.scss'
import {ButtonGroup, Button, Popover, OverlayTrigger} from 'react-bootstrap'

type State = {
  mesh?: Object3D
  activePopover?: 'rotate' | 'scale' | undefined
  scale: number
}

export default class CloudView extends React.PureComponent<{}, State> {
  loader: PCDLoader

  constructor(props: {}) {
    super(props)
    this.loader = new PCDLoader()
    this.state = {
      scale: 1,
    }
  }

  onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const inputUrl = URL.createObjectURL(event.target.files[0])
    this.loader.load(inputUrl, this.onLoad, this.onLoadProgress, this.onLoadError)
  }

  onLoad = (mesh: Object3D) => this.setState({mesh})

  onLoadProgress = (xhr: ProgressEvent) => {
    console.log(Number(xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded')
  }

  onLoadError = (error: ErrorEvent) => {
    alert('Erro ao carregar nuvem de pontos :(')
    console.log('An error occurred: ', error)
  }

  onScaleChange = (event: ChangeEvent<any>) => {
    if (event.target.value && Number(event.target.value) !== 1) {
      const scale = Number(event.target.value)
      this.state.mesh.scale.set(scale, scale, scale)
      this.setState({ scale })
    }
  }

  renderScalePopover = () => {
    return (
      <Popover id="popover-basic">
        <Popover.Title as="h3">Scale</Popover.Title>
        <Popover.Content>
          <Form.Group>
            <Form.Control type="range" step="0.2" min="1" max="10" value={this.state.scale} onChange={this.onScaleChange}/>
          </Form.Group>
          <Button
            children="Close"
            className={styles.button}
            onClick={() => this.setState({activePopover: undefined})}
            size="sm"
            variant="secondary"
          />
        </Popover.Content>
      </Popover>
    )
  }

  showRotatePopover = (): null => {
    // TODO
    return null
  }

  render() {
    const {activePopover, mesh} = this.state
    const showInput = !mesh

    return (
      <div className={styles.page}>
        {showInput && (
          <Form>
            <Form.Group>
              <Form.File
                accept=".pcd"
                id="cloudPointInput"
                label="Selecione um arquivo .pcd válido"
                onChange={this.onFileSelect}
              />
            </Form.Group>
          </Form>
        )}

        {!showInput && (
          <div className={styles.viewContent}>
            <BasicScene mesh={mesh} width="800px" height="400px"/>
            <ButtonGroup className={styles.buttonGroup}>
              <OverlayTrigger placement="right" show={activePopover === 'scale'} overlay={this.renderScalePopover()}>
                <Button
                  children="Scale"
                  className={styles.button}
                  onClick={() => this.setState({activePopover: 'scale'})}
                  size="sm"
                  variant="secondary"
                />
              </OverlayTrigger>
              <Button
                children="Rotate"
                className={styles.button}
                size="sm"
                variant="secondary"
              />
            </ButtonGroup>
          </div>
        )}
      </div>
    )
  }
}