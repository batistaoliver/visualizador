import React, { ChangeEvent } from 'react';
import ListPointsCloud from "../../components/ListPointsClouds";
import { Object3D } from 'three';
import styles from './index.scss';

type State = { mesh?: Object3D }

export default class Main extends React.PureComponent<any, State> {
  
  render() {
    //console.log('this.props.match.params', this.props.match.params)

    return (
      <div className={styles.page}>
          <ListPointsCloud/>
      </div>
    )
  }
}