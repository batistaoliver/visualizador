import React, { PureComponent } from 'react' 
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios'

type Props = {
    id:number
  }

export default class FormInsert extends React.Component <Props,{}, { name: string, file: any }>{
    state= {name: "",file:""}

    //   handleChangeName = (event: any) => {    
    //     this.setState({name: event.target.value});  
    //   }
     
      componentDidMount(){
        var form = new FormData();
        form.append("name", "My Wonderful Cloud");
        form.append("file", this.state.name);

        axios({ 
           method: 'PATCH',
           url: 'http://localhost:8880/api/point-clouds/' + this.props.id,
           timeout: 0,
           data: form
         })
           .then((response)=>{
             this.setState(response)
             console.log(response.data.name)
             this.setState({name: response.data.name})
             console.log(this.state.name)
           })
           .catch((response) =>{
            console.log(response)
           })
         }
    
         handleChangeFile = (event: any) => {   
        
            this.setState({file: event.target.files[0]});  
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
                      <Form.Control type="text"/> 
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
                    {/* <Button className="btn btn-success" type="button" onClick={this.submit}>Salvar</Button> */}
                  </div>
                </div>
              </div>
        );
      }
}