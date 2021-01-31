import React from 'react'
import { Object3D } from 'three'
import styles from './index.scss'
import InsertPointsClouds from "../../components/InsertPointsClouds";

type State = { 
    mesh?: Object3D 
  }

export default class CloudList extends React.PureComponent<{}, State> {

    render() {
        return (
            <div className={styles.page}>
                <InsertPointsClouds></InsertPointsClouds>
            </div> 
        )
    }
};