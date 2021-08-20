import React, { RefObject, createRef } from 'react'
import axios from 'axios'
import { Points, Scene, MeshBasicMaterial, PerspectiveCamera, Renderer, GridHelper, Vector3, BufferGeometry, Float32BufferAttribute, PointsMaterial, ObjectLoader, Object3D} from 'three'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'
import { Button } from 'react-bootstrap'
import BasicScene from "components/BasicScene"
import LoadingSpinner from 'components/LoadingSpinner'
import SceneControls from 'pages/cloud-view/SceneControls'
import Preview from 'components/Preview'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import { apiURL } from 'utils'
import styles from './index.scss'
import {
  Trash as TrashIcon,
  Pencil as PencilIcon,
  EyeSlashFill as EyeSlashFill,
  EyeFill as EyeFill,
  PlayBtnFill as PlayBtnFill,
} from 'react-bootstrap-icons'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Modal from 'react-bootstrap/Modal'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
// @ts-ignore
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
//import {Popover} from 'react-bootstrap/Popover'

import {OverlayTrigger, Popover } from 'react-bootstrap'

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
  meshSourceICP?: Points
  meshTargetICP?: Points
  scene?: Scene
  mouseInteraction: boolean
  showAxes: boolean
  showOriginalCopy: boolean
  clouds: Cloud[]
  deleteID: Nullable<string>
  camera?: PerspectiveCamera
  renderer?: Renderer
  ControlObjetctSelect: TransformControls
  ControlObjetctList?: TransformControls[]
  gui: GUI;
  vect3DList: Vector3[],
  vect3DListSource: Vector3[],
  vect3DListTarget: Vector3[],
  vect3DTest: Vector3[],
  IdSelectCloud: Nullable<string>,
  idSource: string,
  idTarget: string,
  thICP: number,
  kICP: number,
  maxDistICP: number,
  closestTypeICP: string,
  activePopover?: 'ICP' ,
  rmse: number,
  overlayTriggerShow: boolean,
  overlayTriggerResultICPShow: boolean,
  Array: number[]
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
    meshList:[],
    ControlObjetctSelect: null,
    ControlObjetctList:[],
    gui: null,
    vect3DList: [],
    vect3DListSource: [],
    vect3DListTarget: [],
    vect3DTest: [],
    IdSelectCloud: null,
    idSource: null,
    idTarget: null,
    thICP: 0.0000001,
    kICP: 50,
    maxDistICP: 1000,
    closestTypeICP: 'bf',
    rmse: null,
    overlayTriggerShow: false,
    overlayTriggerResultICPShow: false,
    Array:[]

    
  }
  loader: PCDLoader = new PCDLoader()
  mount: HTMLDivElement
  sceneContainer: RefObject<HTMLDivElement> = createRef()

  hidePopover = () => this.setState({ overlayTriggerShow: false })
  showPopover = () => this.setState({ overlayTriggerShow: true })

  hidePopoverResultICP = () => this.setState({ overlayTriggerResultICPShow: false })
  showPopoverResultICP = () => this.setState({ overlayTriggerResultICPShow: true })

  handleChangethICP = (event: any) => {
    this.setState({ thICP: event.target.valueAsNumber })
  }
  handleChangekICP = (event: any) => {
    this.setState({ kICP: event.target.valueAsNumber })
  }
  handleChangeMaxDistICP = (event: any) => {
    this.setState({ maxDistICP: event.target.valueAsNumber })
  }
  handleChangeClosestTypeICP = (event: any) => {
    this.setState({ closestTypeICP: event.target.value })
  }

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
    }
    , () => {
      try {
        //this.state.mesh.material = new MeshBasicMaterial({color: 0xF76E6E, wireframe: true})
        //this.state.meshCopy.material = new MeshBasicMaterial({color: 0xAAAAAA, wireframe: true})
      } catch(e) {
        console.warn(e)
      }
    })
    this.setState({ isLoading: false }) 

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
    const { meshCopy, scene, showOriginalCopy,meshList, ControlObjetctList } = this.state

    //Se o checkbox "show copy original" foi clicado
    if (controls.showOriginalCopy && showOriginalCopy !== controls.showOriginalCopy) {
      if(meshCopy.name.includes(".pcd")){
        meshCopy.name = meshCopy.name.replace(".pcd"," - Copy") 
        //atribui a cor verde para a nuvem cópia
        const material = new PointsMaterial({
          size: 0.001,
        });
        material.color.set('#0cf423');
        meshCopy.material= material
      }
      scene.add(meshCopy)
      meshList.push(meshCopy)

      //Controlador
      const tc = new TransformControls(this.state.camera, this.state.renderer.domElement)
      tc.attach(meshCopy)
      scene.add(tc)
      tc.setSize(0.5)
      this.setState({ ControlObjetctSelect: tc  });
      ControlObjetctList.push(tc);

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

    //eventos do controlador
    tc.addEventListener('mouseDown', () => {
      //Salva a seleção atual em estado
      this.setState({ meshSelect: meshCopy, ControlObjetctSelect: tc  });

      //Destaca o objeto selecionado
      for( var i = 0; i < meshList.length; i++){
        ControlObjetctList[i].setSize(0.3)
      }
      tc.setSize(1)
      const {meshSelect} = this.state
       //Set o controlador GUI para a nuvem selecionada
       const{gui} = this.state;
       gui.destroy()
       const newGui = new GUI()
       var fileCounter = 1
       console.log(meshSelect)
       const guiColor = newGui.addColor(new ColorGUIHelper(meshSelect.material, 'color'), 'value').name(`Color ${fileCounter}`);
       const guiSize = newGui.add(new SizeGUIHelper(meshSelect.material, 'size'), 'value', 1, 5, 0.00001).name(`Size ${fileCounter}`);
       fileCounter += 1
       this.setState({ gui: newGui })

    });

    tc.addEventListener('mouseUp', () => {
      this.forceUpdate()
    });

    } else if (showOriginalCopy !== controls.showOriginalCopy) {
      scene.remove(meshCopy)

      //remove o controlador da nuvem
      for( var i = 0; i < ControlObjetctList.length; i++){
        if(ControlObjetctList[i].object){
         if ( ControlObjetctList[i].object.uuid === meshCopy.uuid) {
          ControlObjetctList[i].detach();
          scene.remove(ControlObjetctList[i])
          }
        }
      }
      //Remove a nuvem da lista de nuvens
      for( var i = 0; i < meshList.length; i++){

        if ( meshList[i].uuid === meshCopy.uuid) {

          meshList.splice(i, 1);
       }
      }

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
      mesh
    } = this.state
    const { mouseInteraction, showAxes } = this.state
    const shouldRenderScene = mesh && this.sceneContainer.current && !isLoading
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
            
            {this.insertGridHelper()}
            {this.inclinacaoPerspectiveCamera()}
            {this.informationsTransformControl()} 
          </>
        )}
      </div>
    )
  }


  render() {
    const { meshSelect} = this.state
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
              <tbody>
              {this.btnNewCloudList()}
              </tbody>
            </Table>
            <Button variant="danger" onClick={() => this.deleteMeshScene(meshSelect)} size="sm" >
                Delete
            </Button><br></br>
            <Button  variant="primary" className="mt-2" onClick={() => this.save()} size="sm">
                Save
            </Button><br></br>
              {this.renderDeleteModal()}
          </Col>
          <Col xs={10}>
            <div className={styles.page}>
              <header>
                <h1 className={styles.h1}>View Point Cloud</h1>
              </header>
              {this.renderSceneContainer()}
              <Row>
              <Col xs={3}>
              <div id='footer' className={styles.footer}>
                {meshSelect && (
                <SceneControls
                  mesh={meshSelect}
                  onUpdate={this.rerender}
                  onChange={this.onControlChange}
                />
                )}
              </div>
              </Col>
              <Col xs={8}> 
                <Table className={styles.tableIconsScroll}>
                  <thead className={styles.tableIcons}>
                  <tr>
                    <td><h6><b>Cloud List</b></h6></td>
                    <td ><h6><b>Source</b></h6></td>
                    <td ><h6><b>Target</b></h6></td>
                  </tr>
                  </thead> 
                  <tbody className={styles.tableIcons}>
                    {this.renderTablecloudsScene()} 
                  </tbody>
                </Table>
              </Col>
              <Col xs={1} className="mt-2"> 
              {this.renderOverlayTrigger()}
              </Col>
              </Row>
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
            <Button className={styles.cloudTdLink} onClick={() => this.insertNewCloud(url,id)} variant="link" size="sm">
              <Preview url={apiURL(url)}/>
            </Button>
            <ButtonGroup claaria-label="Basic example">
              <Button className={styles.actionBtn} variant="link" onClick={() => this.showDeleteModal(id)} size="sm" title="Click to Delete">
                <TrashIcon className={styles.action}/>
              </Button>
              <Button className={styles.actionBtn} href={`/clouds/edit/${id}`} variant="link" size="sm" title="Click to Edit">
                <PencilIcon className={styles.action}/>
              </Button>
            </ButtonGroup>
          </td>
        </tr>
      )
    })
  }
  btnNewCloudList = () => {
      return (
        <tr>
          <td>
            <Button className={styles.includeBtn} variant="primary" href="/clouds/insert" size="sm">
              Upload
            </Button>
          </td>
        </tr>
      )
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

  insertNewCloud = (url: string, Id: string) => {
      this.loader.load(apiURL(url), this.onLoad2, this.onLoadProgress, this.onLoadError)
      this.setState({ IdSelectCloud: Id })
    }

  //Adiciona a nuvem no centro da cena
  addCloudScena = (mesh: Points) => {
 
      const { scene, meshList, ControlObjetctList, meshSelect} = this.state

      mesh.name = mesh.name.replace(".pcd"," (") + mesh.id + ")"
      mesh.geometry.center()
      scene.add(mesh)

      //Preenchendo a lista de nuvens de pontos
      meshList.push(mesh)

      //Controles de cor e de tamanho da nuvem
      if(meshList.length===1){
        const gui = new GUI()
        var fileCounter = 1
        const guiColor = gui.addColor(new ColorGUIHelper(meshSelect.material, 'color'), 'value').name(`Color ${fileCounter}`);
        const guiSize = gui.add(new SizeGUIHelper(meshSelect.material, 'size'), 'value', 1, 5, 0.00001).name(`Size ${fileCounter}`);
        fileCounter += 1
        this.setState({ gui: gui })
      }

      //Controlador para cada nuvem
      const tc = new TransformControls(this.state.camera, this.state.renderer.domElement)
      tc.attach(mesh)
      scene.add(tc)
      tc.setSize(0.5)
      this.setState({ ControlObjetctSelect: tc  });
      ControlObjetctList.push(tc);

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
      //Salva a seleção atual em estado
      this.setState({ meshSelect: mesh, ControlObjetctSelect: tc  });

      //Destaca o objeto selecionado
      for( var i = 0; i < meshList.length; i++){
        ControlObjetctList[i].setSize(0.3)
      }
      tc.setSize(1)

      //Set o controlador GUI para a nuvem selecionada
      const{gui} = this.state;
      gui.destroy()
      const newGui = new GUI()
      var fileCounter = 1
      const guiColor = newGui.addColor(new ColorGUIHelper(meshSelect.material, 'color'), 'value').name(`Color ${fileCounter}`);
      const guiSize = newGui.add(new SizeGUIHelper(meshSelect.material, 'size'), 'value', 1, 5, 0.00001).name(`Size ${fileCounter}`);
      fileCounter += 1
      this.setState({ gui: newGui })


    });

    tc.addEventListener('mouseUp', () => {
      this.forceUpdate() 
    });

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

