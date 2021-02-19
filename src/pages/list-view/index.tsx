import React from 'react'
import styles from './index.scss'
import axios from 'axios'
import { apiURL } from 'utils'
import Preview from 'components/Preview'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'

type State = {
  clouds: Cloud[]
  deleteID: Nullable<string>
}

export default class Main extends React.PureComponent {
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

  confirmDelete = () => {
    const { deleteID } = this.state
    axios({
      method: 'DELETE',
      url: apiURL(`/api/point-clouds/${deleteID}`),
    })
      .then(response => {
        console.log(response)
        this.setState((state: State) => ({
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

  render() {
    return (
      <div className={styles.page}>
        <h1 id='title' className="h3">
          Point Cloud List
          <Button className={styles.includeBtn} variant="primary" href="/clouds/insert" size="sm">
            Incluir Nova Nuvem
          </Button>
        </h1>
        <Table striped bordered hover id='table-clouds'>
          <thead>
            {this.renderTableHeader()}
          </thead>
          <tbody>
            {this.renderTableData()}
          </tbody>
        </Table>
        {this.renderDeleteModal()}
      </div>
    )
  }

  renderTableHeader = () => (
    <tr id='table-header'>
      <th>ID</th>
      <th>Name</th>
      <th className={styles.previewCol}>Preview</th>
      <th className={styles.actionCol}>Action</th>
    </tr>
  )

  renderTableData = () => {
    return this.state.clouds.map(cloud => {
      const { id, name, url } = cloud

      return (
        <tr key={id}>
          <td className="align-middle">{id}</td>
          <td className="align-middle">{name}</td>
          <td>
            <Preview url={apiURL(url)}/>
          </td>
          <td className="align-middle">
            <ButtonGroup claaria-label="Basic example">
              <Button className={styles.actionBtn} href={`/clouds/view/${id}`} variant="success" size="sm">
                Visualizar
              </Button>
              <Button className={styles.actionBtn} href={`/clouds/edit/${id}`} variant="primary" size="sm">
                Editar
              </Button>
              <Button className={styles.actionBtn} variant="danger" onClick={() => this.showDeleteModal(id)} size="sm">
                Deletar
              </Button>
            </ButtonGroup>
          </td>
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
        <Button variant="primary" onClick={this.confirmDelete}>
          Sim
        </Button>
      </Modal.Footer>
    </Modal>
  )
}