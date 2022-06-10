import { myArcObj } from './quick_calcs.js'
export default class quick19 {
  constructor() {
    const myFs = document.querySelector('#quick_calc_fs')
    const displayText = document.querySelector('.display-txt')
    const mxrbGroup = document.querySelectorAll('input[name="mx"]')
    // const myArcInput = document.querySelector('#arc_mx_input')
    const mineDisplay = document.querySelector('#mine')
    const fpField = document.querySelector('#fp_input')
    const calcBtn = document.querySelector('#qc_calc_btn')
    const clearBtn = document.querySelector('#qc_clear_btn')
    fpField.focus()
    let mx = 'mx19'
    //! add event listener to fieldset, focus fp input
    myFs.addEventListener('click', () => {
      fpField.focus()
    })

    //! add event listeners to the radio buttons
    mxrbGroup.forEach(rb => {
      rb.addEventListener('change', evt => {
        checkMxRbs(evt)
      })
    })
    const checkMxRbs = evt => {
      mx = evt.target.value
      calculate()
    }

    //! called from radio buttons, calc button, and enter key
    const calculate = () => {
      if (fpField.value == '') {
        displayText.innerHTML = '0'
        return
      }

      if (myArcObj.val <= 0 || myArcObj.val == '') {
        mineDisplay.innerHTML = 'Enter arc multiplier'
      } else {
        mineDisplay.innerHTML = Math.ceil(fpField.value * myArcObj.val)
      }

      switch (mx) {
        case 'mx19':
          displayText.innerHTML = Math.ceil(fpField.value * 1.9)
          break
        case 'mx192':
          displayText.innerHTML = Math.ceil(fpField.value * 1.92)
          break
        case 'mx194':
          displayText.innerHTML = Math.ceil(fpField.value * 1.94)
          break
        default:
          alert(`calculate() error: mx=${mx}`)
          break
      }
      // select the text in fpField
      fpField.select()
    }

    //! add event listener to fp input, handle enter key
    fpField.addEventListener('keydown', evt => {
      if (evt.key !== 'Enter' && evt.key !== 'Tab') {
        return
      }
      calculate()
    })

    //! add event listener to calc button
    calcBtn.addEventListener('click', () => {
      calculate()
    })

    //! add event listener to clear button
    clearBtn.addEventListener('click', () => {
      displayText.innerHTML = ''
      mineDisplay.innerHTML = 'My Arc'
      fpField.value = ''
    })
    // console.log(`quick19_module instantiated`)
  }
}
// console.log(`quick19_module loaded`)
