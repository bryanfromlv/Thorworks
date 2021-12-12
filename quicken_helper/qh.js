// input/display elements
const priceInput = document.querySelector('#priceInput')
const taxCheck = document.querySelector('#useTax')
const taxTotal = document.querySelector('#tax_total')
const display = document.querySelector('#calc_content')
const total = document.querySelector('#total')
// Buttons
const cBtn = document.querySelector('#clear_btn')
const ceBtn = document.querySelector('#clear_entry_btn')
const plusBtn = document.querySelector('#plus_btn')
const equalsBtn = document.querySelector('#equals_btn')
const resetBtn = document.querySelector('#reset_btn')

// utility constants
const priceValueSet = new Set([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '.',
  'Backspace',
  'Delete',
])
const globalValueSet = new Set(['Enter', '=', '+', 't', '?'])
const undoArray = []
class Undo {
  constructor(id, dt, st, gt, ttl) {
    this.id = id
    this.displayText = dt
    this.subTotal = st
    this.grandTotal = gt
    this.ttLength = ttl
  }
}

// calculation constants
const tax = 0.07975
const taxTracker = []
// variables
let displayText = ''
let price = 0
let subTotal = 0
let grandTotal = 0
let totalTax = 0
let firstEntry = true // prevents '+' on first entry
let totaledFlag = true // used for CE function

// clear price input & set tax checkbox state
onload = () => {
  // console.log('onLoad()')
  taxCheck.checked = true
  clearPriceInput()
}

//! listener functions (have to be declared before adding event listeners)
// document keys
globalKeyHandler = (evt) => {
  if (globalValueSet.has(evt.key)) {
    switch (evt.key) {
      case 'Enter':
        doEquals()
        break
      case '+':
        addPrice()
        break
      case '=':
        doEquals()
        break
      case 't':
        taxCheck.checked = !taxCheck.checked
        break
      case '?':
        console.log('do easter egg here')
      default:
        break
    }
  } else {
    evt.preventDefault()
  }
}

// input field keys
priceKeyPreventer = (evt) => {
  if (!priceValueSet.has(evt.key)) {
    evt.preventDefault()
  }
}

// calculator buttons
addPrice = (eqFlag = false) => {
  console.log(`addPrice(${eqFlag})`)
  //! bug fix- avoid NaN & prevent display etc
  if (priceInput.value == '') {
    price = 0 // do nothing- skip the rest of this function
  } else {
    // create & populate undo object prior to any change
    let undoObj = new Undo(undoArray.length, displayText, subTotal, grandTotal, taxTracker.length)
    undoArray.push(undoObj)
    totaledFlag = eqFlag // for CE function
    price = parseFloat(priceInput.value)
    // process first entry differently (no '+')
    if (firstEntry) {
      if (taxCheck.checked) {
        displayText += `t ${price.toFixed(2)}<br>`
      } else {
        displayText += `${price.toFixed(2)}<br>`
      }
      firstEntry = false
    } else if (taxCheck.checked) {
      displayText += `t +${price.toFixed(2)}<br>`
    } else {
      displayText += `+${price.toFixed(2)}<br>`
    }
    subTotal += price
    grandTotal += price
    if (taxCheck.checked) {
      let thisTax = price * tax
      taxTracker.push(thisTax)
    }
    if (eqFlag) {
      let myTax = doSubTotal()
      let subTotalWithTax = subTotal + myTax
      displayText += `<hr>${subTotalWithTax.toFixed(2)}<br>`
      displayText += `(tax ${myTax})<br><br>`
      subTotal = 0
      firstEntry = true
    }
    total.innerHTML = `$${grandTotal.toFixed(2)}`
    display.innerHTML = displayText
    clearPriceInput()
  }
}

doSubTotal = () => {
  console.log('doSubTotal()')
  //clear all undo objects
  undoArray.length = 0
  // total the taxTracker array
  let thisTax = 0
  for (const el of taxTracker) {
    thisTax += el
  }
  totalTax += thisTax
  taxTotal.innerHTML = `$${totalTax.toFixed(2)}`
  // then clear the taxTracker array
  taxTracker.length = 0
  // add tax to the total
  grandTotal += thisTax
  // update total display
  total.innerHTML = `$${grandTotal.toFixed(2)}`
  return Number(thisTax.toFixed(2))
}

doEquals = () => {
  console.log('doEquals()')
  // we have to call addPrice() in order to update displays & variables
  // send true to set addPrice() to equals mode
  addPrice(true)
}

doClear = () => {
  console.log('doClear()')
  taxTracker.length = 0
  displayText = ''
  display.innerHTML = ''
  totaledFlag = true
}

doClearEntry = () => {
  console.log('doClearEntry()')
  priceInput.value = ''
  // if '=' has been pressed we want to ignore all this
  // because clear entry only applies to '+' entries
  if (!totaledFlag && undoArray.length > 0) {
    // restore values saved in undo object
    displayText = undoArray[undoArray.length - 1].displayText
    display.innerHTML = displayText
    subTotal = undoArray[undoArray.length - 1].subTotal
    grandTotal = undoArray[undoArray.length - 1].grandTotal
    total.innerHTML = `$${grandTotal.toFixed(2)}`
    // remove the last entry from taxTracker
    if (undoArray[undoArray.length - 1].ttLength > 0) {
      taxTracker.splice(-1)
    }
    // remove undo object from the end of the array
    undoArray.splice(-1)
  }
}

doReset = () => {
  console.log('doReset()')
  doClear()
  grandTotal = 0
  total.innerHTML = '$'
  totalTax = 0
  taxTotal.innerHTML = '$'
}

//! bug fix- added to prevent mouse event being sent to addPrice()
//! which triggered the eqFlag parameter
doAddPriceButton = () => {
  addPrice()
}

// utility functions
focusPriceInput = () => {
  priceInput.focus()
}

clearPriceInput = () => {
  priceInput.value = ''
}

// add event listeners
document.addEventListener('keyup', globalKeyHandler)
document.querySelector('.main-grid').addEventListener('click', focusPriceInput)
priceInput.addEventListener('keydown', priceKeyPreventer)
cBtn.addEventListener('click', doClear)
ceBtn.addEventListener('click', doClearEntry)
plusBtn.addEventListener('click', doAddPriceButton)
equalsBtn.addEventListener('click', doEquals)
resetBtn.addEventListener('click', doReset)
