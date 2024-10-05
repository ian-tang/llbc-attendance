/**
 * Makes a post request with the form data in JSON form
 * @async
 * @param {FormValues} formData - Form values as a JS object
 * @returns {Promise<Response>} res
 */
export async function postFormData(formData) {
  const endpoint = 'http://localhost:8090/submit'
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
