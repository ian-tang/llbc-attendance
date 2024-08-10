'use strict'

const VALID_ENTRY = {
  valid: true,
  message: '',
}

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
}

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    const showWaiverButton = document.getElementById('liability-terms-btn')
    const overlay = document.getElementById('modal-overlay')
    const modal = document.getElementById('modal')

    const modalCheckbox = document.getElementById('modal-checkbox')
    const mainFormCheckbox = document.getElementById('liability-waiver')

    const signInForm = document.getElementById('sign-in')

    const hideModal = () => {
      overlay.className = 'hidden'
      modal.className = 'hidden'

      mainFormCheckbox.checked = modalCheckbox.checked
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

    overlay.addEventListener('click', hideModal)

    showWaiverButton.addEventListener('click', showModal)

    document.getElementById('submit-btn').addEventListener('click', (event) => {
      event.preventDefault()
      const formFields = {
        'first-name': undefined,
        'last-name': undefined,
        'phone-number': undefined,
        'liability-waiver': undefined,
      }
      const data = new FormData(signInForm)
      let isFormValid = true

      for (const [name, value] of data) {
        formFields[name] = value
      }
      for (const [name, value] of Object.entries(formFields)) {
        const validationResult = VALIDATION_METHODS[name]?.(value)
        if (validationResult && !validationResult.valid) {
          const el = document.getElementById(name)

          // scrolls into view only for 1st invalid field
          if (isFormValid) el.scrollIntoView({ behavior: 'smooth' })
          isFormValid = false

          el.classList.add('invalid-field-warning')
          if (el.nextElementSibling.classList.contains('error-message')) {
            el.nextElementSibling.classList.remove('hidden')
            el.nextElementSibling.innerHTML = validationResult.message
          }

          el.addEventListener('input', () => {
            if (VALIDATION_METHODS[name](el.value).valid === true) {
              el.classList.remove('invalid-field-warning')
              if (el.nextElementSibling.classList.contains('error-message')) {
                el.nextElementSibling.classList.add('hidden')
              }
            }
          })
        }
      }

      console.log('form is complete:', isFormValid)

      if (isFormValid) signInForm.requestSubmit()
    })

    signInForm.addEventListener('submit', (event) => {
      console.log('submitted')
    })
  }
}
