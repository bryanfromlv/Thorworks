import storage from './storage.js'
import gbList from './gbList.js'
import calc from './calc.js'
import { initNewGb, resetNewGbForm } from './newGb.js'
import nav from './gbtracker_navmodule.js'
// import dev_utils from './dev_utils.js' //!
const navBar = new nav()
const store = new storage()
const gb_list = new gbList(document.querySelector('.list-section'))
const calculator = new calc()
// const devUtils = new dev_utils() //!
// devUtils.buildGbs() //! comment these out after first run, only use to create test gb's
export {
  store,
  gb_list,
  navBar,
  calculator,
  showCalculator,
  showGbList,
  showNewGb,
  showHelp,
  checkCalcNav,
}

const listsection = document.querySelector('#list_section')
const newGbForm = document.querySelector('#new_gb_form')
const calcForm = document.querySelector('#calc_form')
const calcLink = document.querySelector('.top-nav-list > li:nth-of-type(4) > button')
const helpSlideshow = document.querySelector('.swiper')
const helpSlideshowBackground = document.querySelector('.help-ss-modal-bkg')
const helpCloseBtn = document.querySelector('.ss-close-btn')
const mqlOrient = window.matchMedia('(max-width: 640px) and (orientation: portrait)')
const orientModalBkg = document.querySelector('.orient-bkg')
const orientModalContainer = document.querySelector('.orient-modal-container')
const orientModalOkBtn = document.querySelector('#orient_ok_btn')
const storageTest = store.storageAvailable('localStorage')

if (!storageTest) {
  // Too bad, no localStorage for us
  location.href = './nostorage.html'
}

//! initialize newGb script (imported from newGb.js)
initNewGb()

//! use dynamic media query to check orientation on small screen (< 640px)
const checkOrientation = mql => {
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
const checkCalcNav = () => {
  if (!store.getCurGbKey()) {
    // console.log(`disabling calc nav`)
    calcLink.classList.remove('top-nav-item-active') // not needed?
    calcLink.classList.add('nav-item-disabled')
    return true
  }
  // console.log(`enabling calc nav`)
  calcLink.classList.remove('nav-item-disabled')
  return false
}
checkCalcNav()

//! constrain calc form tab focus
let focusableContent = calcForm.querySelectorAll('input[type="number"]')
let firstFocusableElement = focusableContent[0]
let lastFocusableElement = focusableContent[focusableContent.length - 1]
document.addEventListener('keydown', evt => {
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
  checkCalcNav()
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

const showHelp = () => {
  helpSlideshow.classList.remove('ss-hide')
  helpSlideshowBackground.classList.remove('ss-bkg-hide')
}

const hideHelp = () => {
  helpSlideshow.classList.add('ss-hide')
  helpSlideshowBackground.classList.add('ss-bkg-hide')
}
helpCloseBtn.addEventListener('click', hideHelp)

// console.log(`main.js loaded`)
