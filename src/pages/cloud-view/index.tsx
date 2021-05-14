import React, { RefObject, createRef } from 'react'
import axios from 'axios'
import { Points, Scene, MeshBasicMaterial } from 'three'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'
import { Button } from 'react-bootstrap'
import BasicScene from "components/BasicScene"
import LoadingSpinner from 'components/LoadingSpinner'
import SceneControls from 'pages/cloud-view/SceneControls'
import Preview from 'components/Preview'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { apiURL } from 'utils'
import styles from './index.scss'
import {
  Trash as TrashIcon,
  Pencil as PencilIcon,
} from 'react-bootstrap-icons'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Modal from 'react-bootstrap/Modal'  
import Dropdown from 'react-bootstrap/Dropdown'

type State = {
  isLoading: boolean
  mesh?: Points
  meshCopy?: Points
  scene?: Scene
  mouseInteraction: boolean
  showAxes: boolean
  showOriginalCopy: boolean
  clouds: Cloud[]
  deleteID: Nullable<string>
}

type Props = {
  match: { params: { id: number } }
}

const DEFAULT_SCALE = 4

export default class CloudView extends React.PureComponent<Props, State> {
  state: State = {
    isLoading: false,
    mouseInteraction: false,
    showAxes: true,
    showOriginalCopy: false,
    clouds: [],
    deleteID: null
  }
  loader: PCDLoader = new PCDLoader()
  
  sceneContainer: RefObject<HTMLDivElement> = createRef()

  componentDidMount() {
    this.setState({ isLoading: true })
    axios({
      method: 'get',
      url: apiURL(`/api/point-clouds/${this.props.match.params.id}`),
    }).then((response) => {
      this.loader.load(apiURL(response.data.url), this.onLoad, this.onLoadProgress, this.onLoadError)
    })

    axios({
      url: apiURL('/api/point-clouds'),
    })
      .then((response) => {
        this.setState({ clouds: response.data })
      })
      .catch((response) => {
        console.log(response)
      })
  }

  confirmDelete = () => {
    const { deleteID } = this.state
    axios({
      method: 'DELETE',
      url: apiURL(`/api/point-clouds/${deleteID}`),
    })
      .then(response => {
        console.log(response)
        this.setState((state: State) => ({
          clouds: state.clouds.filter(cloud => cloud.id !== deleteID),
        }), () => {
          this.hideDeleteModal()
          alert('Nuvem deletada com sucesso')
        })
      })
      .catch(response => {
        console.log(response)
        alert('Erro ao deletar nuvem')
      })
  }

  showDeleteModal = (deleteID: string) => this.setState({ deleteID })

  hideDeleteModal = () => this.setState({ deleteID: null })

  
  onLoad = (mesh: Points) => {
    mesh.scale.fromArray([DEFAULT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE])
    this.setState({
      mesh,
      meshCopy: mesh.clone(),
    }, () => {
      try {
        this.state.mesh.material = new MeshBasicMaterial({color: 0xF76E6E, wireframe: true})
        this.state.meshCopy.material = new MeshBasicMaterial({color: 0xAAAAAA, wireframe: true})
      } catch(e) {
        console.warn(e)
      }
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

  onControlChange = (controls: Pick<State, 'showAxes' | 'mouseInteraction' | 'showOriginalCopy'>) => {
    const { meshCopy, scene, showOriginalCopy } = this.state

    if (controls.showOriginalCopy && showOriginalCopy !== controls.showOriginalCopy) {
      scene.add(meshCopy)
    } else if (showOriginalCopy !== controls.showOriginalCopy) {
      scene.remove(meshCopy)
    }

    this.setState({ ...controls })
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

  getSceneDimensions = () => ({
    height: `${this.sceneContainer.current.offsetHeight}px`,
    width: `${this.sceneContainer.current.offsetWidth}px`,
  })

  renderSceneContainer = () => {
    const {
      isLoading,
      mesh,
    } = this.state
    const { mouseInteraction, showAxes } = this.state
    const shouldRenderScene = mesh && this.sceneContainer.current && !isLoading

    return (
      <div className={styles.sceneContainer} ref={this.sceneContainer}>
        {isLoading && <LoadingSpinner label="Loading..." />}
        {shouldRenderScene && (
          <>
            <BasicScene
              mesh={mesh}
              showAxes={showAxes}
              mouseInteraction={mouseInteraction}
              getScene={this.sceneGetter}
              {...this.getSceneDimensions()}
            />
            {this.renderChangesViewer()}
          </>
        )}
      </div>
    )
  }

  
  render() {
    const { mesh } = this.state
    
    return (
      
      <Container className={styles.container}>
        <Row>
          <Col xs={2} className="mt-4">
            <Table striped bordered hover id='table-clouds' className={styles.table}> 
              <thead className={styles.thead}>
                {this.renderTableHeader()}
              </thead>
              <tbody className={styles.scrollTable}>
                {this.renderTableData()}
              </tbody> 
            </Table>
            <Button className={styles.includeBtn} variant="primary" href="/clouds/insert" size="sm">
                Insert New
              </Button>
              {this.renderDeleteModal()}
          </Col>
          <Col xs={10}>
            <div className={styles.page}> 
              <header>
                <h1 className={styles.h1}>View Point Cloud</h1>
                {/* <Button className="float-right btn-sm" children="Voltar" href="/clouds" /> */}
              </header>
              {this.renderSceneContainer()}
              <div id='footer' className={styles.footer}>
                {mesh && (
                <SceneControls
                  mesh={mesh}
                  onUpdate={this.rerender}
                  onChange={this.onControlChange}
                />
                )}
              </div> 
            </div>
          </Col> 
        </Row> 
      </Container> 
    )
  }

  renderTableHeader = () => (
    <tr id='table-header'>
      <th className={styles.previewCol}>Preview</th>
    </tr>
  )

  renderTableData = () => {
    return this.state.clouds.map(cloud => {
      const { id, name, url } = cloud

      return (
        <tr key={id}>
          <td>
            <Preview url={apiURL(url)}/>
            <ButtonGroup claaria-label="Basic example">
              <Button className={styles.actionBtn} href={`/clouds/edit/${id}`} variant="link" size="sm" title="Click to Edit">
                <PencilIcon className={styles.action}/>
              </Button>
              <Button className={styles.actionBtn} variant="link" onClick={() => this.showDeleteModal(id)} title="Click to Delete">
                <TrashIcon className={styles.action}/>
              </Button>
            </ButtonGroup>
          </td> 
        </tr>
      )
    })
  }
  renderDeleteModal = () => (
    <Modal show={this.state.deleteID !== null}>
      <Modal.Header>
        <Modal.Title>Deletar Nuvem</Modal.Title>
      </Modal.Header>
      <Modal.Body>Confirma a exclusão?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={this.hideDeleteModal}>
          Não
        </Button>
        <Button variant="primary" onClick={this.confirmDelete}>
          Sim
        </Button>
      </Modal.Footer>
    </Modal>
  )
}