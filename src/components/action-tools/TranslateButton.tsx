import React, { ChangeEvent, PureComponent } from 'react'
import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap'
import { isEqual } from 'lodash'
import { ActionBtnProps } from './common'
import styles from './action-tools.scss'

type State = {
  translations: number[]
  useScroller: boolean
}

const rangeInputDefaults = {
  max: '15',
  min: '-15',
  step: '0.02',
}

export default class TranslateButton extends PureComponent<ActionBtnProps, State> {
  state = { translations: [0, 0, 0], useScroller: false }

  componentDidUpdate(_: Readonly<ActionBtnProps>, prevState: Readonly<State>) {
    if (!isEqual(prevState.translations, this.state.translations)) {
      this.props.onUpdate()
    }
  }

  onTranslationChange = (event: ChangeEvent<any>) => {
    if (event.target?.value === undefined) return
    const value = Number(event.target.value)

    switch (event.target.id) {
      case 'translateAngleX':
        this.translate(value)
        this.setState(state => ({ translations: [value, state.translations[1], state.translations[2]] }))
        break
      case 'translateAngleY':
        this.translate(null, value)
        this.setState(state => ({ translations: [state.translations[0], value, state.translations[2]] }))
        break
      case 'translateAngleZ':
        this.translate(null, null, value)
        this.setState(state => ({ translations: [state.translations[0], state.translations[1], value] }))
        break
    }
  }

  resetTranslation = () => {
    this.translate(0, 0, 0)
    this.setState({ translations: [0, 0, 0]})
  }

  translate = (...args: Array<number | null | undefined>) => {
    const { mesh } = this.props
    const [x, y, z] = args
    const { translations } = this.state

    if (typeof x === 'number') {
      mesh.translateX(-translations[0])
      mesh.translateX(x)
    }
    if (typeof y === 'number') {
      mesh.translateY(-translations[1])
      mesh.translateY(y)
    }
    if (typeof z === 'number') {
      mesh.translateZ(-translations[2])
      mesh.translateZ(z)
    }
  }

  toggleUseScroller = () => this.setState(state => ({ useScroller: !state.useScroller }))

  renderPopover = () => {
    const { translations, useScroller } = this.state
    const controlType = useScroller ? 'range' : 'number'

    return (
      <Popover id="scaleButtonPopover">
        <Popover.Title as="h3">Translate</Popover.Title>
        <Popover.Content>
          <Form.Group>
            <Form.Row className={styles.formRow}>
              <span className={styles.axisLabel}>X</span>
              <Form.Control
                className={styles.formControl}
                id="translateAngleX"
                onChange={this.onTranslationChange}
                value={translations[0]}
                type={controlType}
                {...rangeInputDefaults}
              />
              {useScroller && <small>{translations[0]}</small>}
            </Form.Row>
            <Form.Row className={styles.formRow}>
              <span className={styles.axisLabel}>Y</span>
              <Form.Control
                className={styles.formControl}
                id="translateAngleY"
                onChange={this.onTranslationChange}
                value={translations[1]}
                type={controlType}
                {...rangeInputDefaults}
              />
              {useScroller && <small>{translations[1]}</small>}
            </Form.Row>
            <Form.Row className={styles.formRow}>
              <span className={styles.axisLabel}>Z</span>
              <Form.Control
                className={styles.formControl}
                id="translateAngleZ"
                onChange={this.onTranslationChange}
                value={translations[2]}
                type={controlType}
                {...rangeInputDefaults}
              />
              {useScroller && <small>{translations[2]}</small>}
            </Form.Row>
            <Form.Check
              label={<small>Use Scrollers</small>}
              checked={useScroller}
              onChange={this.toggleUseScroller}
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
            onClick={this.resetTranslation}
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
          children="Translate"
          size="sm"
          variant="secondary"
          {...buttonProps}
        />
      </OverlayTrigger>
    )
  }
}
