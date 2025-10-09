import { JSX } from 'preact/jsx-runtime'
import styles from './ErrorMessage.module.css'

interface ErrorMessageProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
  message?: string
}

export const ErrorMessage = ({ message = '', ...props }: ErrorMessageProps) => {
  return (
    <label className={styles.error} hidden={message === ''} {...props}>
      {message}
    </label>
  )
}
