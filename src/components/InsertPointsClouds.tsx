import React, { PureComponent } from 'react' 
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios'

export default class FormInsert extends React.Component <{}, { name: string, file: any }>{
    state= {name: "",file:""}

      handleChangeName = (event: any) => {    
        this.setState({name: event.target.value});  
      }
      handleChangeFile = (event: any) => {    
        this.setState({file: event.target.files[0]});  
      }
      submit = () => {
        const bodyFormData = new FormData()
        bodyFormData.append('file', this.state.file)
        bodyFormData.append('name', this.state.name)

        axios({
          method: 'post',
          url: 'http://localhost:8880/api/point-clouds',
          data: bodyFormData,
          headers: {'Content-Type': 'multipart/form-data'}
        })
          .then(function (response) {
            window.location.href="/list"
          })
          .catch(function (response) {
           console.log(response)
          })
        }
    
      render() {
        return (
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Insira uma Nuvem</h5> 
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                      <Form.Label>Nome:</Form.Label>
                      <Form.Control type="text" onChange={this.handleChangeName}/> 
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <Form>
                          <Form.File 
                            id="custom-file" label="Insert" onChange={this.handleChangeFile}/>
                        </Form> 
                      </div>  
                    </div>
                  </div>
                  <div className="modal-footer">
                    < Button variant="primary" href="/list">Voltar</Button>
                    <Button className="btn btn-success" type="button" onClick={this.submit}>Inserir</Button>
                  </div>
                </div>
              </div>
        );
      }
}