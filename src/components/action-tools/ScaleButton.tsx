import React, { ChangeEvent, PureComponent } from 'react'
import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap'
import { isEqual } from 'lodash'
import { ActionBtnProps } from './common'
import styles from './action-tools.scss'

type State = {
  individualAxis: boolean
  initialScale: number[]
  scale: number[]
}

const rangeInputDefaults = {
  max: '20',
  min: '0.2',
  step: '0.2',
  type: 'range',
}

export default class ScaleButton extends PureComponent<ActionBtnProps, State> {
  constructor(props: ActionBtnProps) {
    super(props)
    this.state = {
      scale: props.mesh.scale.toArray(),
      initialScale: props.mesh.scale.toArray(),
      individualAxis: false
    }
  }

  componentDidUpdate(_: Readonly<ActionBtnProps>, prevState: Readonly<State>) {
    if (!isEqual(prevState.scale, this.state.scale)) {
      this.props.onUpdate()
    }
  }

  onScaleChange = (event: ChangeEvent<any>) => {
    const scale = Number(event.target?.value)
    const { mesh } = this.props

    if (scale === 1 || scale === 0) return

    if (!this.state.individualAxis) {
      mesh.scale.set(scale, scale, scale)
      this.setState({ scale: [scale, scale, scale] })
      return
    }

    switch (event.target.id) {
      case 'ScaleRangeXOrAll':
        mesh.scale.setX(scale)
        this.setState(state => ({ scale: [scale, state.scale[1], state.scale[2]] }))
        break
      case 'ScaleRangeY':
        mesh.scale.setY(scale)
        this.setState(state => ({ scale: [state.scale[0], scale, state.scale[2]] }))
        break
      case 'ScaleRangeZ':
        mesh.scale.setZ(scale)
        this.setState(state => ({ scale: [state.scale[0], state.scale[1], scale] }))
        break
    }
  }

  resetScale = () => {
    const { initialScale } = this.state
    const { mesh } = this.props

    this.setState(
      ({ initialScale }) => ({ scale: initialScale }),
      () => mesh.scale.fromArray(initialScale)
    )
  }

  toggleIndividualAxis = () => this.setState(state => ({individualAxis: !state.individualAxis}))

  renderPopover = () => {
    const { individualAxis, scale } = this.state

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
              <small>{scale[0]}x</small>
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
                  <small>{scale[1]}x</small>
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
                  <small>{scale[2]}x</small>
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
    const {mesh, onUpdate, showContent, ...buttonProps} = this.props

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
