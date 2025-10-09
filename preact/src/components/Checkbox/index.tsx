import { JSX } from 'preact/jsx-runtime'
import styles from './Checkbox.module.css'
import { useId } from 'preact/hooks'

export const Checkbox = ({
  children,
  style,
  ...props
}: JSX.InputHTMLAttributes<HTMLInputElement>) => {
  const checkboxId = useId()
  return (
    <label className={styles.checkbox} for={checkboxId} style={style}>
      <input type="checkbox" id={checkboxId} {...props} />
      {children}
    </label>
  )
}
