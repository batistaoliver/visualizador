import React, {ChangeEvent} from 'react'
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader"
import BasicScene from "components/BasicScene"
import Form from 'react-bootstrap/Form'
import {Object3D} from 'three'
import styles from './index.scss'
import {ButtonGroup, Button} from 'react-bootstrap'

type State = { mesh?: Object3D }

export default class CloudView extends React.PureComponent<{}, State> {
  loader: PCDLoader

  constructor(props: {}) {
    super(props)
    this.loader = new PCDLoader()
    this.state = {}
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

  showScalePrompt = () => {

  }

  showRotatePrompt = () => {

  }

  render() {
    const showInput = !this.state.mesh

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
            <BasicScene mesh={this.state.mesh} width="800px" height="400px"/>
            <ButtonGroup className={styles.buttonGroup}>
              <Button className={styles.button} variant="secondary" size="sm" onClick={this.showScalePrompt}>Scale</Button>
              <Button className={styles.button} variant="secondary" size="sm" onClick={this.showRotatePrompt}>Rotate</Button>
            </ButtonGroup>
          </div>
        )}
      </div>
    )
  }
}