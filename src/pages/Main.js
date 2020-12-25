import React from 'react'
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader";
import BasicScene from "../componentes/BasicScene";

export default class Main extends React.PureComponent {
  state = { mesh: null }

  constructor(props) {
    super(props);
    this.loader = new PCDLoader();
  }

  onFileSelect = event => {
    if (event.target.files) {
      const inputUrl = URL.createObjectURL(event.target.files[0]);
      this.loader.load(inputUrl, this.onLoad, this.onLoadProgress, this.onLoadError);
    }
  }

  onLoad = mesh => {
    this.setState({ mesh })
  }

  onLoadProgress = xhr => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  }

  onLoadError = error => {
    console.log('An error happened');
    console.log(error);
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.onFileSelect} accept=".pcd" />

        {this.state.mesh && (
          <BasicScene mesh={this.state.mesh} />
        )}
      </div>
    )
  }
}