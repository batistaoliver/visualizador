import React, { PureComponent, useState } from 'react' 
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Preview from 'pages/preview/index';
import Modal from 'react-bootstrap/Modal'


const clouds = [
  { id: 1, name: 'Rabbit', url: '/assets/test-pcds/bunny.pcd'},
  { id: 2, name: 'happy24', url: '/assets/test-pcds/happy24.pcd'},
  { id: 3, name: 'owl3_05', url: '/assets/test-pcds/owl3_05.pcd'}
]

export default class BasicTable extends PureComponent {
  constructor(props: any) {
    super(props) 
 }

 renderTableHeader() {
    let header = Object.keys(clouds[0])
    return header.map((key, index) => {
       return <th key={index}>{key.toUpperCase()}</th>
    })
 }

 renderTableData() {
    return clouds.map((clouds) => {
       const { id, name, url } = clouds //destructuring
       const rota = "/" + id 
       return (
          <tr key={id}>
             <th className="align-middle">{id}</th>
             <th className="align-middle">{name}</th>
             <th><Preview url={url}/></th>
             <th className="align-middle">
              <ButtonGroup claaria-label="Basic example">
                <Button href= {rota}  variant="success">Visualizar</Button>
                <Button variant="primary">Editar</Button>
                <Button variant="danger">Deletar</Button>
              </ButtonGroup>
             </th> 
          </tr>
       )
    })
 }

 render() {
    return (
       <div>
          <h1 id='title'>Point Clouds Preview Table</h1>
          
          <Table striped bordered hover id='table-clouds'>
             <tbody>
                <tr id='table-header'>
                  {this.renderTableHeader()}
                  <th className="color-header">ACTION</th>
                </tr>
                {this.renderTableData()} 
             </tbody>
          </Table>
          <Button variant="primary" href="/insert">Incluir Nova Nuvem</Button>
       </div>
    )
 }
}

