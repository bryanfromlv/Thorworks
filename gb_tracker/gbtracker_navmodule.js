import { showCalculator, showGbList, showNewGb } from './main.js'
export default class nav {
  constructor() {
    const navLogo = document.querySelector('.top-nav-logo')
    const topNav1 = document.querySelector('.top-nav-list > li:nth-of-type(2)')
    const topNav2 = document.querySelector('.top-nav-list > li:nth-of-type(3)')
    const topNav3 = document.querySelector('.top-nav-list > li:nth-of-type(4)')
    // const topNav4 = document.querySelector('.top-nav-list > li:nth-of-type(5)')
    const bottomNav1 = document.querySelector('.bottom-nav-list > li:nth-of-type(1)')
    const bottomNav2 = document.querySelector('.bottom-nav-list > li:nth-of-type(2)')
    const bottomNav3 = document.querySelector('.bottom-nav-list > li:nth-of-type(3)')

    // utility
    this.topActiveItem
    this.botActiveItem
    const updateActive = (loc, el) => {
      console.log(`${el.innerText} clicked`)
      if (this.topActiveItem) {
        this.topActiveItem.classList.remove('top-nav-item-active')
      }
      if (this.botActiveItem) {
        this.botActiveItem.classList.remove('bottom-nav-item-active')
      }
      if (loc === 'top') {
        this.topActiveItem = el
      } else {
        this.botActiveItem = el
      }
    }

    //! top nav
    const doNavLogo = (evt) => {
      window.open('../', '_self')
    }
    navLogo.addEventListener('click', doNavLogo)

    const doTopNav1 = (evt) => {
      evt.target.classList.add('top-nav-item-active')
      updateActive('top', evt.target)
      showGbList()
    }
    topNav1.addEventListener('click', doTopNav1)

    const doTopNav2 = (evt) => {
      evt.target.classList.add('top-nav-item-active')
      updateActive('top', evt.target)
      showNewGb()
    }
    topNav2.addEventListener('click', doTopNav2)

    const doTopNav3 = (evt) => {
      evt.target.classList.add('top-nav-item-active')
      updateActive('top', evt.target)
      showCalculator()
    }
    topNav3.addEventListener('click', doTopNav3)

    //! bottom nav
    const doBottomNav1 = (evt) => {
      evt.target.classList.add('bottom-nav-item-active')
      updateActive('bot', evt.target)
      window.open('../', '_self')
    }
    bottomNav1.addEventListener('click', doBottomNav1)

    const doBottomNav2 = (evt) => {
      evt.target.classList.add('bottom-nav-item-active')
      updateActive('bot', evt.target)
      window.open('./construction.html', '_self')
    }
    bottomNav2.addEventListener('click', doBottomNav2)

    const doBottomNav3 = (evt) => {
      evt.target.classList.add('bottom-nav-item-active')
      updateActive('bot', evt.target)
      window.open('./construction.html', '_self')
    }
    bottomNav3.addEventListener('click', doBottomNav3)
    console.log(`gbtracker_navmodule instantiated`)
  }
}
console.log(`gbtracker_navmodule.js loaded`)
