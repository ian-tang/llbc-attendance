import { useLocation } from 'preact-iso'
import styles from './Header.module.css'

export function Header() {
  const { url } = useLocation()
  const signInPages =
    url === '/' ||
    url === '/first-visit' ||
    url === '/returning' ||
    url === '/submitted'

  return (
    <header className={styles.header}>
      <nav>
        <a href="/" className={signInPages && styles.active}>
          Sign In
        </a>
        <a href="http://www.leftylooseybikecollective.org">leftyloosey.org</a>
      </nav>
    </header>
  )
}
