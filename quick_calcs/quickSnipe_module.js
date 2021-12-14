export default class quickSnipe {
  constructor() {
    const arcMxInput = document.querySelector('#arc_mx_input')
    const goalInput = document.querySelector('#goal_input')
    const currentInput = document.querySelector('#current_input')
    const rewardInput = document.querySelector('#reward_input')
    const allInputs = document.querySelectorAll('.qs-container input[type="text"]')
    const halfLeftDisplay = document.querySelector('#half_left')
    const profitDisplay = document.querySelector('#profit')
    const resultDisplay = document.querySelector('#result_txt')
    const calcBtn = document.querySelector('#qs_calc_btn')
    const clearBtn = document.querySelector('#qs_clear_btn')
    // class methods
    const calculate = () => {
      console.log(`calculate()`)
      if (!validate()) {
        console.log(`invalid input`)
        return
      }
      if (!this.arcMx) {
        this.arcMx = arcMxInput.value
        localStorage.setItem('arcMx', this.arcMx)
      }
      // first we have to convert the inputs to numbers
      let mx = Number(arcMxInput.value)
      let goal = Number(goalInput.value)
      let current = Number(currentInput.value)
      let reward = Number(rewardInput.value)
      // now we can calculate
      //todo: still need to add mx into these calculations
      let halfLeft = (goal - current) / 2
      let profit = reward - halfLeft
      halfLeftDisplay.innerHTML = halfLeft
      profitDisplay.innerHTML = profit
      if (reward > halfLeft) {
        resultDisplay.innerHTML = 'Snipe it!'
      } else {
        resultDisplay.innerHTML = 'Give it up!'
      }
      resultDisplay.classList.remove('hide')
    }

    const validate = () => {
      if (arcMxInput.value === '') {
        arcMxInput.style.borderColor = 'red'
        arcMxInput.style.borderWidth = '3px'
        arcMxInput.focus()
        return false
      }
      if (goalInput.value === '') {
        resetStyles()
        goalInput.style.borderColor = 'red'
        goalInput.style.borderWidth = '3px'
        goalInput.focus()
        return false
      }
      if (currentInput.value === '') {
        resetStyles()
        currentInput.style.borderColor = 'red'
        currentInput.style.borderWidth = '3px'
        currentInput.focus()
        return false
      }
      if (rewardInput.value === '') {
        resetStyles()
        rewardInput.style.borderColor = 'red'
        rewardInput.style.borderWidth = '3px'
        rewardInput.focus()
        return false
      }
      resetStyles()
      return true
    }

    const resetStyles = () => {
      console.log(`resetStyles()`)
      allInputs.forEach((el) => {
        el.style.borderColor = 'black'
        el.style.borderWidth = '1px'
      })
    }

    const clear = () => {
      resetStyles()
      goalInput.value = ''
      currentInput.value = ''
      rewardInput.value = ''
      halfLeftDisplay.innerHTML = ''
      profitDisplay.innerHTML = ''
      resultDisplay.classList.add('hide')
      goalInput.focus()
    }

    //! check localStorage for saved arcMx value (saved on first run of calculate())
    this.arcMx = localStorage.getItem('arcMx')
    if (!this.arcMx) {
      arcMxInput.focus()
    } else {
      arcMxInput.value = this.arcMx
      goalInput.focus()
    }

    //! add event listener to calc button
    calcBtn.addEventListener('click', calculate)

    //! add event listener to clear button
    clearBtn.addEventListener('click', clear)

    console.log(`quickSnipe_module loaded and initiated`)
  }
}
