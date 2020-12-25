import React, { ChangeEvent } from 'react';
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import BasicScene from "../componentes/BasicScene";
import Form from 'react-bootstrap/Form';
import { Object3D } from 'three';
import styles from './Main.scss';

type State = { mesh?: Object3D }

export default class Main extends React.PureComponent<{}, State> {
  loader: PCDLoader

  constructor(props: {}) {
    super(props);
    this.loader = new PCDLoader();
    this.state = {}
  }

  onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const inputUrl = URL.createObjectURL(event.target.files[0]);
    this.loader.load(inputUrl, this.onLoad, this.onLoadProgress, this.onLoadError);
  }

  onLoad = (mesh: Object3D) => this.setState({ mesh })

  onLoadProgress = (xhr: ProgressEvent) => {
    console.log(Number(xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded');
  }

  onLoadError = (error: ErrorEvent) => {
    alert('Erro ao carregar nuvem de pontos :(')
    console.log('An error occurred: ', error)
  }

  render() {
    return (
      <div className={styles.page}>
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