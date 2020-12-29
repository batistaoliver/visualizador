import React, { ChangeEvent } from 'react';
import ListPointsCloud from "../../components/ListPointsClouds";
import { Object3D } from 'three';
import styles from './index.scss';

type State = { mesh?: Object3D }

export default class Main extends React.PureComponent<{}, State> {
  
  render() {
    return (
      <div className={styles.page}>
          <ListPointsCloud/>
      </div>
    )
  }
}