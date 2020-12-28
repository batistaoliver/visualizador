import React, {ChangeEvent, PureComponent} from 'react'
import {Button, ButtonProps, OverlayTrigger, Popover} from 'react-bootstrap'
import Form from 'react-bootstrap/esm/Form'
import {Object3D} from 'three'
import styles from './action-tools.scss'

type Props = {
  mesh: Object3D
  onClose: () => void
  showContent: boolean
} & Partial<ButtonProps>
type State = { scale: number[]; individualAxis: boolean }

export default class ScaleButton extends PureComponent<Props, State> {
  state = { scale: [1, 1, 1], individualAxis: false }

  onScaleChange = (event: ChangeEvent<any>) => {
    const scale = Number(event.target?.value)
    if (scale === 1 || scale === 0) return

    if (!this.state.individualAxis) {
      this.props.mesh.scale.set(scale, scale, scale)
      this.setState({ scale: [scale, scale, scale] })
      return
    }

    switch (event.target.id) {
      case 'ScaleRangeXOrAll':
        this.props.mesh.scale.setX(scale)
        this.setState(state => ({ scale: [scale, state.scale[1], state.scale[2]] }))
        break
      case 'ScaleRangeY':
        this.props.mesh.scale.setY(scale)
        this.setState(state => ({ scale: [state.scale[0], scale, state.scale[2]] }))
        break
      case 'ScaleRangeZ':
        this.props.mesh.scale.setZ(scale)
        this.setState(state => ({ scale: [state.scale[0], state.scale[1], scale] }))
        break
    }
  }

  resetScale = () => {
    this.setState({scale: [1, 1, 1]})
    this.props.mesh.scale.set(1, 1, 1)
  }

  toggleIndividualAxis = () => this.setState(state => ({individualAxis: !state.individualAxis}))

  renderPopover = () => {
    const {individualAxis, scale} = this.state
    const rangeInputDefaults = {
      max: '10',
      min: '1',
      step: '0.2',
      type: 'range',
    }

    return (
      <Popover id="scaleButtonPopover">
        <Popover.Title as="h3">Scale</Popover.Title>
        <Popover.Content>
          <Form.Group>
            <Form.Row>
              {individualAxis && <span className={styles.axisLabel}>X</span>}
              <Form.Control
                className={styles.formControl}
                id="ScaleRangeXOrAll"
                onChange={this.onScaleChange}
                value={scale[0]}
                {...rangeInputDefaults}
              />
            </Form.Row>
            {individualAxis && (
              <>
                <Form.Row>
                  <span className={styles.axisLabel}>Y</span>
                  <Form.Control
                    className={styles.formControl}
                    id="ScaleRangeY"
                    onChange={this.onScaleChange}
                    value={scale[1]}
                    {...rangeInputDefaults}
                  />
                </Form.Row>
                <Form.Row>
                  <span className={styles.axisLabel}>Z</span>
                  <Form.Control
                    className={styles.formControl}
                    id="ScaleRangeZ"
                    onChange={this.onScaleChange}
                    value={scale[2]}
                    {...rangeInputDefaults}
                  />
                </Form.Row>
              </>
            )}
            <Form.Check
              label={<small>Individual axis</small>}
              checked={individualAxis}
              onChange={this.toggleIndividualAxis}
            />
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
            onClick={this.resetScale}
            size="sm"
            variant="secondary"
          />
        </Popover.Content>
      </Popover>
    )
  }

  render() {
    const {mesh, showContent, ...buttonProps} = this.props

    return (
      <OverlayTrigger placement="right" show={showContent} overlay={this.renderPopover()}>
        <Button
          children="Scale"
          size="sm"
          variant="secondary"
          {...buttonProps}
        />
      </OverlayTrigger>
    )
  }
}
