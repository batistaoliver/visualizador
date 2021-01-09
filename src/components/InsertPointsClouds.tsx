import React, { PureComponent } from 'react' 
import Button from 'react-bootstrap/Button'

export default class FormInsert extends React.Component <{}, { value: string }>{
    constructor(props:any) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
      handleChange(event: any) {    
        this.setState({value: event.target.value});  
      }
      handleSubmit(event: any) {
        alert('A nuvem foi inserida: ' + this.state.value);
        event.preventDefault();
      }
    
      render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Insira uma Nuvem</h5> 
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <label> Nome:</label>
                        <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <label> Url:</label>
                        <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange} />
                      </div>  
                    </div>
                  </div>
                  <div className="modal-footer">
                    < Button variant="primary" href="/list">Voltar</Button>
                    <input className="btn btn-success" type="submit" value="Inserir" />
                  </div>
                </div>
              </div>
          </form> 
        );
      }
}