import { validateAndSubmit, submitSignInForm } from './lib.js'
/**
 * @typedef {object} RequiredElements
 * @property {HTMLFormElement} signInForm
 * @property {HTMLButtonElement} formSubmitButton
 */

const REDIRECT = 'http://localhost:8080/submitted'
const FORM_FIELDS = {
  email: '',
  'visitor-role': {},
}

document.onreadystatechange = () => {
  if (
    document.readyState === 'interactive' ||
    document.readyState === 'complete'
  ) {
    // check for necessary DOM elements
    const signInForm = document.getElementById('sign-in')
    const formSubmitButton = document.getElementById('submit-btn')

    /** @type RequiredElements */
    const requiredElements = {
      signInForm,
      formSubmitButton,
    }

    if (!Object.values(requiredElements).some((el) => el === null))
      attachPageEventListeners(requiredElements)
  }
}

/**
 * @param {RequiredElements} requiredElements
 */
function attachPageEventListeners({ signInForm, formSubmitButton }) {
  signInForm.addEventListener('submit', (event) =>
    submitSignInForm(event, FORM_FIELDS, REDIRECT),
  )

  formSubmitButton.addEventListener('click', (event) =>
    validateAndSubmit(event, signInForm, FORM_FIELDS),
  )
}
