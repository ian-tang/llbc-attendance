import {
  validateAndSubmit,
  getCurrentFormValues,
  isValidFieldset,
} from './lib.js'
import { postResponse } from './api.js'

/**
 * @typedef {object} RequiredElements
 * @property {HTMLFormElement} signInForm
 * @property {HTMLButtonElement} formSubmitButton
 */

const REDIRECT = '../submitted'
const FORM_FIELDS = {
  email: '',
  'visitor-role': {},
}

document.addEventListener('DOMContentLoaded', () => {
  // check for necessary DOM elements
  const signInForm = document.getElementById('sign-in')
  const formSubmitButton = document.getElementById('submit-btn')

  /** @type RequiredElements */
  const requiredElements = {
    signInForm,
    formSubmitButton,
  }

  attachPageEventListeners(requiredElements)
})

/**
 * @param {RequiredElements} requiredElements
 */
function attachPageEventListeners({ signInForm, formSubmitButton }) {
  signInForm.addEventListener('submit', (event) => submitResponse(event))

  formSubmitButton.addEventListener('click', (event) =>
    validateAndSubmit(event, signInForm, FORM_FIELDS),
  )
}

/**
 * @async
 * @param {SubmitEvent} event
 * @param {string} redirect - destination URL after the form is submitted
 */
export async function submitResponse(event) {
  if (event.target !== null) {
    const formData = getCurrentFormValues(
      /** @type HTMLFormElement */ (event.target),
      FORM_FIELDS,
    )

    // TODO: this is hot garbage rn
    console.log(formData)
    const res = await postResponse(formData)
    if (res.status === 409) {
      const personalInfoFieldset = document.getElementById('personal-info')
      const emailInput = document.getElementById('email')
      const errorMsgRef = emailInput.nextElementSibling
      if (emailInput && errorMsgRef) {
        errorMsgRef.innerHTML =
          'Could not find an entry with this email. Please check your input or <a style="text-decoration: underline" href="../first-visit/?new-entry=true">sign in as a new visitor</a>.'
        errorMsgRef.classList.remove('hidden')
        personalInfoFieldset.classList.add('invalid-field-warning')
      }
      const formRef = document.getElementById('sign-in')
      emailInput.addEventListener('input', () => {
        if (
          isValidFieldset(
            personalInfoFieldset,
            getCurrentFormValues(formRef, FORM_FIELDS),
          )
        )
          personalInfoFieldset.classList.remove('invalid-field-warning')
        errorMsgRef.classList.add('hidden')
      })
    }
    console.log('submitted')

    if (res.ok && REDIRECT !== undefined) window.location.href = REDIRECT
  }
}
