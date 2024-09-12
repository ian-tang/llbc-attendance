import { postFormData } from './api.js'

/**
 * Object returned by a validation method
 * @typedef {object} ValidationResponse
 * @property {boolean} valid
 * @property {string} message
 */

/** @type {ValidationResponse} */
const VALID_ENTRY = {
  valid: true,
  message: '',
}

const VISITOR_ROLES = new Set([
  'volunteer',
  'get-assistance',
  'purchase-parts-bikes',
  'donate-parts-bikes',
])

/**
 * An object containing properties which map to validation methods
 * for each input field on the form
 */
const VALIDATION_METHODS = {
  /**
   * @param {string} value First name
   */
  'first-name': (value) => {
    if (!value.length)
      return {
        valid: false,
        message: 'This field is required',
      }
    if (value.search(/[0-9]/) > -1)
      return {
        valid: false,
        message: 'Name cannot contain numbers',
      }

    return VALID_ENTRY
  },

  /**
   * @param {string} value Last name
   */
  'last-name': (value) => {
    if (!value.length)
      return {
        valid: false,
        message: 'This field is required',
      }
    if (value.search(/[0-9]/) > -1)
      return {
        valid: false,
        message: 'Name cannot contain numbers',
      }

    return VALID_ENTRY
  },

  /**
   * @param {string} value A string value representing a phone number
   */
  'phone-number': (value) => {
    if (value.length === 0)
      return {
        valid: false,
        message: 'This field is required',
      }
    if (value.search(/[\D]/) > -1)
      return {
        valid: false,
        message: 'Phone number can only contain numbers',
      }

    return VALID_ENTRY
  },

  /**
   * @param {boolean} value If the liability waiver checkbox is checked
   */
  'liability-waiver': (value) => {
    if (value !== true)
      return {
        valid: false,
        message: 'Liability waiver is required',
      }

    return VALID_ENTRY
  },

  /**
   * @param {Array.<string>} roles An array of visitor roles that are checked
   */
  'visitor-role': (roles) => {
    if (roles.length === 0)
      return {
        valid: false,
        message: 'Select at least 1 role',
      }

    for (const role of roles) {
      if (!VISITOR_ROLES.has(role)) {
        return {
          valid: false,
          message: 'Contains invalid visitor role',
        }
      }
    }

    return VALID_ENTRY
  },

  /**
   * @param {boolean} value If the photo release checkbox is checked
   */
  'photo-release': (value) => {
    if (typeof value !== 'boolean')
      return {
        valid: false,
        message: 'Value must be either true or false',
      }

    return VALID_ENTRY
  },
}

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

    const requiredElements = [
      showWaiverButton,
      overlay,
      modal,
      modalCloseButton,
      modalCheckbox,
      mainFormCheckbox,
      signInForm,
      formSubmitButton,
    ]

    if (!requiredElements.some((el) => el === null))
      attachPageEventListeners(
        showWaiverButton,
        overlay,
        modal,
        modalCloseButton,
        modalCheckbox,
        mainFormCheckbox,
        signInForm,
        formSubmitButton,
      )
  }

  /**
   * @param {HTMLButtonElement} showWaiverButton
   * @param {HTMLDivElement} overlay
   * @param {HTMLElement} modal
   * @param {HTMLButtonElement} modalCloseButton
   * @param {HTMLInputElement} modalCheckbox
   * @param {HTMLInputElement} mainFormCheckbox
   * @param {HTMLFormElement} signInForm
   * @param {HTMLButtonElement} formSubmitButton
   */
  function attachPageEventListeners(
    showWaiverButton,
    overlay,
    modal,
    modalCloseButton,
    modalCheckbox,
    mainFormCheckbox,
    signInForm,
    formSubmitButton,
  ) {
    const hideModal = () => {
      overlay.className = 'hidden'
      modal.className = 'hidden'

      if (modalCheckbox.checked !== mainFormCheckbox.checked)
        mainFormCheckbox.click()
    }

    const showModal = () => {
      overlay.className = ''
      modal.className = ''

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
  const formData = getCurrentFormValues(event.target)
  console.log(formData)
  await postFormData(formData)
  console.log('submitted')
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
 * @param {HTMLElement} el - Element to be checked for errors
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
    if (
      !validationResult.valid &&
      inputs[i].nextElementSibling &&
      inputs[i].nextElementSibling.classList.contains('error-message')
    ) {
      inputs[i].nextElementSibling.classList.remove('hidden')
      inputs[i].nextElementSibling.innerHTML = validationResult.message
      inputs[i].addEventListener('input', () => {
        const updatedForm = getCurrentFormValues(formRef)
        const isNowValid = VALIDATION_METHODS[inputs[i].name](
          updatedForm[inputs[i].name],
        ).valid

        if (isNowValid) inputs[i].nextElementSibling.classList.add('hidden')
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
 * A JS object with properties mapping to form values
 * @typedef {object} FormValues
 * @property {string} first-name
 * @property {string} last-name
 * @property {string} phone-number
 * @property {Array.<string>} visitor-role
 * @property {boolean} liability-waiver
 * @property {boolean} photo-release
 */

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
