import styles from './ActiveEvent.module.css'
import { getActiveEvent, ActiveEventResponse } from '../../api'
import { useEffect, useState } from 'preact/hooks'

export const ActiveEvent = () => {
  const [event, setEvent] = useState<ActiveEventResponse['active_event']>()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function getEvent() {
      const ev = await getActiveEvent()
      ev.exists ? setEvent(ev.active_event) : setEvent(undefined)
      setLoaded(true)
    }

    getEvent()
  }, [])

  const message = event
    ? `You are signing in for ${event.title}!`
    : 'There is currently no active event at the shop, but you can express your interest in getting involved by filling out the form!'

  return <div className={styles.event}>{loaded ? message : 'Loading…'}</div>
}
