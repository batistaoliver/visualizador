import React, { PureComponent } from 'react'
import BasicScene from "components/BasicScene";
import * as THREE from 'three'
import { Object3D } from 'three'

type Props = {}

class Scene extends PureComponent<Props> {
  cube: Object3D

  constructor(props: Props) {
    super(props)
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
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