import React from 'react'
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"
import BasicScene from "components/BasicScene"
import Form from 'react-bootstrap/Form'
import { Object3D } from 'three'
import ScaleButton from 'components/action-tools/ScaleButton'
import RotateButton from 'components/action-tools/RotateButton'
import { ButtonGroup } from 'react-bootstrap'
import styles from './index.scss'
import { nextTick } from 'process'

type State = {
  activePopover?: 'rotate' | 'scale' | undefined
  mesh?: Object3D
  showAxes: boolean
}

type Props = {
    url: string 
  }

export default class CloudView extends React.PureComponent<Props, State> {
  loader: PCDLoader

  constructor(props: Props) {
    super(props)
    this.loader = new PCDLoader()
    this.state = { showAxes: false }
  }

  componentDidMount() {
    this.loader.load(this.props.url, this.onLoad, this.onLoadProgress, this.onLoadError)
  }

  onLoad = (mesh: Object3D) => {
      this.setState({ mesh })
      mesh.scale.set(8,8,8)
      mesh.translateY(-1)
  }

  onLoadProgress = (xhr: ProgressEvent) => {
    console.log(Number(xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded')
  }

  onLoadError = (error: ErrorEvent) => {
    alert('Erro ao carregar nuvem de pontos :(')
    console.log('An error occurred: ', error)
  }

  render() {
    const { activePopover, mesh, showAxes } = this.state
    if (!mesh) return null

    return (
      <div className={styles.page}>
        <div className={styles.viewContent}>
            <div className={styles.center}>
                <BasicScene mesh={mesh} width="300px" height="200px" showAxes={showAxes} /> 
            </div> 
        </div>
      </div>
    )
  }
}