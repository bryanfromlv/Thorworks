import storage from './storage.js'
import gbList from './gbList.js'
import calc from './calc.js'
import { initNewGb, resetNewGbForm } from './newGb.js'
import nav from './gbtracker_navmodule.js'
const navBar = new nav()
const store = new storage()
const gb_list = new gbList(document.querySelector('.list-section'))
const calculator = new calc()
export { store, gb_list, calculator, showCalculator, showGbList, showNewGb, setCalculatorNav }

const listsection = document.querySelector('#list_section')
const newGbForm = document.querySelector('#new_gb_form')
const calcForm = document.querySelector('#calc_form')
const navLogo = document.querySelector('.top-nav-logo')
const gbListLink = document.querySelector('.top-nav-list > li:nth-of-type(2)')
const newGbLink = document.querySelector('.top-nav-list > li:nth-of-type(3)')
const calcLink = document.querySelector('.top-nav-list > li:nth-of-type(4)')
// dynamic media query using window.matchMedia
const mqlOrient = window.matchMedia('(max-width: 640px) and (orientation: portrait)')
const orientModalBkg = document.querySelector('.orient-bkg')
const orientModalContainer = document.querySelector('.orient-modal-container')
const orientModalOkBtn = document.querySelector('#orient_ok_btn')
const storageTest = store.storageAvailable('localStorage')

if (!storageTest) {
  // Too bad, no localStorage for us
  location.href = './nostorage.html'
}

//! initialize newGb script
initNewGb()

//! use dynamic media query to check orientation on small screen (< 640px)
const checkOrientation = (mql) => {
  if (!mql.matches) {
    //! bug fix- remove the transition so it doesn't run on orientation change
    if (mql.type == 'change') {
      orientModalContainer.style.transition = 'none'
    } else {
      orientModalContainer.style.transition = 'top 500ms ease-in-out, opacity 500ms ease-in-out'
    }
    orientModalBkg.classList.remove('orient-bkg-show')
    orientModalContainer.classList.remove('orient-modal-container-show')
    return
  }
  showOrientModal()
}
const showOrientModal = () => {
  orientModalBkg.classList.add('orient-bkg-show')
  orientModalContainer.classList.add('orient-modal-container-show')
}
// hide just the container on ok button click, leave the background until orientation changes
const hideOrientContainer = () => {
  orientModalContainer.classList.remove('orient-modal-container-show')
}
// first, run it manually to check on startup
checkOrientation(mqlOrient)
// then use event listener to detect change after load
mqlOrient.addEventListener('change', checkOrientation)
// add event listener to orient modal ok button
orientModalOkBtn.addEventListener('click', hideOrientContainer)

//! check for no stored GB's and set calculator nav item active/inactive
// export this function, it is used by gbList & newGb scripts
const setCalculatorNav = () => {
  console.log(`setCalculatorNav()`)
  if (!store.getCurGbKey()) {
    calcLink.classList.remove('top-nav-item-active')
    calcLink.classList.add('nav-item-disabled')
  } else {
    calcLink.classList.remove('nav-item-disabled')
  }
}
setCalculatorNav()

//! constrain calc form tab focus
let focusableContent = calcForm.querySelectorAll('input[type="number"]')
let firstFocusableElement = focusableContent[0]
let lastFocusableElement = focusableContent[focusableContent.length - 1]
document.addEventListener('keydown', (evt) => {
  let isTabPressed = evt.key === 'Tab' || evt.keyCode === 9
  if (!isTabPressed) {
    return
  }
  if (evt.shiftKey) {
    // shift + tab
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus()
      evt.preventDefault()
    }
  } else {
    // tab
    if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus()
      evt.preventDefault()
    }
  }
})

const showGbList = () => {
  setCalculatorNav()
  listsection.classList.remove('hide')
  newGbForm.classList.add('hide')
  calcForm.classList.add('hide')
}

const showNewGb = () => {
  resetNewGbForm()
  listsection.classList.add('hide')
  calcForm.classList.add('hide')
  newGbForm.classList.remove('hide')
}

const showCalculator = () => {
  calcForm.classList.remove('hide')
  listsection.classList.add('hide')
  newGbForm.classList.add('hide')
}

// const setGbListActive = () => {
//   gbListLink.classList.add('nav-link-active')
//   gbListLink.classList.remove('nav-link')
//   newGbLink.classList.remove('nav-link-active')
//   newGbLink.classList.add('nav-link')
//   calcLink.classList.remove('nav-link-active')
//   calcLink.classList.add('nav-link')
// }
// const setNewGbNavActive = () => {
//   newGbLink.classList.add('nav-link-active')
//   newGbLink.classList.remove('nav-link')
//   calcLink.classList.remove('nav-link-active')
//   calcLink.classList.add('nav-link')
//   gbListLink.classList.remove('nav-link-active')
//   gbListLink.classList.add('nav-link')
// }
// const setCalculatorNavActive = () => {
//   calcLink.classList.add('nav-link-active')
//   calcLink.classList.remove('nav-link')
//   gbListLink.classList.remove('nav-link-active')
//   gbListLink.classList.add('nav-link')
//   newGbLink.classList.remove('nav-link-active')
//   newGbLink.classList.add('nav-link')
// }

// handle nav links
// gbListLink.addEventListener('click', () => {
//   setGbListActive()
//   showGbList()
// })
// newGbLink.addEventListener('click', () => {
//   setNewGbNavActive()
//   showNewGb()
// })
// calcLink.addEventListener('click', () => {
//   setCalculatorNavActive()
//   showCalculator()
// })
console.log(`main.js loaded`)
