import nav from './quick_calcs_navmodule.js'
import quick19 from './quick19_module.js'
import quickSnipe from './quickSnipe_module.js'

// Force the user to enter arc multiplier (hide calculators until entered and saved)
let arcMx = localStorage.getItem('arcMx')
const myArcInput = document.querySelector('#arc_mx_input')
// create arc object for export to other modules.
export const myArcObj = { el: myArcInput, val: arcMx }
// instantiate imported modules
const navbar = new nav()
const quickCalc = new quick19()
const quickSniper = new quickSnipe()
const quickCalcFs = document.querySelector('#quick_calc_fs')
const quickSnipeFs = document.querySelector('#quick_snipe_fs')

if (!arcMx) {
  // not in localStorage
  myArcInput.focus()
  // hide calculators
  quickCalcFs.classList.add('hide')
  quickSnipeFs.classList.add('hide')
} else {
  // found arcMx in localStorage
  quickCalcFs.classList.remove('hide')
  quickSnipeFs.classList.remove('hide')
  // fill in the arc multiplier value
  myArcInput.value = arcMx
}

// save arcMx value if not set, or if it is different from saved value
const checkArcMx = () => {
  // console.log(`checkArcMx()`)
  // if arcMx is not set, save input value to localStorage
  if (!arcMx && myArcInput.value !== '') {
    // console.log(`saving arcMx to localStorage`)
    arcMx = myArcInput.value
    localStorage.setItem('arcMx', arcMx)
    quickCalcFs.classList.remove('hide')
    quickSnipeFs.classList.remove('hide')
  } else {
    // update arcMx if input has changed
    // console.log(`updating arcMx`)
    if (arcMx !== myArcInput.value) {
      // console.log(`saving arcMx to localStorage`)
      arcMx = myArcInput.value
      localStorage.setItem('arcMx', arcMx)
    }
  }
}

// check arcMx input on keyup enter/tab & blur events
myArcInput.addEventListener('keydown', evt => {
  if (evt.key !== 'Enter' && evt.key !== 'Tab') {
    return
  }
  checkArcMx()
})

myArcInput.addEventListener('blur', () => {
  checkArcMx()
})
