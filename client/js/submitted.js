document.onreadystatechange = () => {
  if (
    document.readyState === 'interactive' ||
    document.readyState === 'complete'
  ) {
    const redirectText = document.getElementById('redirect-msg')

    const decrementCountdown = (messageElement, startingCount) => {
      let count = startingCount

      return function () {
        messageElement.innerHTML = `This page will automatically return to the sign-in form in ${count} seconds.`
        count--
      }
    }

    if (redirectText !== null) {
      const countdown30 = decrementCountdown(redirectText, 30)

      countdown30()
      const updateCountdown = setInterval(countdown30, 1000)
      const returnToForm = setTimeout(
        () => (window.location.href = '..'),
        30000,
      )
    }
  }
}
