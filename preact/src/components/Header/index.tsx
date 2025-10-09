import { useLocation } from 'preact-iso'
import styles from './Header.module.css'

export function Header() {
  const { url } = useLocation()
  const signInPages =
    url === '/' || url === '/first-visit' || url === '/returning'

  return (
    <header className={styles.header}>
      <nav>
        <a href="/" className={signInPages && styles.active}>
          Sign In
        </a>
        <a href="http://www.leftylooseybikecollective.org">
          Lefty Loosey Main Site
        </a>
      </nav>
    </header>
  )
}
