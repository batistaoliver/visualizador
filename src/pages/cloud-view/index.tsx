import React, { RefObject, createRef } from 'react'
import axios from 'axios'
import { Points, Scene, MeshBasicMaterial, PerspectiveCamera, Renderer, GridHelper} from 'three'
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
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
// @ts-ignore
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'

import {
  ColorGUIHelper,
  SizeGUIHelper,
} from '../../js/pcd-viewer/helpers/index'

type State = {
  isLoading: boolean
  mesh?: Points
  meshCopy?: Points
  meshList?: Points[]
  meshSelect?: Points
  scene?: Scene
  mouseInteraction: boolean
  showAxes: boolean
  showOriginalCopy: boolean
  clouds: Cloud[]
  deleteID: Nullable<string>
  camera?: PerspectiveCamera
  renderer?: Renderer

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
    deleteID: null,
    meshList:[]
  }
  loader: PCDLoader = new PCDLoader()
  mount: HTMLDivElement
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
    this.setState({ meshSelect: mesh })
    mesh.scale.fromArray([DEFAULT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE])
    this.setState(
      {
      mesh,
      meshCopy: mesh.clone(),
    }
    , () => {
      try {
        this.state.mesh.material = new MeshBasicMaterial({color: 0xF76E6E, wireframe: true})
        this.state.meshCopy.material = new MeshBasicMaterial({color: 0xAAAAAA, wireframe: true})
      } catch(e) {
        console.warn(e)
      }
    })
    this.setState({ isLoading: false })
    //this.addCloudScena(mesh)
  }

  onLoad2 = (mesh: Points) => {
    this.setState({ meshSelect: mesh })
    mesh.scale.fromArray([DEFAULT_SCALE, DEFAULT_SCALE, DEFAULT_SCALE])
    this.setState({
      mesh,
      meshCopy: mesh.clone(),
    }, () => {
      try {
        //this.state.mesh.material = new MeshBasicMaterial({color: 0xF76E6E, wireframe: true})
        //this.state.meshCopy.material = new MeshBasicMaterial({color: 0xAAAAAA, wireframe: true})
      } catch(e) {
        console.warn(e)
      }
    })
    this.setState({ isLoading: false })
    this.addCloudScena(mesh)
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

  cameraGetter = (camera: PerspectiveCamera) => {
    this.setState({ camera })
  }

  rendererGetter = (renderer: Renderer) => {
    this.setState({ renderer })
  }

  onControlChange = (controls: Pick<State, 'showAxes' | 'mouseInteraction' | 'showOriginalCopy'>) => {
    const { meshCopy, scene, showOriginalCopy } = this.state
    //console.log(meshCopy)
    if (controls.showOriginalCopy && showOriginalCopy !== controls.showOriginalCopy) {
      scene.add(meshCopy)
    } else if (showOriginalCopy !== controls.showOriginalCopy) {
      scene.remove(meshCopy)
    }

    this.setState({ ...controls })
  }

  renderChangesViewer = () => {
    const { meshSelect } = this.state
    const scales = meshSelect.scale.toArray()
    const rotations = meshSelect.rotation.toArray().map(rad => Math.round((180 * rad) / Math.PI) + '°')
    const positions = meshSelect.position.toArray()

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
    //console.log(mesh)
    return (
      <div className={styles.sceneContainer} ref={this.sceneContainer}>
        {isLoading && <LoadingSpinner label="Loading..." />}
        {shouldRenderScene && (
          <>
            <BasicScene
              showAxes={showAxes}
              mouseInteraction={mouseInteraction}
              getScene={this.sceneGetter}
              {...this.getSceneDimensions()}
              getCamera={this.cameraGetter}
              getRenderer={this.rendererGetter}
            />
            {this.renderChangesViewer()}
          </>
        )}
      </div>
    )
  }


  render() {
    const { meshSelect} = this.state
    //console.log(meshSelect)
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
                {meshSelect && (
                <SceneControls
                  mesh={meshSelect}
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
            <Button className={styles.cloudTdLink} onClick={() => this.insertNewCloud(url)} variant="link" size="sm">
              <Preview url={apiURL(url)}/>
            </Button>
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


  insertNewCloud = (url: string) => {
      this.loader.load(apiURL(url), this.onLoad2, this.onLoadProgress, this.onLoadError)
    }

  addCloudScena = (mesh: Points) => {

      //Adiciona a nuvem no centro da cena
      const { scene, meshList, camera} = this.state
      mesh.geometry.center()
      scene.add(mesh)
  
      //Preenchendo a lista de nuvens de pontos
      meshList.push(mesh)

      //Controles de cor e de tamanho da nuvem
      const gui = new GUI();
      var fileCounter = 1
      const guiColor = gui.addColor(new ColorGUIHelper(mesh.material, 'color'), 'value').name(`Color ${fileCounter}`);
      const guiSize = gui.add(new SizeGUIHelper(mesh.material, 'size'), 'value', 1, 5, 0.00001).name(`Size ${fileCounter}`);
      fileCounter += 1

      //Controlador para cada nuvem
      const tc = new TransformControls(this.state.camera, this.state.renderer.domElement)
      tc.attach(mesh)
      scene.add(tc)
      //tc.size = 1
      tc.setSize(0.5)

      var stringData = JSON.stringify(mesh.toJSON() );
      console.log(stringData)

      //configuração dos modos do controlador
      window.addEventListener('keydown', function(event) {
        switch (event.key) {
            case "t":
                tc.setMode("translate")
                break
            case "r":
                tc.setMode("rotate")
                break
            case "s":
                tc.setMode("scale")
                break
            case "+, =, num+":
                tc.setSize( tc.size + 0.1 );
                break
        }
    }) 

    tc.addEventListener('mouseDown', () => {
      this.setState({ meshSelect: mesh });   
    });

    tc.addEventListener('mouseUp', () => { 
      this.forceUpdate() 
    });
    
    if(meshList.length == 1){
      //Adicionar GridHelper
      const size = 10;
      const divisions = 10;
      const gridHelper = new GridHelper( size, divisions, 0x888888, 0x444444);
      scene.add( gridHelper );
      console.log("gridHelper")
    }
    
   
}

/**
 * Cria um objeto nuvem a partir de um THREE.Mesh
 * @param mesh Mesh da nuvem
 * @returns Objeto nuvem
 */
cloudMeshToCloudObj = (mesh) => { 
  const cloudObj = {
    numpts: 0,
    points: [], 
  };

  if (mesh) {
    const coords = mesh.geometry.attributes.position.array;

    for (let i = 0; i < coords.length; i += 3) {
      cloudObj.numpts += 1;
      cloudObj.points.push({
        x: coords[i],
        y: coords[i + 1],
        z: coords[i + 2],
      });
    }
  }

  return cloudObj; 
}
 
}


