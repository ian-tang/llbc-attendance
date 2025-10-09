import { JSX } from 'preact/jsx-runtime'
import styles from './Fieldset.module.css'

interface FieldsetProps
  extends JSX.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  heading?: string
  legend?: string
}

export const Fieldset = ({
  children,
  legend,
  heading,
  ...props
}: FieldsetProps) => {
  return (
    <section className={styles.group}>
      {heading ? <h3>{heading}</h3> : null}
      <fieldset className={styles.fieldset} {...props}>
        {legend ? <legend className={styles.legend}>{legend}</legend> : null}
        {children}
      </fieldset>
    </section>
  )
}