/**
 * Cria um THREE.Mesh a partir de um objeto nuvem
 * @param cloudObj Objeto nuvem
 * @param color Cor aplicada no material (ex: #ff0000)
 * @param pointSize Tamanho do ponto (ex: #ff0000)
 * @returns
 */
 cloudObjToCloudMesh = (cloudObj, color, pointSize) => {
  const geometry = new BufferGeometry();
  const pointArr = cloudObj.points.reduce((res, e, i) => {
    res[i * 3] = e.x;
    res[i * 3 + 1] = e.y;
    res[i * 3 + 2] = e.z;
    return res;
  }, new Array(cloudObj.points.length * 3));

  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(pointArr, 3)
  );
  geometry.computeBoundingSphere();

  const material = new PointsMaterial({
    size: pointSize,
  });
  material.color.set(color);

  const mesh = new Points(geometry, material);
  //mesh.length = cloudObj.points.length;
  return mesh;
}


deleteMeshScene = (mesh: Points) => {
  const{scene, ControlObjetctSelect, meshList, gui} = this.state
  //remove o controlador da nuvem
  ControlObjetctSelect.detach();
  scene.remove(ControlObjetctSelect)

  //Remove a nuvem da lista de nuvens
  for( var i = 0; i < meshList.length; i++){

    if ( meshList[i].uuid === mesh.uuid) {

          meshList.splice(i, 1);
    }
  }
  if(meshList.length===0){
    gui.destroy()
  }
  scene.remove(mesh)
  this.forceUpdate()
}

