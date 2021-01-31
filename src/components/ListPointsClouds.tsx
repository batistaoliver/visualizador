import React, { PureComponent, useState } from 'react' 
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Preview from 'pages/preview/index';
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'

const clouds = [
  { id: 1, name: 'Rabbit', url: '/assets/test-pcds/bunny.pcd'},
  { id: 2, name: 'happy24', url: '/assets/test-pcds/happy24.pcd'},
  { id: 3, name: 'owl3_05', url: '/assets/test-pcds/owl3_05.pcd'}
]

type State = {clouds: Array<any>;deleteID: string|null}

export default class BasicTable extends PureComponent <{}, State>{
   state= {clouds:[], deleteID:null}

componentDidMount(){
   axios({ 
      url: 'http://localhost:8880/api/point-clouds'
    })
      .then((response)=>{
        this.setState({clouds: response.data})
      })
      .catch((response) =>{
       console.log(response)
      })
    }
    submit = () => {

      axios({
         method: 'DELETE',
         url: 'http://localhost:8880/api/point-clouds/' + this.state.deleteID

       })
         .then(function (response) {
           window.location.href="/list"
         })
         .catch(function (response) {
          console.log(response)
         })
      }

 renderTableHeader() {
    let header = Object.keys(clouds[0])
    return header.map((key, index) => {
       return <th key={index}>{key.toUpperCase()}</th>
    })
 }

 renderTableData= () => {
    return this.state.clouds.map((clouds) => {
       const { id, name, url } = clouds //destructuring
       const rota = "/" + id 
       const rotaEdit = "/edit/" + id
       return (
          <tr key={id}>
             <th className="align-middle">{id}</th>
             <th className="align-middle">{name}</th>
             <th><Preview url={"http://localhost:8880" + url}/></th>
             <th className="align-middle">
              <ButtonGroup claaria-label="Basic example">
                <Button href= {rota}  variant="success">Visualizar</Button>
                <Button href= {rotaEdit} variant="primary">Editar</Button>
                <Button variant="danger" onClick={() => this.setState({ deleteID: id })}>Deletar</Button>
              </ButtonGroup>
             </th> 
          </tr>
       )
    })
 }

renderDEleteModal= () => {
 
   return (
     <> 
       <Modal show={this.state.deleteID!==null}>
         <Modal.Header closeButton>
           <Modal.Title>Deletar Nuvem</Modal.Title>
         </Modal.Header>
         <Modal.Body>Confirma a exclusão?</Modal.Body>
         <Modal.Footer>
           <Button variant="secondary" onClick={() => this.setState({ deleteID: null })}>
             Não
           </Button>
           <Button variant="primary" onClick={this.submit}>
             Sim
           </Button>
         </Modal.Footer>
       </Modal>
     </>
   );
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
          {this.renderDEleteModal()}
       </div>
    )
 }
}

