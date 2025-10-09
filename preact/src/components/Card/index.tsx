import { JSX } from 'preact/jsx-runtime'
import styles from './Card.module.css'

export const Card = ({
  children,
  ...props
}: JSX.BaseHTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={styles.card} {...props}>
      {children}
    </div>
  )
}