deleteMeshSceneIcons = (mesh: Points) => {
  const{scene, meshList,ControlObjetctList, gui} = this.state
  //remove o controlador da nuvem
  for( var i = 0; i < ControlObjetctList.length; i++){
     if(ControlObjetctList[i].object){
      if ( ControlObjetctList[i].object.uuid === mesh.uuid) {
        ControlObjetctList[i].detach();
        scene.remove(ControlObjetctList[i])
      }
     }
  }
  //Remove a nuvem da lista de nuvens
  for( var i = 0; i < meshList.length; i++){

    if ( meshList[i].uuid === mesh.uuid) {

          meshList.splice(i, 1);
    }
  }
  if(meshList.length===0){
    gui.destroy()
  }
  scene.remove(mesh)

  this.forceUpdate()}


inclinacaoPerspectiveCamera = () => {
  const {camera} = this.state

  if(camera){
    camera.position.set( 0,1,2.5);
    camera.lookAt(new Vector3(0,0,0));
  }
}

insertGridHelper = () => {
  const {scene} = this.state

  if(scene){
    const size = 8;
    const divisions = 12;
    const gridHelper = new GridHelper( size, divisions, 0x888888, 0x444444);
    scene.add( gridHelper );
  }

}

informationsTransformControl = () => {
    return (
      <div className={styles.informationsTransformControl}>
        Eixos Objeto: "R" rotate | "S" scale | "T" translate
      </div>
    )
}

