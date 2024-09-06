/**
 * Makes a post request with the form data in JSON form
 * @async
 * @param {FormValues} formData - Form values as a JS object
 */
export async function postFormData(formData) {
  const endpoint = 'http://localhost:8090/submit'
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: new Headers().append('Content-Type', 'application/json'),
    })

    const json = await res.json()
    console.log(json)
  } catch (e) {
    console.log(e)
  }
}
