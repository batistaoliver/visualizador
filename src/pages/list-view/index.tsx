import React from 'react'
import ListPointsCloud from 'components/ListPointsClouds'
import styles from './index.scss'

export default class Main extends React.PureComponent {
  render() {
    return (
      <div className={styles.page}>
        <ListPointsCloud />
      </div>
    )
  }
}