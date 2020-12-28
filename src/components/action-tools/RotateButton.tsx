import React, {ChangeEvent, PureComponent} from 'react'
import { Button, ButtonProps, OverlayTrigger, Popover } from 'react-bootstrap'
import Form from 'react-bootstrap/esm/Form'
import {Object3D, Vector3} from 'three'
import styles from './action-tools.scss'

type Props = {
  mesh: Object3D
  onClose: () => void
  showContent: boolean
} & Partial<ButtonProps>
type State = { angles: number[] }

export default class RotateButton extends PureComponent<Props, State> {
  state = { angles: [0, 0, 0] }

  onRotationChange = (event: ChangeEvent<any>) => {
    if (event.target?.value === undefined) return
    const angle = Number(event.target.value)
    const { rotation } = this.props.mesh

    switch (event.target.id) {
      case 'rotateAngleX':
        rotation.set((angle * Math.PI) / 180, rotation.y, rotation.z)
        this.setState(state => ({ angles: [angle, state.angles[1], state.angles[2]] }))
        break
      case 'rotateAngleY':
        rotation.set(rotation.x, (angle * Math.PI) / 180, rotation.z)
        this.setState(state => ({ angles: [state.angles[0], angle, state.angles[2]] }))
        break
      case 'rotateAngleZ':
        rotation.set(rotation.x, rotation.y, (angle * Math.PI) / 180)
        this.setState(state => ({ angles: [state.angles[0], state.angles[1], angle] }))
        break
    }
  }

  resetRotation = () => {
    this.setState({ angles: [0, 0, 0]})
    this.props.mesh.rotation.set(0, 0, 0)
  }

  renderPopover = () => {
    const { angles } = this.state

    return (
      <Popover id="scaleButtonPopover">
        <Popover.Title as="h3">Rotate</Popover.Title>
        <Popover.Content>
          <Form.Group>
            <Form.Row>
              <span className={styles.axisLabel}>X</span>
              <Form.Control
                className={styles.formControl}
                id="rotateAngleX"
                onChange={this.onRotationChange}
                value={angles[0]}
                type="number"
              />
            </Form.Row>
            <Form.Row>
              <span className={styles.axisLabel}>Y</span>
              <Form.Control
                className={styles.formControl}
                id="rotateAngleY"
                onChange={this.onRotationChange}
                value={angles[1]}
                type="number"
              />
            </Form.Row>
            <Form.Row>
              <span className={styles.axisLabel}>Z</span>
              <Form.Control
                className={styles.formControl}
                id="rotateAngleZ"
                onChange={this.onRotationChange}
                value={angles[2]}
                type="number"
              />
            </Form.Row>
          </Form.Group>
          <Button
            children="Close"
            className={styles.button}
            onClick={this.props.onClose}
            size="sm"
            variant="secondary"
          />
          <Button
            children="Reset"
            className={styles.button}
            onClick={this.resetRotation}
            size="sm"
            variant="secondary"
          />
        </Popover.Content>
      </Popover>
    )
  }

  render() {
    const { mesh, showContent, ...buttonProps } = this.props

    return (
      <OverlayTrigger placement="right" show={showContent} overlay={this.renderPopover()}>
        <Button
          children="Rotate"
          size="sm"
          variant="secondary"
          {...buttonProps}
        />
      </OverlayTrigger>
    )
  }
}
