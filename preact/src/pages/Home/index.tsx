import { Link } from '../../components/Link'
import { Card } from '../../components/Card'
import './style.css'
import { ActiveEvent } from '../../components/ActiveEvent'

export function Home() {
  return (
    <div className="home page">
      <h1>Welcome to Lefty Loosey!</h1>
      <Card>
        <section>
          <h2>Sign in below</h2>
          <hr />
        </section>
        <section className="options">
          <Link href="first-visit">It's my first time here</Link>
          <Link href="returning">I've signed in before</Link>
        </section>
        <ActiveEvent />
      </Card>
    </div>
  )
}
