'use strict'

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    const waiverButton = document.getElementById('liability-terms-btn')
    const overlay = document.getElementById('modal-overlay')
    const modal = document.getElementById('modal')

    const hideModal = () => {
      overlay.className = 'hidden'
      modal.className = 'hidden'
    }

    const showModal = () => {
      overlay.className = ''
      modal.className = ''
    }

    document.addEventListener('keydown', (event) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape') {
        hideModal()
      }
    })

    overlay.addEventListener('click', hideModal)

    waiverButton.addEventListener('click', showModal)
  }
}