renderTablecloudsScene = () => {
  
  return this.state.meshList.map(mesh => {
    const { id, name } = mesh
    const meshIcon = mesh
    if(mesh.visible==true){
      return (
        <tr key={id}> 
          <td >
            {name}
            <ButtonGroup claaria-label="Basic example">
            <Button  variant="link" onClick={() => this.deleteMeshSceneIcons(meshIcon)} size="sm" title="Click to Delete">
                  <TrashIcon className={styles.action}/>
            </Button>
            <Button  variant="link" onClick={() => this.visibleMesh(meshIcon)} size="sm" title="Click to invisible">
                <EyeFill className={styles.action} />
            </Button> 
            </ButtonGroup>
          </td>
          <td >
          <Form.Check  
            onChange={() => this.setState({ idSource: id.toString()})}  
            />
          </td>
          <td >
          <Form.Check 
            onChange={() => this.setState({ idTarget: id.toString()})} 
            />
          </td>
        </tr>
      )
    } else{
      return (
        <tr key={id}>
          <td >
            {name}
            <ButtonGroup claaria-label="Basic example">
            <Button  variant="link" onClick={() => this.deleteMeshSceneIcons(meshIcon)} size="sm" title="Click to Delete">
                  <TrashIcon className={styles.action}/>
            </Button>
            <Button  variant="link" onClick={() => this.visibleMesh(meshIcon)} size="sm" title="Click to visible">
                <EyeSlashFill className={styles.action} />
            </Button>
            </ButtonGroup>
            </td>
          <td >
          <Form.Check
            onChange={() => this.setState({ idSource: id.toString() })}  
            />
          </td>
          <td >
          <Form.Check
            onChange={() => this.setState({ idTarget: id.toString() })} 
              />
          </td>
        </tr>
      )
    }
  })
  
}

