export { doAbout, doContact }
import nav from './main_navmodule.js'
console.log(`main.js loaded`)
const mainNavbar = new nav()
const mainSection = document.querySelector('.main-section')
const aboutSection = document.querySelector('.about-section')
const contactSection = document.querySelector('.contact-section')
const aboutCloseBtn = document.querySelector('#about_close_btn')
const contactCloseBtn = document.querySelector('#contact_close_btn')

const doAbout = () => {
  mainSection.classList.add('hide-section')
  aboutSection.classList.remove('hide-section')
  closeContact(false)
}

const doContact = () => {
  mainSection.classList.add('hide-section')
  contactSection.classList.remove('hide-section')
  closeAbout(false)
}

const closeAbout = mainFlag => {
  mainNavbar.updateAbout()
  if (mainFlag) {
    mainSection.classList.remove('hide-section')
  }
  aboutSection.classList.add('hide-section')
}
aboutCloseBtn.addEventListener('click', evt => {
  closeAbout(true)
})

const closeContact = mainFlag => {
  mainNavbar.updateContact()
  if (mainFlag) {
    mainSection.classList.remove('hide-section')
  }
  contactSection.classList.add('hide-section')
}
contactCloseBtn.addEventListener('click', evt => {
  closeContact(true)
})
