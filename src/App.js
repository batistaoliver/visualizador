import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Visualizacao from './componentes/Visualizacao';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Visualizacao></Visualizacao>
      </div>
    );
  }
}

export default App;
