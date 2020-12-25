import React, {Component} from 'react'
import BasicScene from "../../componentes/BasicScene";
import * as THREE from 'three'

class Scene extends Component {
  constructor(props) {
    super(props)
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({color: '#433F81'})
    this.cube = new THREE.Mesh(geometry, material)
  }

  onAnimate = () => {
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01
  }

  render() {
    return (
      <BasicScene mesh={this.cube} onAnimate={this.onAnimate}/>
    )
  }
}

export default Scene