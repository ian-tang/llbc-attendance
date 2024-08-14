'use strict'

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

const VALIDATION_METHODS = {
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

  'liability-waiver': (value) => {
    if (value !== 'true')
      return {
        valid: false,
        message: 'Liability waiver is required',
      }

    return VALID_ENTRY
  },

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
}

// TODO: major refactoring needed
// probably should split into multiple files
document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    const showWaiverButton = document.getElementById('liability-terms-btn')
    const overlay = document.getElementById('modal-overlay')
    const modal = document.getElementById('modal')
    const modalCloseButton = document.getElementById('modal-close-btn')

    const modalCheckbox = document.getElementById('modal-checkbox')
    const mainFormCheckbox = document.getElementById('liability-waiver')

    const signInForm = document.getElementById('sign-in')

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

    document.getElementById('submit-btn').addEventListener('click', (event) => {
      event.preventDefault()

      const formFields = getCurrentFormValues(signInForm)
      let isFormValid = true

      const fieldsets = signInForm.getElementsByTagName('fieldset')
      for (let i = 0; i < fieldsets.length; i++) {
        if (displayErrorMessagesWithin(fieldsets[i], signInForm)) {
          isFormValid && fieldsets[i].scrollIntoView({ behavior: 'smooth' })
          isFormValid = false
        }
      }

      console.log('form is complete:', isFormValid)
      for (const [name, value] of Object.entries(formFields)) {
        console.log(name, value)
      }

      if (isFormValid) signInForm.requestSubmit()
    })

    signInForm.addEventListener('submit', (event) => {
      console.log('submitted')
    })
  }
}

function displayErrorMessagesWithin(el, formRef) {
  const inputs = el.getElementsByTagName('input')
  const errorMessages = el.getElementsByClassName('error-message')

  const validateAllFields = (formData) => {
    let isValidFieldset = true
    for (let i = 0; i < inputs.length; i++) {
      if (
        VALIDATION_METHODS[inputs[i].name] !== undefined &&
        VALIDATION_METHODS[inputs[i].name](formData[inputs[i].name]).valid ===
          false
      )
        isValidFieldset = false
    }
    return isValidFieldset
  }

  const formData = getCurrentFormValues(formRef)
  for (let i = 0; i < inputs.length; i++) {
    const requiresValidation = VALIDATION_METHODS[inputs[i].name] !== undefined
    const validationResult =
      requiresValidation &&
      VALIDATION_METHODS[inputs[i].name](formData[inputs[i].name])
    if (
      !validationResult.valid === true &&
      inputs[i].nextElementSibling &&
      inputs[i].nextElementSibling.classList.contains('error-message')
    ) {
      inputs[i].nextElementSibling.classList.remove('hidden')
      inputs[i].nextElementSibling.innerHTML = validationResult.message
      inputs[i].addEventListener('input', () => {
        const updatedForm = getCurrentFormValues(formRef)
        const isNowValid =
          VALIDATION_METHODS[inputs[i].name](updatedForm[inputs[i].name])
            .valid === true

        if (isNowValid) inputs[i].nextElementSibling.classList.add('hidden')
      })
    }

    if (!validateAllFields(formData)) {
      el.classList.add('invalid-field-warning')
      if (
        errorMessages.length === 1 &&
        errorMessages[0].previousElementSibling &&
        errorMessages[0].previousElementSibling.tagName !== 'INPUT'
      )
        errorMessages[0].classList.remove('hidden')
    }

    el.addEventListener('input', () => {
      if (validateAllFields(getCurrentFormValues(formRef)))
        el.classList.remove('invalid-field-warning')
      if (
        errorMessages.length === 1 &&
        errorMessages[0].previousElementSibling &&
        errorMessages[0].previousElementSibling.tagName !== 'INPUT'
      )
        errorMessages[0].classList.add('hidden')
    })
  }

  return !validateAllFields(formData)
}

// map FormData onto formFields
function getCurrentFormValues(form) {
  // define expected fields in form
  // necessary because FormData will not include entries
  // for unchecked checkboxes
  const fields = {
    'first-name': undefined,
    'last-name': undefined,
    'phone-number': undefined,
    'visitor-role': [],
    'liability-waiver': undefined,
    'interest-areas': [],
    'photo-release': undefined,
  }

  const data = new FormData(form)

  for (const [name, value] of data) {
    if (Array.isArray(fields[name])) {
      fields[name].push(value)
      continue
    }

    fields[name] = value
  }

  return fields
}