// Habilita e desabilita a visibilidade da nuvem e dos eixos
visibleMesh = (mesh: Points) => {
  const {ControlObjetctList} = this.state

    if (mesh.visible == true){
      mesh.visible = false
      for( var i = 0; i < ControlObjetctList.length; i++){
        if(ControlObjetctList[i].object){
          if ( ControlObjetctList[i].object.uuid === mesh.uuid) {
            ControlObjetctList[i].showX = false
            ControlObjetctList[i].showY = false
            ControlObjetctList[i].showZ = false
          }
        }
      }
    }else{
      mesh.visible = true
      for( var i = 0; i < ControlObjetctList.length; i++){
        if(ControlObjetctList[i].object){
          if ( ControlObjetctList[i].object.uuid === mesh.uuid) {
            ControlObjetctList[i].showX = true
            ControlObjetctList[i].showY = true
            ControlObjetctList[i].showZ = true
          }
        }
      }
    }
    this.forceUpdate()
}

save = () => {
  var {meshSelect, vect3DList,IdSelectCloud} = this.state
  var objeto = this.cloudMeshToCloudObj(meshSelect);
      var listvet3 :  Vector3[];
      for (let i = 0; i < objeto.numpts; i += 1) {
        var vetor3 = new Vector3(objeto.points[i].x,objeto.points[i].y,objeto.points[i].z)
        vetor3.applyMatrix4(meshSelect.matrix)
        vect3DList.push(vetor3)
      }
      const cloudObj = {
        numpts: vect3DList.length,
        points: [] = vect3DList,
      };

      axios({
        method: 'post',
        data: { json: cloudObj },
        url: apiURL(`/api/point-clouds/override-from-json/${IdSelectCloud}`),
      })
      .then(response => {
        console.log(response)
      })
      .catch(response => {
        console.log(response)
      })

}


  runICP = () => {
            const { thICP, kICP, maxDistICP,closestTypeICP,idSource,idTarget,meshList,scene,ControlObjetctList,Array } = this.state
           
            if(idSource===null ||idTarget ===null){
              alert("Selecione uma nuvenm source e uma nuvem target") 
            }
            else if(idSource===idTarget){  
              alert("Selecione Nuvens distintas para source e Target") 
            }else{
            if(meshList.length>0){
              for( var i = 0; i < meshList.length; i++){
                if(meshList[i].id.toString()===idSource){
                  var meshSource = meshList[i]; 
                  this.setState({ meshSourceICP: meshSource }) 
                }
              }
            }

            if(meshList.length>0){
              for( var i = 0; i < meshList.length; i++){
                if(meshList[i].id.toString()===idTarget){
                  var meshTarget = meshList[i];
                  //console.log(meshTarget)
                  this.setState({ meshTargetICP: meshTarget }) 
                }
              }
            }
           const {vect3DListSource,vect3DListTarget, rmse} = this.state

           var ObjMeshSource = this.cloudMeshToCloudObj(meshSource); 
           for (let i = 0; i < ObjMeshSource.numpts; i += 1) {
            var vetor3 = new Vector3(ObjMeshSource.points[i].x,ObjMeshSource.points[i].y,ObjMeshSource.points[i].z) 
            vetor3.applyMatrix4(meshSource.matrix)
            vect3DListSource.push(vetor3) 
          } 
          const cloudObjSource = {
            numpts: vect3DListSource.length,
            points: [] = vect3DListSource,
          }; 

          var ObjMeshTarget = this.cloudMeshToCloudObj(meshTarget);
           
          for (let i = 0; i < ObjMeshTarget.numpts; i += 1) {
            var vetor3 = new Vector3(ObjMeshTarget.points[i].x,ObjMeshTarget.points[i].y,ObjMeshTarget.points[i].z) 
            vetor3.applyMatrix4(meshTarget.matrix)
            vect3DListTarget.push(vetor3) 
          } 
          const cloudObjTarget = {
            numpts: vect3DListTarget.length,
            points: [] = vect3DListTarget,
          }; 
 
          const data = {
            "source": cloudObjSource,
            "target": cloudObjTarget,
            "th": thICP,
            "k": kICP,
            "maxDist": maxDistICP,
            "closestType": closestTypeICP
          } 
          axios({
            method: 'post',
            data,
            url: apiURL(`/api/point-clouds/registration-icp`),
          })
          .then(response => {
            console.log(response.data)
            var nuvemIcp = this.cloudObjToCloudMesh(response.data.algnCloud, '#1c30ea', 0.001)
            nuvemIcp.name = "ICP result (" + meshSource.name + " and " + meshTarget.name +")"
            scene.add(nuvemIcp)
            meshList.push(nuvemIcp)

            //preenche a matriz de transformação
            Array.push(parseFloat(response.data.tm[0][0].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[1][0].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[2][0].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[3][0].re.toFixed(5)))

            Array.push(parseFloat(response.data.tm[0][1].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[1][1].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[2][1].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[3][1].re.toFixed(5)))

            Array.push(parseFloat(response.data.tm[0][2].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[1][2].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[2][2].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[3][2].re.toFixed(5)))

            Array.push(parseFloat(response.data.tm[0][3].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[1][3].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[2][3].re.toFixed(5)))
            Array.push(parseFloat(response.data.tm[3][3].re.toFixed(5)))

            this.setState({Array:Array}) 

            //Calcula o RMSE
            const data = {
              "source": response.data.algnCloud,
              "target": cloudObjTarget,
              "maxDist": maxDistICP,
              "closestType": closestTypeICP
            } 
            
            axios({
              method: 'post',
              data,
              url: apiURL(`/api/point-clouds/cloud-rmse`),
            })
            .then(response => {
              this.setState({rmse:response.data.rsme}) 
            })
            .catch(response => {
              console.log(response) 
            })


               //Controlador
            const tc = new TransformControls(this.state.camera, this.state.renderer.domElement)
            tc.attach(nuvemIcp)
            scene.add(tc)
            tc.setSize(0.5)
            this.setState({ ControlObjetctSelect: tc  });
            ControlObjetctList.push(tc);

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

            //eventos do controlador
            tc.addEventListener('mouseDown', () => {
              //Salva a seleção atual em estado
              this.setState({ meshSelect: nuvemIcp, ControlObjetctSelect: tc  });

              //Destaca o objeto selecionado
              for( var i = 0; i < meshList.length; i++){
                ControlObjetctList[i].setSize(0.3)
              }
              tc.setSize(1)

              //Set o controlador GUI para a nuvem selecionada
              const{gui} = this.state;
              gui.destroy()
              const newGui = new GUI()
              var fileCounter = 1
              const guiColor = newGui.addColor(new ColorGUIHelper(nuvemIcp.material, 'color'), 'value').name(`Color ${fileCounter}`);
              const guiSize = newGui.add(new SizeGUIHelper(nuvemIcp.material, 'size'), 'value', 1, 5, 0.00001).name(`Size ${fileCounter}`);
              fileCounter += 1
              this.setState({ gui: newGui })
            });

            tc.addEventListener('mouseUp', () => {
              this.forceUpdate()
            });
 
          })
          .catch(response => {
            console.log(response) 
          })

        }}

 
  renderPopover = () => { 
    return (
      <Popover id="icpPopover">
        <Popover.Title as="h3">Parâmetros ICP</Popover.Title>
        <Popover.Content>
          <Form.Group>
            <Form.Label>Critério de parada (Th)</Form.Label>
            <Form.Control type="number" defaultValue={this.state.thICP} onChange={this.handleChangethICP} step="0.0000001"/>
            <Form.Label>Quantidade máxima de iterações (K)</Form.Label>
            <Form.Control type="number" defaultValue={this.state.kICP} onChange={this.handleChangekICP}/>
            <Form.Label>Distância máxima entre pontos(max_dist)</Form.Label>
            <Form.Control type="number"  defaultValue={this.state.maxDistICP} onChange={this.handleChangeMaxDistICP}/>
            <Form.Label>Algoritmo Utilizado (Closest_Type)</Form.Label>
            <Form.Control  placeholder="Enter email" as="select" defaultValue={this.state.closestTypeICP} onChange={this.handleChangeClosestTypeICP}>
              <option>bf</option>
              <option>tree</option>
            </Form.Control>
          </Form.Group>
          <Button  variant="primary" onClick={() => this.runICP()} className={styles.button} size="sm" title="Click to Run ICP">
            Run ICP
          </Button>
          <Button
            children="Close"
            className={styles.button}
            onClick={() => this.hidePopover()}
            size="sm"
            variant="secondary"
          />
          {this.renderOverlayTriggerResultICP()} 
        </Popover.Content>
      </Popover>
    )
  }

  renderOverlayTrigger() {
    const {overlayTriggerShow} = this.state
    return (
      <OverlayTrigger trigger="click" show={overlayTriggerShow}  placement="top" overlay={this.renderPopover()}>
        <Button onClick={() => this.showPopover()}
          children="ICP"
          size="sm"
          variant="secondary"
        />
      </OverlayTrigger>
    )
  }

  renderPopoverResultICP = () => { 
    var {Array,rmse} = this.state
    var calculo = (Array[0] + Array[5] +  Array[10] - 1) / 2 
    console.log(calculo)
    var rad = Math.acos(calculo)
    var angulo =  ((180 * rad) / Math.PI).toFixed(5) + '°'
    if(rmse){
      rmse = parseFloat(rmse.toFixed(5))
    }
    return (
      <Popover id="resultICPPopover" className={styles.popover}>
        <Popover.Title as="h3">Resultados ICP</Popover.Title>
        <Popover.Content>
          <Form.Group>
          <Form.Label><b>Matriz de transformação:</b></Form.Label>
            <Row className={styles.colMatrixTop}>
              <Col xs={3} >{Array[0]} 
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[4]}
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[8]}
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[12]}
              </Col>
            </Row>
            <Row className={styles.colMatrixTop}>
              <Col xs={3}>{Array[1]}
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[5]}
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[9]}
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[13]}
              </Col>
            </Row>
            <Row className={styles.colMatrixTop}>
              <Col xs={3}>{Array[2]}
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[6]}
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[10]}
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[14]}
              </Col>
            </Row>
            <Row className={styles.colMatrixBottom}>
              <Col xs={3}>{Array[3]}
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[7]}
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[11]}
              </Col>
              <Col xs={3} className={styles.colMatrixLeft}>{Array[15]}
              </Col>
            </Row>
            <Form.Label className="mt-2"><b>Ângulo:</b> {angulo}</Form.Label><br/>
            <Form.Label className="mt-2"><b>Rmse:</b> {rmse}</Form.Label>
          </Form.Group> 
          <Button
            children="Close"
            className={styles.button}
            onClick={() => this.hidePopoverResultICP()}
            size="sm"
            variant="secondary"
          />
        </Popover.Content>
      </Popover>
    )
  }

  renderOverlayTriggerResultICP() {
    const {overlayTriggerResultICPShow} = this.state
    return (
      <OverlayTrigger trigger="click" show={overlayTriggerResultICPShow}  placement="top" overlay={this.renderPopoverResultICP()}>
        <Button onClick={() => this.showPopoverResultICP()}
          children="Results"
          size="sm"
          variant="secondary"
        />
      </OverlayTrigger>
    )
  }
    
}





