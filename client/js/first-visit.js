import { getCurrentFormValues, validateAndSubmit } from './lib.js'
import { postNewVisitor } from './api.js'
import { LIABILITY_TEXT } from '../legal/liability_waiver.js'
import { PHOTO_RELEASE } from '../legal/photo_release.js'

/**
 * @typedef {object} RequiredElements
 * @property {HTMLButtonElement} showWaiverButton
 * @property {HTMLButtonElement} showPhotoReleaseButton
 * @property {HTMLDivElement} overlay
 * @property {HTMLElement} modal
 * @property {HTMLHeadingElement} modalTitle
 * @property {HTMLElement} modalBody
 * @property {HTMLButtonElement} modalCloseButton
 * @property {HTMLInputElement} modalCheckbox
 * @property {HTMLInputElement} liabilityCheckbox
 * @property {HTMLInputElement} photoReleaseCheckbox
 * @property {HTMLFormElement} signInForm
 * @property {HTMLButtonElement} formSubmitButton
 */

const REDIRECT = '../submitted'
const FORM_FIELDS = {
  'first-name': '',
  'last-name': '',
  email: '',
  'visitor-role': {},
  'liability-waiver': false,
  newsletter: false,
  'photo-release': false,
  'first-visit': true,
  'new-entry': true,
}

document.onreadystatechange = () => {
  if (
    document.readyState === 'interactive' ||
    document.readyState === 'complete'
  ) {
    // check for necessary DOM elements
    const showWaiverButton = document.getElementById('liability-terms-btn')
    const showPhotoReleaseButton = document.getElementById('photo-release-btn')
    const overlay = document.getElementById('modal-overlay')
    const modal = document.getElementById('modal')
    const modalTitle = document.getElementById('modal-title')
    const modalBody = document.getElementById('modal-body')
    const modalCloseButton = document.getElementById('modal-close-btn')

    const modalCheckbox = document.getElementById('modal-checkbox')
    const liabilityCheckbox = document.getElementById('liability-waiver')
    const photoReleaseCheckbox = document.getElementById('photo-release')

    const signInForm = document.getElementById('sign-in')
    const formSubmitButton = document.getElementById('submit-btn')

    /** @type RequiredElements */
    const requiredElements = {
      showWaiverButton,
      showPhotoReleaseButton,
      overlay,
      modal,
      modalTitle,
      modalCloseButton,
      modalCheckbox,
      liabilityCheckbox,
      photoReleaseCheckbox,
      modalBody,
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
  showPhotoReleaseButton,
  overlay,
  modal,
  modalTitle,
  modalBody,
  modalCloseButton,
  modalCheckbox,
  liabilityCheckbox,
  photoReleaseCheckbox,
  signInForm,
  formSubmitButton,
}) {
  const hideModal = () => {
    overlay.hidden = true
    modal.hidden = true
  }

  const showModal = () => {
    overlay.hidden = false
    modal.hidden = false
  }

  const displayModal = (title, body, checkboxRef) => {
    modalCheckbox.checked = checkboxRef.checked
    modalTitle.innerText = title
    modalBody.innerHTML = body

    const mainTag = document.getElementsByTagName('main')[0]
    const focusableElements = mainTag.querySelectorAll('input, button')
    focusableElements.forEach((el) => (el.tabIndex = -1))

    const syncCheckbox = () => {
      checkboxRef.checked = modalCheckbox.checked
    }

    modalCheckbox.addEventListener('click', syncCheckbox)

    const closeModal = () => {
      focusableElements.forEach((el) => (el.tabIndex = 0))
      hideModal()
      modalCheckbox.removeEventListener('click', syncCheckbox)
      checkboxRef.focus()
    }

    overlay.addEventListener('click', closeModal)
    modalCloseButton.addEventListener('click', closeModal)
    document.addEventListener('keydown', (event) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape') {
        closeModal()
      }
    })
    showModal()
    modalCheckbox.focus()
  }

  showWaiverButton.addEventListener('click', () =>
    displayModal(
      'Liability Waiver for Lefty Loosey Bicycle Collective',
      LIABILITY_TEXT,
      liabilityCheckbox,
    ),
  )
  showPhotoReleaseButton.addEventListener('click', () =>
    displayModal(
      'Photo Release for Lefty Loosey Bicycle Collective',
      PHOTO_RELEASE,
      photoReleaseCheckbox,
    ),
  )
  formSubmitButton.addEventListener('click', (event) =>
    validateAndSubmit(event, signInForm, FORM_FIELDS),
  )
  signInForm.addEventListener('submit', (event) => submitSignInForm(event))
}

/**
 * @async
 * @param {SubmitEvent} event
 * @param {string} redirect - destination URL after the form is submitted
 */
export async function submitSignInForm(event) {
  if (event.target !== null) {
    const formData = getCurrentFormValues(
      /** @type HTMLFormElement */ (event.target),
      FORM_FIELDS,
    )

    console.log(formData)
    const res = await postNewVisitor(formData)
    console.log('submitted')

    if (res.ok && REDIRECT !== undefined) window.location.href = REDIRECT
  }
}
