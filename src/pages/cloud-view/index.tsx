import React, {ChangeEvent} from 'react'
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"
import BasicScene from "components/BasicScene"
import Form from 'react-bootstrap/Form'
import { Object3D } from 'three'
import ScaleButton from 'components/action-tools/ScaleButton'
import styles from './index.scss'
import { ButtonGroup, Button } from 'react-bootstrap'

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
              <ScaleButton
                className={styles.button}
                mesh={mesh}
                onClick={() => this.setState({ activePopover: 'scale' })}
                onClose={() => this.setState({ activePopover: undefined })}
                showContent={activePopover === 'scale'}
              />
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