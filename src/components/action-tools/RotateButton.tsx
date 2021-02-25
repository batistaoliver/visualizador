import React, { ChangeEvent, PureComponent } from 'react'
import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap'
import { isEqual } from 'lodash'
import { ActionBtnProps } from './common'
import styles from './action-tools.scss'

type State = { angles: number[] }

export default class RotateButton extends PureComponent<ActionBtnProps, State> {
  state = { angles: [0, 0, 0] }

  componentDidUpdate(_: Readonly<ActionBtnProps>, prevState: Readonly<State>) {
    if (!isEqual(prevState, this.state)) {
      this.props.onUpdate()
    }
  }

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
            <Form.Row className={styles.formRow}>
              <span className={styles.axisLabel}>X</span>
              <Form.Control
                className={styles.formControl}
                id="rotateAngleX"
                onChange={this.onRotationChange}
                value={angles[0]}
                type="number"
                min="-360"
                max="360"
              />
            </Form.Row>
            <Form.Row className={styles.formRow}>
              <span className={styles.axisLabel}>Y</span>
              <Form.Control
                className={styles.formControl}
                id="rotateAngleY"
                onChange={this.onRotationChange}
                value={angles[1]}
                type="number"
                min="-360"
                max="360"
              />
            </Form.Row>
            <Form.Row className={styles.formRow}>
              <span className={styles.axisLabel}>Z</span>
              <Form.Control
                className={styles.formControl}
                id="rotateAngleZ"
                onChange={this.onRotationChange}
                value={angles[2]}
                type="number"
                min="-360"
                max="360"
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
    const { mesh, onUpdate, showContent, ...buttonProps } = this.props

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
