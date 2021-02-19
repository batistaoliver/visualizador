import React from 'react'
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader"
import BasicScene from "components/BasicScene"
import {Object3D} from 'three'
import styles from './index.scss'
import LoadingSpinner from 'components/LoadingSpinner'

type State = {
  activePopover?: 'rotate' | 'scale' | undefined
  mesh?: Object3D
  showAxes: boolean
}

type Props = {
  url: string
}

const PREVIEW_SCALE = 6

export default class CloudView extends React.PureComponent<Props, State> {
  loader: PCDLoader

  constructor(props: Props) {
    super(props)
    this.loader = new PCDLoader()
    this.state = {showAxes: false}
  }

  componentDidMount() {
    this.loader.load(this.props.url, this.onLoad, this.onLoadProgress, this.onLoadError)
  }

  onLoad = (mesh: Object3D) => {
    mesh.scale.set(PREVIEW_SCALE, PREVIEW_SCALE, PREVIEW_SCALE)
    this.setState({ mesh })
  }

  onLoadProgress = (xhr: ProgressEvent) => {
    console.log(Number(xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded')
  }

  onLoadError = (error: ErrorEvent) => {
    alert('Erro ao carregar nuvem de pontos :(')
    console.log('An error occurred: ', error)
  }

  render() {
    const { mesh, showAxes } = this.state
    if (!mesh) {
      return <LoadingSpinner small />
    }

    return (
      <div className={styles.page}>
        <div className={styles.viewContent}>
          <div className={styles.center}>
            <BasicScene mesh={mesh} width="300px" height="200px" showAxes={showAxes}/>
          </div>
        </div>
      </div>
    )
  }
}