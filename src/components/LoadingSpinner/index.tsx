import React from 'react'
import Spinner from 'react-bootstrap/esm/Spinner'
import styles from './index.scss'

type Props = { label?: string; small?: boolean }

const LoadingSpinner = ({ label, small }: Props) => {
  return (
    <div className={`${styles.loading} ${small ? styles.sm : ''}`}>
      <Spinner animation="border" role="status" size={small ? 'sm' : undefined} />
      {label && <span className={small ? 'h5' : 'h3'}>{label}</span>}
    </div>
  )
}

export default LoadingSpinner
