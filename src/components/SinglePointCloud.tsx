import React, { PureComponent } from 'react'
import CloudView from 'pages/cloud-view/index'
import axios from 'axios'
import { apiURL } from 'utils'

type Props = {
  id: number
}

export default class BasicTable extends PureComponent<Props, { url: string }> {
  state = { url: '' }

  componentDidMount() {
    axios({
      method: 'get',
      url: apiURL(`/api/point-clouds/${this.props.id}`),
    })
      .then((response) => {
        console.log(response.data.url)
        this.setState({ url: response.data.url })
      })
      .catch((response) => {
        console.log(response)
      })
  }

  render() {
    if (!this.state.url) {
      return null
    }
    return (
      <div>
        <div>
          <CloudView url={apiURL(this.state.url)}/>
        </div>
      </div>
    )
  }
}