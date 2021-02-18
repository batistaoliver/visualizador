import React, { PureComponent } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Preview from 'pages/preview/index'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import { apiURL } from 'utils'

type State = { clouds: Array<any>; deleteID: string | null }

export default class BasicTable extends PureComponent <{}, State> {
  state: State = { clouds: [], deleteID: null }

  componentDidMount() {
    axios({
      url: apiURL('/api/point-clouds'),
    })
      .then((response) => {
        this.setState({ clouds: response.data })
      })
      .catch((response) => {
        console.log(response)
      })
  }

  submit = () => {
    const { deleteID } = this.state
    axios({
      method: 'DELETE',
      url: apiURL(`/api/point-clouds/${deleteID}`),
    })
      .then(response => {
        console.log(response)
        this.setState(state => ({
          clouds: state.clouds.filter(cloud => cloud.id !== deleteID),
        }), () => {
          this.hideDeleteModal()
          alert('Nuvem deletada com sucesso')
        })
      })
      .catch(response => {
        console.log(response)
        alert('Erro ao deletar nuvem')
      })
  }

  showDeleteModal = (deleteID: string) => this.setState({ deleteID })
  hideDeleteModal = () => this.setState({ deleteID: null })

  renderTableHeader = () => (
    <tr id='table-header'>
      <th>ID</th>
      <th>Name</th>
      <th>Preview</th>
      <th className="color-header">Action</th>
    </tr>
  )

  renderTableData = () => {
    return this.state.clouds.map(cloud => {
      const { id, name, url } = cloud

      return (
        <tr key={id}>
          <th className="align-middle">{id}</th>
          <th className="align-middle">{name}</th>
          <th><Preview url={apiURL(url)}/></th>
          <th className="align-middle">
            <ButtonGroup claaria-label="Basic example">
              <Button href={`/clouds/view/${id}`} variant="success">Visualizar</Button>
              <Button href={`/clouds/edit/${id}`} variant="primary">Editar</Button>
              <Button variant="danger" onClick={() => this.showDeleteModal(id)}>Deletar</Button>
            </ButtonGroup>
          </th>
        </tr>
      )
    })
  }

  renderDeleteModal = () => (
    <Modal show={this.state.deleteID !== null}>
      <Modal.Header>
        <Modal.Title>Deletar Nuvem</Modal.Title>
      </Modal.Header>
      <Modal.Body>Confirma a exclusão?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={this.hideDeleteModal}>
          Não
        </Button>
        <Button variant="primary" onClick={this.submit}>
          Sim
        </Button>
      </Modal.Footer>
    </Modal>
  )

  render() {
    return (
      <div>
        <h1 id='title' className="h3">Point Cloud List</h1>
        <Table striped bordered hover id='table-clouds'>
          <tbody>
          {this.renderTableHeader()}
          {this.renderTableData()}
          </tbody>
        </Table>
        <Button variant="primary" href="/clouds/insert">Incluir Nova Nuvem</Button>
        {this.renderDeleteModal()}
      </div>
    )
  }
}

