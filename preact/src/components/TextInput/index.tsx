import { JSX } from 'preact/jsx-runtime'
import styles from './TextInput.module.css'
import { useId } from 'preact/hooks'
import { CSSProperties } from 'preact/compat'

interface TextInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  handleBlur?: JSX.FocusEventHandler<HTMLInputElement>
  label: string
  divId?: string
  inputId?: string
  divStyle?: CSSProperties
}

export const TextInput = ({
  handleBlur,
  placeholder,
  label,
  inputId,
  divStyle,
  required,
  ...props
}: TextInputProps) => {
  inputId = inputId ?? useId()

  return (
    <div style={divStyle} className={styles.group}>
      <label htmlFor={inputId}>{label}</label>
      <input
        type="text"
        className={styles['text-input']}
        placeholder={placeholder}
        onBlur={handleBlur}
        required={required}
        id={inputId}
        {...props}
      />
    </div>
  )
}
