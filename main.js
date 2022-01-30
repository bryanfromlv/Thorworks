export { doAbout, doContact }
import nav from './main_navmodule.js'
console.log(`main.js loaded`)
const mainNavbar = new nav()
const mainSection = document.querySelector('.main-section')
const aboutSection = document.querySelector('.about-section')
const contactSection = document.querySelector('.contact-section')
const aboutCloseBtn = document.querySelector('#about_close_btn')
const contactCloseBtn = document.querySelector('#contact_close_btn')
const contactFormControls = document.querySelectorAll('.contact-form-control')
//! url parameter processing for contact form
const queryString = window.location.search
console.log(`queryString: ${queryString}`)
const urlParams = new URLSearchParams(queryString)
const messageSent = urlParams.get('messageSent')
console.log(`messageSent = ${messageSent}`)

//! navigation
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

//! contact form- label animation and placeholder text show/hide
contactFormControls.forEach(control => {
  control.addEventListener('focus', evt => {
    let myLabel = evt.target.labels[0]
    // console.log(`focus: ${myLabel.innerText}`)
    myLabel.classList.add('contact-form-control-focused')
    evt.target.placeholder = ''
  })
  control.addEventListener('blur', evt => {
    let myLabel = evt.target.labels[0]
    // console.log(`blur: ${myLabel.innerText}`)
    myLabel.classList.remove('contact-form-control-focused')
    evt.target.placeholder = myLabel.innerText
  })
})
