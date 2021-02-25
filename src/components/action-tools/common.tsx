import { Points } from 'three'
import { ButtonProps } from 'react-bootstrap'

export type ActionBtnProps = Partial<ButtonProps> & {
  mesh: Points
  onClose: () => void
  onUpdate: () => void
  showContent: boolean
}