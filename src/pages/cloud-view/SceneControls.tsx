import React, { PureComponent } from 'react'
import Form from 'react-bootstrap/esm/Form'
import { ButtonGroup } from 'react-bootstrap'
import ScaleButton from 'components/action-tools/ScaleButton'
import RotateButton from 'components/action-tools/RotateButton'
import TranslateButton from 'components/action-tools/TranslateButton'
import { Points } from 'three'
import styles from 'pages/cloud-view/index.scss'

type State = {
  activePopover?: 'rotate' | 'scale' | 'translate'
  showAxes: boolean
  showOriginalCopy: boolean
  mouseInteraction: boolean
}

type Props = {
  mesh: Points
  onUpdate: () => void
  onChange: (controls: Omit<State, 'activePopover'>) => void
}

export default class SceneControls extends PureComponent<Props, State> {
  state: State = {
    mouseInteraction: false,
    showAxes: true,
    showOriginalCopy: false,
  }

  hidePopover = () => this.setState({ activePopover: undefined })
  toggleShowAxes = () => this.setState(
    state => ({ showAxes: !state.showAxes }),
    () => this.props.onChange(this.state)
  )
  toggleMouseInteraction = () => this.setState(
    state => ({ mouseInteraction: !state.mouseInteraction }),
    () => this.props.onChange(this.state)
  )
  toggleShowOriginalCopy = () => this.setState(
    state => ({ showOriginalCopy: !state.showOriginalCopy }),
    () => this.props.onChange(this.state)
  )

  render() {
    const {
      mesh,
      onUpdate,
    } = this.props
    const {
      activePopover,
      mouseInteraction,
      showAxes,
      showOriginalCopy,
    } = this.state

    return (
      <>
        <Form.Row className={styles.checkboxes}>
          <Form.Check
            checked={showAxes}
            label={<small>Show axes</small>}
            onChange={this.toggleShowAxes}
          />
          <Form.Check
            checked={mouseInteraction}
            label={<small>Enable Mouse Camera Control</small>}
            onChange={this.toggleMouseInteraction}
          />
          <Form.Check
            checked={showOriginalCopy}
            label={<small>Show Original Copy</small>}
            onChange={this.toggleShowOriginalCopy}
          />
        </Form.Row>
        <ButtonGroup className={styles.buttonGroup}>
          <ScaleButton
            className={styles.button}
            mesh={mesh}
            onClick={() => this.setState({ activePopover: 'scale' })}
            onClose={this.hidePopover}
            onUpdate={onUpdate}
            showContent={activePopover === 'scale'}
          />
          <RotateButton
            className={styles.button}
            mesh={mesh}
            onClick={() => this.setState({ activePopover: 'rotate' })}
            onClose={this.hidePopover}
            onUpdate={onUpdate}
            showContent={activePopover === 'rotate'}
          />
          <TranslateButton
            className={styles.button}
            mesh={mesh}
            onClick={() => this.setState({ activePopover: 'translate' })}
            onClose={this.hidePopover}
            onUpdate={onUpdate}
            showContent={activePopover === 'translate'}
          />
        </ButtonGroup>
      </>
    )
  }
}
