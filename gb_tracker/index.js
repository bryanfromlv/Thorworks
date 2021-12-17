const gbNameRef = [
  { name: 'Alcatraz', nickname: 'Traz', sort: 'Alcatraz' },
  { name: 'The Arc', nickname: 'Arc', sort: 'Arc' },
  { name: 'Arctic Orangery', nickname: 'AO', sort: 'Arctic' },
  { name: 'Atlantis Museum', nickname: 'AM', sort: 'Atlantis' },
  { name: 'Atomium', nickname: 'Atomium', sort: 'Atomium' },
  { name: 'The Blue Galaxy', nickname: 'BG', sort: 'Blue' },
  { name: 'Cape Canaveral', nickname: 'Cape', sort: 'Cape' },
  { name: 'Capitol', nickname: 'Capitol', sort: 'Capitol' },
  { name: 'Castel del Monte', nickname: 'CdM', sort: 'Castel' },
  { name: 'Cathedral of Aachen', nickname: 'CoA', sort: 'Cathedral' },
  { name: 'Château Frontenac', nickname: 'Château', sort: 'Château' },
  { name: 'Colosseum', nickname: 'Colosseum', sort: 'Colosseum' },
  { name: 'Deal Castle', nickname: 'DC', sort: 'Deal' },
  { name: 'Dynamic Tower', nickname: 'DT', sort: 'Dynamic' },
  { name: 'Frauenkirche of Dresden', nickname: 'FoD', sort: 'Frauenkirche' },
  { name: 'Flying Island', nickname: 'FI', sort: 'Flying' },
  { name: 'Gaea Statue', nickname: 'Gaea', sort: 'Gaea' },
  { name: 'Galata Tower', nickname: 'GT', sort: 'Galata' },
  { name: 'The Habitat', nickname: 'Habitat', sort: 'Habitat' },
  { name: 'Hagia Sophia', nickname: 'HS', sort: 'Hagia' },
  { name: 'Himeji Castle', nickname: 'HC', sort: 'Himeji' },
  { name: 'Innovation Tower', nickname: 'IT', sort: 'Innovation' },
  { name: 'The Kraken', nickname: 'Kraken', sort: 'Kraken' },
  { name: 'Lighthouse of Alexandria', nickname: 'LoA', sort: 'Lighthouse' },
  { name: 'Lotus Temple', nickname: 'LT', sort: 'Lotus' },
  { name: 'Notre Dame', nickname: 'ND', sort: 'Notre' },
  { name: 'Observatory', nickname: 'OBS', sort: 'Observatory' },
  { name: 'Oracle of Delphi', nickname: 'Oracle', sort: 'Oracle' },
  { name: 'Rain Forest Project', nickname: 'RFP', sort: 'Rain' },
  { name: 'Royal Albert Hall', nickname: 'RAH', sort: 'Royal' },
  { name: "Saint Basil's Cathedral", nickname: 'SBC', sort: 'Saint' },
  { name: 'Seed Vault', nickname: 'SV', sort: 'Seed' },
  { name: 'Space Needle', nickname: 'SN', sort: 'Space' },
  { name: "St. Mark's Basilica", nickname: 'SMB', sort: 'St' },
  { name: 'Star Gazer', nickname: 'SG', sort: 'Star' },
  { name: 'Statue of Zeus', nickname: 'Zeus', sort: 'Statue' },
  { name: 'Temple of Relics', nickname: 'ToR', sort: 'Temple' },
  { name: 'Terracotta Army', nickname: 'TA', sort: 'Terracotta' },
  { name: 'Tower of Babel', nickname: 'ToB', sort: 'Tower' },
  { name: 'The Virgo Project', nickname: 'Virgo', sort: 'Virgo' },
  { name: 'Voyager V1', nickname: 'Voyager', sort: 'Voyager' },
]
const gb_Display = new gbDisplay(document.querySelector('.list-section'))
const calculator = new calc()
const listsection = document.querySelector('#list_section')
const newGbForm = document.querySelector('#new_gb_form')
const calcForm = document.querySelector('#calc_form')
const homeLink = document.querySelector('#gb_list')
const newGbLink = document.querySelector('#newGb')
const calcLink = document.querySelector('#calculator')
const calculatorForm = document.querySelector('#calc_form')
// dynamic media query using window.matchMedia
const mqlOrient = window.matchMedia('(max-width: 640px) and (orientation: portrait)')
const orientModalBkg = document.querySelector('.orient-bkg')
const orientModalContainer = document.querySelector('.orient-modal-container')
const orientModalOkBtn = document.querySelector('#orient_ok_btn')

