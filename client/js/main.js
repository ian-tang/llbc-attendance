import { postFormData } from './api.js'
import VALIDATION_METHODS from './validation.js'

/**
 * @typedef {object} RequiredElements
 * @property {HTMLButtonElement} showWaiverButton
 * @property {HTMLDivElement} overlay
 * @property {HTMLElement} modal
 * @property {HTMLButtonElement} modalCloseButton
 * @property {HTMLInputElement} modalCheckbox
 * @property {HTMLInputElement} mainFormCheckbox
 * @property {HTMLFormElement} signInForm
 * @property {HTMLButtonElement} formSubmitButton
 */

document.onreadystatechange = () => {
  if (
    document.readyState === 'interactive' ||
    document.readyState === 'complete'
  ) {
    // check for necessary DOM elements
    const showWaiverButton = document.getElementById('liability-terms-btn')
    const overlay = document.getElementById('modal-overlay')
    const modal = document.getElementById('modal')
    const modalCloseButton = document.getElementById('modal-close-btn')

    const modalCheckbox = document.getElementById('modal-checkbox')
    const mainFormCheckbox = document.getElementById('liability-waiver')

    const signInForm = document.getElementById('sign-in')
    const formSubmitButton = document.getElementById('submit-btn')

    /** @type RequiredElements */
    const requiredElements = {
      showWaiverButton,
      overlay,
      modal,
      modalCloseButton,
      modalCheckbox,
      mainFormCheckbox,
      signInForm,
      formSubmitButton,
    }

    if (!Object.values(requiredElements).some((el) => el === null))
      attachPageEventListeners(requiredElements)
  }

  /**
   * @param {RequiredElements} requiredElements
   */
  function attachPageEventListeners({
    showWaiverButton,
    overlay,
    modal,
    modalCloseButton,
    modalCheckbox,
    mainFormCheckbox,
    signInForm,
    formSubmitButton,
  }) {
    const hideModal = () => {
      overlay.classList.add('hidden')
      modal.classList.add('hidden')

      if (modalCheckbox.checked !== mainFormCheckbox.checked)
        mainFormCheckbox.click()
    }

    const showModal = () => {
      overlay.classList.remove('hidden')
      modal.classList.remove('hidden')

      modal.focus()
      modalCheckbox.checked = mainFormCheckbox.checked
    }

    document.addEventListener('keydown', (event) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape') {
        hideModal()
      }
    })

    modalCloseButton.addEventListener('click', hideModal)

    overlay.addEventListener('click', hideModal)

    showWaiverButton.addEventListener('click', showModal)

    formSubmitButton.addEventListener('click', (event) => {
      event.preventDefault()

      const formFields = getCurrentFormValues(signInForm)
      let isValid = true

      const fieldsets = signInForm.getElementsByTagName('fieldset')
      for (let i = 0; i < fieldsets.length; i++) {
        if (!isValidFieldset(fieldsets[i], getCurrentFormValues(signInForm))) {
          displayErrorMessagesWithin(fieldsets[i], signInForm)
          isValid && fieldsets[i].scrollIntoView({ behavior: 'smooth' })
          isValid = false
        }
      }

      console.log('form is complete:', isValid)
      for (const [name, value] of Object.entries(formFields)) {
        console.log(name, value)
      }

      if (isValid) signInForm.requestSubmit()
    })

    signInForm.addEventListener('submit', submitSignInForm)
  }
}

/**
 * @async
 * @param {SubmitEvent} event
 */
async function submitSignInForm(event) {
  if (event.target !== null) {
    const formData = getCurrentFormValues(
      /** @type HTMLFormElement */ (event.target),
    )
    console.log(formData)
    await postFormData(formData)
    console.log('submitted')
  }
}

/**
 * Performs validation checks on input fields within a fieldset element
 * @param {HTMLFieldSetElement} el - Fieldset element
 * @param {FormValues} formData - current form values
 */
function isValidFieldset(el, formData) {
  const inputs = el.getElementsByTagName('input')
  let isValidFieldset = true

  for (let i = 0; i < inputs.length; i++) {
    const fieldName = inputs[i].name
    if (
      VALIDATION_METHODS[fieldName] &&
      !VALIDATION_METHODS[fieldName](formData[fieldName]).valid
    )
      isValidFieldset = false
  }

  return isValidFieldset
}

/**
 * Displays error messages on descendant input elements
 * @param {HTMLFieldSetElement} el - Element to be checked for errors
 * @param {HTMLFormElement} formRef - Enclosing form element
 */
function displayErrorMessagesWithin(el, formRef) {
  const inputs = el.getElementsByTagName('input')
  const errorMessages = el.getElementsByClassName('error-message')

  const formData = getCurrentFormValues(formRef)
  for (let i = 0; i < inputs.length; i++) {
    const requiresValidation = VALIDATION_METHODS[inputs[i].name] !== undefined
    const validationResult =
      requiresValidation &&
      VALIDATION_METHODS[inputs[i].name](formData[inputs[i].name])
    const errorMessageRef = inputs[i].nextElementSibling
    if (
      !validationResult.valid &&
      errorMessageRef !== null &&
      errorMessageRef.classList.contains('error-message')
    ) {
      errorMessageRef.classList.remove('hidden')
      errorMessageRef.innerHTML = validationResult.message
      inputs[i].addEventListener('input', () => {
        const updatedForm = getCurrentFormValues(formRef)
        const isNowValid = VALIDATION_METHODS[inputs[i].name](
          updatedForm[inputs[i].name],
        ).valid

        if (isNowValid) errorMessageRef.classList.add('hidden')
      })
    }

    if (!isValidFieldset(el, formData)) {
      el.classList.add('invalid-field-warning')
      if (
        errorMessages.length === 1 &&
        errorMessages[0].previousElementSibling &&
        errorMessages[0].previousElementSibling.tagName !== 'INPUT'
      )
        errorMessages[0].classList.remove('hidden')
    }

    el.addEventListener('input', () => {
      if (isValidFieldset(el, getCurrentFormValues(formRef)))
        el.classList.remove('invalid-field-warning')
      if (
        errorMessages.length === 1 &&
        errorMessages[0].previousElementSibling &&
        errorMessages[0].previousElementSibling.tagName !== 'INPUT'
      )
        errorMessages[0].classList.add('hidden')
    })
  }
}

/**
 * Returns form values in a JS object
 * @param {HTMLFormElement} form - HTMLFormElement
 * @returns {FormValues} JS object containing form values
 */
function getCurrentFormValues(form) {
  /** @type {FormValues} */
  const fields = {
    'first-name': '',
    'last-name': '',
    'phone-number': '',
    'visitor-role': [],
    'liability-waiver': false,
    'photo-release': false,
  }

  const data = new FormData(form)

  for (const [name, value] of data) {
    if (Array.isArray(fields[name])) {
      fields[name].push(value)
      continue
    }

    fields[name] = value === 'true' || value
  }

  return fields
}
