import React, { PureComponent } from 'react' 
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
  const BasicTable = () => {
    return (
      <Table striped bordered hover>
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>View</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Mark</td>
      <td></td>
      <td>
        <ButtonGroup aria-label="Basic example">
          <Button variant="success">Visualizar</Button>
          <Button variant="primary">Editar</Button>
          <Button variant="danger">Deletar</Button>
        </ButtonGroup>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>Jacob</td>
      <td></td>
      <td>
        <ButtonGroup aria-label="Basic example">
          <Button variant="success">Visualizar</Button>
          <Button variant="primary">Editar</Button>
          <Button variant="danger">Deletar</Button>
        </ButtonGroup>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>Larry the Bird</td>
      <td></td>
      <td>
        <ButtonGroup aria-label="Basic example">
          <Button variant="success">Visualizar</Button>
          <Button variant="primary">Editar</Button>
          <Button variant="danger">Deletar</Button>
        </ButtonGroup>
      </td>
    </tr>
  </tbody>
</Table>
    );
  }
  
  export default BasicTable;