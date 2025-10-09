import { JSX } from 'preact/jsx-runtime'
import styles from './Link.module.css'

export const Link = ({
  children,
  href,
  ...props
}: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a className={styles.link} href={href} {...props}>
      {children}
    </a>
  )
}
