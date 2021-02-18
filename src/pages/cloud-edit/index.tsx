import EditCloud from "../../components/EditCloud"
import React, { PureComponent } from 'react'
import styles from './index.scss'

export default class Main extends PureComponent<any> {
  render() {
    return (
      <div className={styles.page}>
        <EditCloud id={this.props.match.params.id}/>
      </div>
    )
  }
}