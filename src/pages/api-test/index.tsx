import React, {ChangeEvent} from 'react'
import { Form } from 'react-bootstrap'
import axios from 'axios'

type State = {
  file: any
  name: string
}

export default class ApiTest extends React.PureComponent<{}, State> {
  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      file: e.target.files[0],
    })
  }

  submit = () => {
    const bodyFormData = new FormData()
    bodyFormData.append('file', this.state.file)
    bodyFormData.append('name', 'adas dasdasd')

    axios({
      method: 'post',
      url: 'http://localhost:8880/api/point-clouds',
      data: bodyFormData,
      headers: {'Content-Type': 'multipart/form-data'}
    })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (response) {
        console.log(response)
      })
  }

  render() {
    return (
      <div>
        {/*<Form.Text onChange={(e) => this.setState({name: e.target.value})} />*/}
        <Form.File onChange={this.onChange}/>
        <button onClick={this.submit}>Submit</button>
      </div>
    )
  }
}