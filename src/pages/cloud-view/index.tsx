import React, { ChangeEvent } from 'react'
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"
import BasicScene from "components/BasicScene"
import Form from 'react-bootstrap/Form'
import { Object3D } from 'three'
import ScaleButton from 'components/action-tools/ScaleButton'
import RotateButton from 'components/action-tools/RotateButton'
import { ButtonGroup } from 'react-bootstrap'
import styles from './index.scss'


type State = {
  activePopover?: 'rotate' | 'scale' | undefined
  mesh?: Object3D
  showAxes: boolean
}

export default class CloudView extends React.PureComponent<any, State>  {
  loader: PCDLoader

  constructor(props: {}) {
    super(props)
    this.loader = new PCDLoader()
    this.state = { showAxes: false }
  }

  componentDidMount() {
    this.loader.load('/assets/test-pcds/bunny.pcd', this.onLoad, this.onLoadProgress, this.onLoadError)
  }

  onLoad = (mesh: Object3D) => this.setState({ mesh })

  onLoadProgress = (xhr: ProgressEvent) => {
    console.log(Number(xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded')
  }

  onLoadError = (error: ErrorEvent) => {
    alert('Erro ao carregar nuvem de pontos :(')
    console.log('An error occurred: ', error)
  }

  render() {
    console.log('this.props.match.params', this.props.match)
    const { activePopover, mesh, showAxes } = this.state
    if (!mesh) return null

    return (
      <div className={styles.page}>
        <div className={styles.viewContent}>
          <BasicScene mesh={mesh} width="800px" height="400px" showAxes={showAxes} />
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
          <Form.Check
            checked={showAxes}
            label={<small>Show axes</small>}
            onChange={() => this.setState(state => ({ showAxes: !state.showAxes }))}
          />
        </div>
      </div>
    )
  }
}