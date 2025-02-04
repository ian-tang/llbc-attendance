/**
 * Makes a post request with the form data in JSON form
 * @async
 * @param {FormValues} formData - Form values as a JS object
 * @returns {Promise<Response>} res
 */
export async function postNewVisitor(formData) {
  const endpoint = 'http://localhost:8090/new-visitor'
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

/**
 * Makes a post request with the form data in JSON form
 * @async
 * @param {FormValues} formData - Form values as a JS object
 * @returns {Promise<Response>} res
 */
export async function postResponse(formData) {
  const endpoint = 'http://localhost:8090/response'
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
