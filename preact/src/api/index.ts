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
