const URL = import.meta.env.VITE_API_ENDPOINT

export async function postNewVisitor(formData) {
  const endpoint = `${URL}/new-visitor`
  let res
  try {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    res = fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: headers,
    })
  } catch (e) {
    console.log(e)
  }

  return res
}

export async function postResponse(formData) {
  const endpoint = `${URL}/response`
  let res
  try {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    res = fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: headers,
    })
  } catch (e) {
    console.log(e)
  }

  return res
}

export async function getActiveEvent(): Promise<ActiveEventResponse> {
  const endpoint = `${URL}/active-event`
  let res
  try {
    res = await fetch(endpoint)
    res = await res.json()
  } catch (e) {
    console.log(e)
  }

  return res
}

export async function postAttendance(
  formData: ActionNetworkAttendanceSubmission,
) {
  const endpoint = `${URL}/attendance`
  let res
  try {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    res = fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: headers,
    })
  } catch (e) {
    console.log(e)
  }

  return res
}

export type ActiveEventResponse = {
  exists: boolean
  active_event: {
    title: string
    start_date: string
    end_date?: string
  }
}

export type ActionNetworkAttendanceSubmission = {
  person: {
    given_name?: string
    family_name?: string
    email_addresses: {
      address: string
      status?: 'subscribed' | 'unsubscribed'
    }[]
  }
  add_tags?: string[]
  remove_tags?: string[]
}
