const mainContainer = document.querySelector('main')
const displayText = document.querySelector('.display-txt')
const mxrbGroup = document.querySelectorAll('input[name="mx"]')
const fpField = document.querySelector('#fp_input')
const calcBtn = document.querySelector('#calc_btn')
const clearBtn = document.querySelector('#clear_btn')
fpField.focus()
let mx19 = true
//! add event listeners to the radio buttons
mxrbGroup.forEach((rb) => {
  rb.addEventListener('change', (evt) => {
    checkMxRbs(evt)
  })
})
//! radio button event listener function
checkMxRbs = (evt) => {
  if (evt.target.value === 'mx19') {
    mx19 = true
  } else {
    mx19 = false
  }
  calculate()
}

//! add event listener to main, focus fp input
mainContainer.addEventListener('click', () => {
  fpField.focus()
})

//! fp input key event listener function
//! also main calculate function
calculate = () => {
  if (fpField.value == '') {
    displayText.innerHTML = ''
    return
  }
  if (mx19) {
    displayText.innerHTML = Math.round(fpField.value * 1.9)
  } else {
    displayText.innerHTML = Math.round(fpField.value * 1.92)
  }
  // select the text in fpField
  fpField.select()
}

//! add event listener to fp input, handle enter key
fpField.addEventListener('keyup', (evt) => {
  if (evt.key !== 'Enter') {
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
