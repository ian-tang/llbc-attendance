import { postNewVisitor, postResponse } from './api.js'
import VALIDATION_METHODS from './validation.js'

/**
 * @async
 * @param {SubmitEvent} event
 * @param {string} redirect - destination URL after the form is submitted
 */
export async function submitSignInForm(event, formFields, redirect) {
  if (event.target !== null) {
    const formData = getCurrentFormValues(
      /** @type HTMLFormElement */ (event.target),
      formFields,
    )

    // TODO: this is hot garbage rn
    console.log(formData)
    const res = await postNewVisitor(formData)
    console.log('submitted')

    if (res.ok && redirect !== undefined) window.location.href = redirect
  }
}

/**
 * @async
 * @param {SubmitEvent} event
 * @param {string} redirect - destination URL after the form is submitted
 */
export async function submitResponse(event, formFields, redirect) {
  if (event.target !== null) {
    const formData = getCurrentFormValues(
      /** @type HTMLFormElement */ (event.target),
      formFields,
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
            getCurrentFormValues(formRef, formFields),
          )
        )
          personalInfoFieldset.classList.remove('invalid-field-warning')
        errorMsgRef.classList.add('hidden')
      })
    }
    console.log('submitted')

    if (res.ok && redirect !== undefined) window.location.href = redirect
  }
}

/**
 * Performs validation checks on input fields within a fieldset element
 * @param {HTMLFieldSetElement} el - Fieldset element
 * @param {FormValues} formData - current form values
 */
export function isValidFieldset(el, formData) {
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
export function displayErrorMessagesWithin(el, formRef, formFields) {
  const inputs = el.getElementsByTagName('input')
  const errorMessages = el.getElementsByClassName('error-message')

  const formData = getCurrentFormValues(formRef, formFields)
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
        const updatedForm = getCurrentFormValues(formRef, formFields)
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
      if (isValidFieldset(el, getCurrentFormValues(formRef, formFields)))
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
 * @param {HTMLFormElement} formRef - HTMLFormElement
 * @returns {FormValues} JS object containing form values
 */
export function getCurrentFormValues(formRef, formFields) {
  const data = new FormData(formRef)

  console.log('formFields:', formFields)

  for (const [name, value] of data) {
    console.log(name, value)
    if (typeof formFields[name] === 'object') {
      formFields[name][value] = true
      continue
    }

    formFields[name] = value === 'true' || value
  }

  return formFields
}

/**
 * Attempts to submit the form if all fields are valid
 * @param {Event} event
 * @param {HTMLFormElement} formRef
 */
export function validateAndSubmit(event, formRef, formFields) {
  event.preventDefault()

  const formValues = getCurrentFormValues(formRef, formFields)
  let isValid = true
  const fieldsets = formRef.getElementsByTagName('fieldset')
  for (let i = 0; i < fieldsets.length; i++) {
    if (!isValidFieldset(fieldsets[i], formValues)) {
      displayErrorMessagesWithin(fieldsets[i], formRef, formFields)
      isValid && fieldsets[i].scrollIntoView({ behavior: 'smooth' })
      isValid = false
    }
  }

  console.log('form is complete:', isValid)
  for (const [name, value] of Object.entries(formValues)) {
    console.log(name, value)
  }

  if (isValid) formRef.requestSubmit()
}
