import { JSX } from 'preact/jsx-runtime'
import styles from './Button.module.css'

export const Button = ({
  children,
  onClick,
  ...props
}: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
