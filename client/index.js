'use strict'

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

      modalCheckbox.checked = mainFormCheckbox.checked
    }

    document.addEventListener('keydown', (event) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape') {
        hideModal()
      }
    })

    overlay.addEventListener('click', hideModal)

    showWaiverButton.addEventListener('click', showModal)
  }
}
