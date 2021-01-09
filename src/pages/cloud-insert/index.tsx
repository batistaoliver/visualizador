import React from 'react'
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"
import BasicScene from "components/BasicScene"
import Form from 'react-bootstrap/Form'
import { Object3D } from 'three'
import ScaleButton from 'components/action-tools/ScaleButton'
import RotateButton from 'components/action-tools/RotateButton'
import { ButtonGroup } from 'react-bootstrap'
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