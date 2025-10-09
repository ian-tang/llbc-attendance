import { render } from 'preact'
import { LocationProvider, Router, Route } from 'preact-iso'

import { Header } from './components/Header'
import { Home } from './pages/Home/index'
import { NotFound } from './pages/_404.jsx'
import { FirstVisit } from './pages/FirstVisit'
import { Returning } from './pages/Returning'
import { Submitted } from './pages/Submitted'
import './style.css'

export function App() {
  return (
    <LocationProvider>
      <Header />
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route path="first-visit" component={FirstVisit} />
          <Route path="returning" component={Returning} />
          <Route path="submitted" component={Submitted} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  )
}

render(<App />, document.getElementById('app'))