init = () => {
  const storageTest = storageAvailable('localStorage')
  if (storageTest) {
    // initialize newGb script
    initNewGb()
    // check for no stored GB's
    checkNoGbs()
    // handle nav links
    homeLink.addEventListener('click', () => {
      setHomeNavActive()
      showHome()
    })
    newGbLink.addEventListener('click', () => {
      setNewGbNavActive()
      showNewGb()
    })
    //! constrain calc form tab focus
    let focusableContent = calculatorForm.querySelectorAll('input[type="number"]')
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
    //! use dynamic media query to check orientation on small screen (< 640px)
    // add event listener to orient modal ok button
    orientModalOkBtn.addEventListener('click', hideOrientContainer)
    // first, run it manually to check on startup
    checkOrientation(mqlOrient)
    // then use event listener to detect change after load
    mqlOrient.addEventListener('change', checkOrientation)
  } else {
    // Too bad, no localStorage for us
    location.href = './nostorage.html'
  }
}

checkOrientation = (mql) => {
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

showOrientModal = () => {
  orientModalBkg.classList.add('orient-bkg-show')
  orientModalContainer.classList.add('orient-modal-container-show')
}

hideOrientContainer = () => {
  orientModalContainer.classList.remove('orient-modal-container-show')
}

checkNoGbs = () => {
  // check for no stored GB's
  if (!getCurGbKey()) {
    // disable calculator menu item
    disableCalcMenuItem()
  } else {
    enableCalcMenuItem()
    calcLink.addEventListener('click', () => {
      setCalculatorNavActive()
      showCalculator()
    })
  }
}

enableCalcMenuItem = () => {
  calcLink.classList.remove('nav-link-disabled')
}

disableCalcMenuItem = () => {
  calcLink.classList.add('nav-link-disabled')
}

showHome = () => {
  if (getCurGbKey()) {
    enableCalcMenuItem()
    calcLink.addEventListener('click', () => {
      setCalculatorNavActive()
      showCalculator()
    })
  }
  listsection.classList.remove('hide')
  newGbForm.classList.add('hide')
  calcForm.classList.add('hide')
}

showNewGb = () => {
  resetNewGbForm()
  listsection.classList.add('hide')
  calcForm.classList.add('hide')
  newGbForm.classList.remove('hide')
}

showCalculator = () => {
  calcForm.classList.remove('hide')
  listsection.classList.add('hide')
  newGbForm.classList.add('hide')
}

setHomeNavActive = () => {
  homeLink.classList.add('nav-link-active')
  homeLink.classList.remove('nav-link')
  newGbLink.classList.remove('nav-link-active')
  newGbLink.classList.add('nav-link')
  calcLink.classList.remove('nav-link-active')
  calcLink.classList.add('nav-link')
}
setNewGbNavActive = () => {
  newGbLink.classList.add('nav-link-active')
  newGbLink.classList.remove('nav-link')
  calcLink.classList.remove('nav-link-active')
  calcLink.classList.add('nav-link')
  homeLink.classList.remove('nav-link-active')
  homeLink.classList.add('nav-link')
}
setCalculatorNavActive = () => {
  calcLink.classList.add('nav-link-active')
  calcLink.classList.remove('nav-link')
  homeLink.classList.remove('nav-link-active')
  homeLink.classList.add('nav-link')
  newGbLink.classList.remove('nav-link-active')
  newGbLink.classList.add('nav-link')
}
