import React, { PureComponent } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import { API_URL } from 'utils/constants'

type Props = { id: number }
type State = { name: string }

export default class FormInsert extends PureComponent<Props, State> {
  state = { name: '' }

  handleChangeName = (event: any) => {
    this.setState({ name: event.target.value })
  }

  componentDidMount() {
    axios({
      method: 'get',
      url: `${API_URL}/api/point-clouds/${this.props.id}`
    })
      .then((response) => {
        console.log(response)
        this.setState({ name: response.data.name })
      })
      .catch((response) => {
        console.log(response)
      })
  }

  submit = () => {
    const form = new FormData()
    form.append('name', this.state.name)

    axios({
      method: 'PATCH',
      url: `${API_URL}/api/point-clouds/${this.props.id}`,
      timeout: 0,
      data: form
    })
      .then((response) => {
        console.log(response)
        alert('Dados salvos com sucesso')
      })
      .catch((response) => {
        console.log(response)
        alert('Error ao salvar dados')
      })
  }

  render() {
    return (
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Nuvem</h5>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <Form.Label>Nome:</Form.Label>
                <Form.Control
                  defaultValue={this.state.name}
                  onChange={this.handleChangeName}
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <Button variant="primary" href="/clouds">Voltar</Button>
            <Button className="btn btn-success" type="button" onClick={this.submit}>Salvar</Button>
          </div>
        </div>
      </div>
    )
  }
}