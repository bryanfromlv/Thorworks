export default class quick19 {
  constructor() {
    const myFs = document.querySelector('#quick_calc_fs')
    const displayText = document.querySelector('.display-txt')
    const mxrbGroup = document.querySelectorAll('input[name="mx"]')
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
    mxrbGroup.forEach((rb) => {
      rb.addEventListener('change', (evt) => {
        checkMxRbs(evt)
      })
    })
    const checkMxRbs = (evt) => {
      mx = evt.target.value
      calculate()
    }

    //! called from radio buttons, calc button, and enter key
    const calculate = () => {
      if (fpField.value == '') {
        displayText.innerHTML = '0'
        return
      }
      switch (mx) {
        case 'mx19':
          displayText.innerHTML = Math.round(fpField.value * 1.9)
          break
        case 'mx192':
          displayText.innerHTML = Math.round(fpField.value * 1.92)
          break
        case 'mx194':
          displayText.innerHTML = Math.round(fpField.value * 1.94)
          break
        default:
          alert(`calculate() error: ${mx}`)
          break
      }
      // select the text in fpField
      fpField.select()
    }

    //! add event listener to fp input, handle enter key
    fpField.addEventListener('keydown', (evt) => {
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
      fpField.value = ''
    })
    console.log(`quick19_module loaded and initiated`)
  }
}
