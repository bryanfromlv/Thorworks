const backBtn = document.querySelector('.pi-back-btn')

backBtn.addEventListener('click', () => {
  console.log('backBtn clicked')
  window.open('../', '_self')
})
