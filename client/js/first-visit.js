import { submitSignInForm, validateAndSubmit } from './lib.js'

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

const REDIRECT = 'http://localhost:8080/submitted'
const FORM_FIELDS = {
  'first-name': '',
  'last-name': '',
  email: '',
  'visitor-role': {},
  'liability-waiver': false,
  newsletter: false,
  'photo-release': false,
  'first-visit': false,
  'new-entry': true,
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

  const urlSearchParams = new URLSearchParams(window.location.search)
  if (urlSearchParams.get('new-entry') === 'true')
    FORM_FIELDS['first-visit'] = false
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
  formSubmitButton.addEventListener('click', (event) =>
    validateAndSubmit(event, signInForm, FORM_FIELDS),
  )
  signInForm.addEventListener('submit', (event) =>
    submitSignInForm(event, FORM_FIELDS, REDIRECT),
  )
}
