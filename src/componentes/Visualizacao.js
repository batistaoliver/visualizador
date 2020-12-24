import React, {Component} from 'react' 
//import * as THREE from 'three';
        
import { PCDLoader } from '../../public/pcd-viewer/node_modules/three/build/three.module.js'
// import { TrackballControls} from 'three/examples/jsm/controls/TrackballControls.js'

// import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

//import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'

//import {ColorGUIHelper, SizeGUIHelper} from '../pcd-viewer/helpers/index.js'


export default class visualizacao extends Component{
    componentDidMount(){
//         var fileCounter = 1
// var center = new THREE.Vector3(0, 0, 0)

// function main() {
//   const canvas = document.querySelector('#c')
//   const renderer = new THREE.WebGLRenderer({canvas})
//   renderer.setPixelRatio(window.devicePixelRatio)
//   const scene = new THREE.Scene()
//   scene.background = new THREE.Color(0xf9f9f9)

//   const fov = 12
//   const aspect = window.innerWidth / window.innerHeigh
//   const near = 0.01
//   const far = 700
//   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
//   camera.position.x = 0.5
//   camera.position.z = -3
//   camera.up.set(0, 0, 1)

//   scene.add(camera)

//   const controls = new TrackballControls(camera, canvas)
//   {
//     controls.rotateSpeed = 3.0
//     controls.zoomSpeed = 0.3
//     controls.panSpeed = 0.2

//     controls.staticMoving = true

//     controls.minDistance = 0.3
//     controls.maxDistance = 0.3 * 100
//   }

//   // Carrega as nuvens
//   //loadClound('./js/Zaghetto.pcd', 'red', -.3);
//   //loadClound('./js/Zaghetto.pcd', 'black', .3);
//   //loadClound('./js/Zaghetto.pcd', 'orange', .0);

//   // Armazena os centros das nuvens
//   const cloundsCenter = {
//     'x': [],
//     'y': [],
//     'z': []
//   }
//   var input = document.getElementById("pcdInput")

//   const tc = new TransformControls(camera, canvas)

//   function loadClound(url, color = 'black', x = 0) {
//     const pointloader = new PCDLoader()
//     let inputUrl = URL.createObjectURL(input.files[0])
//     pointloader.load(inputUrl, function (points) {

//       // Define a cor dos pontos
//       points.material.color = new THREE.Color(color)
//       // Adiciona a núvem a cena
//       scene.add(points)
//       // Atualiza a posição x
//       points.position.x = x

//       const box = new THREE.Box3()
//       const mesh = new THREE.Mesh(
//         new THREE.SphereBufferGeometry(),
//         new THREE.MeshBasicMaterial()
//       )

// //console.log(points.geometry.boundingSphere.setFromPoints(points.geometry.boundingSphere.center))
// //console.log(points.geometry.boundingSphere.intersectsSphere(points.geometry.boundingSphere))

// //console.log(points.geometry.boundingSphere.getBoundingBox ( box ))

// // ensure the bounding box is computed for its geometry
// // this should be done only once (assuming static geometries)
// //mesh.geometry.computeBoundingBox();

// // ...

// // in the animation loop, compute the current bounding box with the world matrix
// //box.copy( mesh.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );

//       console.log(points.geometry.boundingSphere.center)

//       //console.log(points.geometry.boundingSphere.intersectsBox(box))

//       // Captura o centro da nuvem
//       const center = points.geometry.boundingSphere.center
//       cloundsCenter.x.push(center.x)
//       cloundsCenter.y.push(center.y)
//       cloundsCenter.z.push(center.z)
//       // Define o alvo como a media dos  centros das núvens
//       controls.target.set(arrayAverage(cloundsCenter.x),
//         arrayAverage(cloundsCenter.y),
//         arrayAverage(cloundsCenter.z))
//       controls.update()
//       // Instancia o controle de eixos

//       tc.attach(points)
//       tc.position.set(center.x, center.y, center.z)
// //points.position.set(center.x, center.y, center.z);
//       scene.add(tc)
//       // Desativa a camera enquando utiliza o TransformControls 
//       tc.addEventListener('dragging-changed', function (event) {
//         controls.enabled = !event.value
//       })
//     })
//   }

//   input.addEventListener('change', loadClound)

//   function arrayAverage(arr) {
//     return arr.reduce((p, c) => p + c, 0) / arr.length
//   }

//   function resizeRendererToDisplaySize(renderer) {
//     const canvas = renderer.domElement
//     const width = canvas.clientWidth
//     const height = canvas.clientHeight
//     const needResize = canvas.width !== width || canvas.height !== height
//     if (needResize) {
//       renderer.setSize(width, height, false)
//     }
//     return needResize
//   }

//   window.addEventListener('keydown', function (event) {
//     switch (event.key) {
//       case "g":
//         tc.setMode("translate")
//         break
//       case "r":
//         tc.setMode("rotate")
//         break
//       case "s":
//         tc.setMode("scale")
//         break
//     }
//   })

//   function render() {
//     if (resizeRendererToDisplaySize(renderer)) {
//       const canvas = renderer.domElement
//       camera.aspect = canvas.clientWidth / canvas.clientHeight
//       camera.updateProjectionMatrix()
//     }
//     controls.update()
//     renderer.render(scene, camera)

//     requestAnimationFrame(render)
//   }

//   renderer.render(scene, camera)
//   requestAnimationFrame(render)
// }

// main()
    }
    render(){
        return (
            <div className="visualizacao">
                 <div>
                    <label for="pcdInput">Carregue uma nuvem:</label><br/>
                        <input type="file" id="pcdInput" name="pcdInput" accept=".pcd"/>
                </div>
                <canvas id="c"></canvas>  
           </div>
        )
        
    }
}