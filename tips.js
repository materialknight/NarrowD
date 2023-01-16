'use strict'
const tooltip = document.querySelector('span')
document
   .querySelector('[name=copy_qr_btn]')
   .addEventListener('click', (event) => {
      navigator.clipboard.writeText(event.target.innerText)
      tooltip.style.display = 'initial'
      setTimeout(() => tooltip.style.display = 'none', 1200)
   })
