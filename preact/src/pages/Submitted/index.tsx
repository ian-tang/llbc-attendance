import { useEffect, useState } from 'preact/hooks'
import { Card } from '../../components/Card'
import { Link } from '../../components/Link'

export const Submitted = () => {
  const [count, setCount] = useState(30)
  const start = Date.now()

  useEffect(() => {
    setInterval(() => {
      setCount(count - Math.round((Date.now() - start) / 1000))
    }, 1000)
  }, [])

  if (count <= 0) window.location.href = '/'

  return (
    <div className="page">
      <Card style={{ maxWidth: '30rem' }}>
        <section>
          <h2>Thanks for signing in!</h2>
          <hr />
        </section>
        <section className="options">
          <Link href="/">Start a new sign-in</Link>
          <Link href="http://leftylooseybikecollective.org">
            Return to Lefty Loosey main site
          </Link>
        </section>
        <p>This page will return to the start page in {count} seconds.</p>
      </Card>
    </div>
  )
}
