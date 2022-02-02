export { doAbout, doContact }
import nav from './main_navmodule.js'
const mainNavbar = new nav()
const mainSection = document.querySelector('.main-section')
const aboutSection = document.querySelector('.about-section')
const contactSection = document.querySelector('.contact-section')
const aboutCloseBtn = document.querySelector('#about_close_btn')
const contactCloseBtn = document.querySelector('#contact_close_btn')
const contactFormControls = document.querySelectorAll('.contact-form-control')
const contactFormTitle = document.querySelector('.contact-form-title')

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

//! url parameter processing for contact form
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const messageSent = urlParams.get('messageSent')
if (messageSent == 1) {
  // this means that the contact form was successfully submitted, processed,
  // and redirected to index.html, which means a full reload.
  // so we need to reactivate the contact form (hiding other sections)
  // and put up a success message using .contact-form-title
  contactFormTitle.innerHTML = 'Thank you, your message has been sent!'
  contactFormTitle.classList.remove('red')
  doContact()
} else if (messageSent !== null) {
  contactFormTitle.innerHTML = 'Sorry, there was an error sending your message!'
  contactFormTitle.classList.add('red')
  doContact()
} else {
  // messageSent must be null so restore title to default
  contactFormTitle.innerHTML = 'E-Mail Thordarsen'
  contactFormTitle.classList.remove('red')
}

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
