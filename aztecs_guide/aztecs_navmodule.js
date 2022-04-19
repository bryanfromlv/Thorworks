export default class nav {
  constructor() {
    const navLogo = document.querySelector('.top-nav-logo')
    //! we comment this out because dropdown is actually topNav1
    // const topNav1 = document.querySelector('.top-nav-list > li:nth-of-type(2)')
    const dd1Item1 = document.querySelector('.nav_dropdown_list_1  li:nth-of-type(1)')
    const dd1Item2 = document.querySelector('.nav_dropdown_list_1  li:nth-of-type(2)')
    const dd1Item3 = document.querySelector('.nav_dropdown_list_1  li:nth-of-type(3)')
    const topNav2 = document.querySelector('.top-nav-list > li:nth-of-type(3)')
    const topNav3 = document.querySelector('.top-nav-list > li:nth-of-type(4)')
    // const bottomNav1 = document.querySelector('.bottom-nav-list > li:nth-of-type(1)')
    // const bottomNav2 = document.querySelector('.bottom-nav-list > li:nth-of-type(2)')
    // const bottomNav3 = document.querySelector('.bottom-nav-list > li:nth-of-type(3)')
    const scrollTopBtn = document.querySelector('#scroll_top_btn')
    const scrollBtnTrigger = document.querySelector('#scroll_btn_trigger')

    // utility
    this.topActiveItem
    this.botActiveItem
    const updateActive = (loc, el) => {
      // console.log(`${el.innerText} clicked`)
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
    // logo
    const doNavLogo = evt => {
      window.open('../', '_self')
    }
    navLogo.addEventListener('click', doNavLogo)

    // dropdown items
    const doDd1Item1 = evt => {
      window.open('../gb_tracker/', '_self')
    }
    dd1Item1.addEventListener('click', doDd1Item1)

    const doDd1Item2 = evt => {
      window.open('../quick_calcs/', '_self')
    }
    dd1Item2.addEventListener('click', doDd1Item2)

    const doDd1Item3 = evt => {
      window.open('./aztecs_guide/', '_self')
    }
    dd1Item3.addEventListener('click', doDd1Item3)

    const doTopNav2 = evt => {
      evt.target.classList.add('top-nav-item-active')
      updateActive('top', evt.target)
      window.open('../lab/', '_self')
    }
    topNav2.addEventListener('click', doTopNav2)

    const doTopNav3 = evt => {
      evt.target.classList.add('top-nav-item-active')
      updateActive('top', evt.target)
      window.open('../pi/', '_self')
    }
    topNav3.addEventListener('click', doTopNav3)

    //! bottom nav
    // const doBottomNav1 = (evt) => {
    //   evt.target.classList.add('bottom-nav-item-active')
    //   updateActive('bot', evt.target)
    //   window.open('./construction.html', '_self')
    // }
    // bottomNav1.addEventListener('click', doBottomNav1)

    // const doBottomNav2 = (evt) => {
    //   evt.target.classList.add('bottom-nav-item-active')
    //   updateActive('bot', evt.target)
    //   window.open('./construction.html', '_self')
    // }
    // bottomNav2.addEventListener('click', doBottomNav2)

    // const doBottomNav3 = (evt) => {
    //   evt.target.classList.add('bottom-nav-item-active')
    //   updateActive('bot', evt.target)
    //   window.open('https://www.youtube.com/channel/UCWCx7Ys_RxhPS9aiogsFeUw')
    // }
    // bottomNav3.addEventListener('click', doBottomNav3)
    // console.log(`aztecs_navmodule instantiated`)
  }
}
// console.log(`aztecs_navmodule.js loaded`)
