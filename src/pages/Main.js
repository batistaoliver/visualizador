import React from 'react'
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader";
import BasicScene from "../componentes/BasicScene";
import Form from 'react-bootstrap/Form';
import './Main.css';

export default class Main extends React.PureComponent {
  state = { mesh: null }

  constructor(props) {
    super(props);
    this.loader = new PCDLoader();
  }

  onFileSelect = event => {
    if (!event.target.files) return

    const inputUrl = URL.createObjectURL(event.target.files[0]);
    this.loader.load(inputUrl, this.onLoad, this.onLoadProgress, this.onLoadError);
  }

  onLoad = mesh => this.setState({ mesh })

  onLoadProgress = xhr => {
    console.log(Number(xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded');
  }

  onLoadError = error => {
    alert('Error ao carregar nuvem de pontos :(')
    console.log('An error occurred: ', error)
  }

  render() {
    return (
      <div className="page">
        <Form>
          <Form.Group>
            <Form.File
              accept=".pcd"
              id="cloudPointInput"
              label="Selecione um arquivo .pcd válido"
              onChange={this.onFileSelect}
            />
          </Form.Group>
        </Form>

        {this.state.mesh && (
          <BasicScene mesh={this.state.mesh} />
        )}
      </div>
    )
  }
}