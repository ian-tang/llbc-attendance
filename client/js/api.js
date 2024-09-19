/**
 * Makes a post request with the form data in JSON form
 * @async
 * @param {FormValues} formData - Form values as a JS object
 */
export async function postFormData(formData) {
  const endpoint = 'http://localhost:8090/submit'
  try {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: headers,
    })

    const json = await res.json()
    console.log(json)
  } catch (e) {
    console.log(e)
  }
}
