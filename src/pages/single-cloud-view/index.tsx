import React, { ChangeEvent } from 'react';
import SinglePointCloud from "../../components/SinglePointCloud";
import { Object3D } from 'three';
import styles from './index.scss';
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"

type State = { mesh?: Object3D }

export default class Main extends React.PureComponent<any, State> { 
  loader: PCDLoader

  constructor(props: {}) {
    super(props)
    this.loader = new PCDLoader() 
  }

  render() {
    //console.log('this.props.match.params', this.props.match.params)
    return (
      
      <div className={styles.page}>
          <SinglePointCloud id = {this.props.match.params.id}/>
      </div>
    )
  }
}