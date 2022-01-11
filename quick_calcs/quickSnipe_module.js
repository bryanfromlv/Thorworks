export default class quickSnipe {
  constructor() {
    const arcMxInput = document.querySelector('#arc_mx_input')
    const goalInput = document.querySelector('#goal_input')
    const currentInput = document.querySelector('#current_input')
    const rewardInput = document.querySelector('#reward_input')
    const allInputs = document.querySelectorAll('.qs-container input[type="text"]')
    const myRewardDisplay = document.querySelector('#my_reward')
    const halfLeftDisplay = document.querySelector('#half_left')
    const profitDisplay = document.querySelector('#profit')
    const resultDisplay = document.querySelector('#result_txt')
    const calcBtn = document.querySelector('#qs_calc_btn')
    const clearBtn = document.querySelector('#qs_clear_btn')

    //! check localStorage for saved arcMx value (saved on first run of calculate() and when changed)
    this.arcMx = localStorage.getItem('arcMx')
    if (!this.arcMx) {
      arcMxInput.focus()
    } else {
      arcMxInput.value = this.arcMx
      goalInput.focus()
    }

    //! class methods
    const calculate = () => {
      if (!validate()) {
        return
      }
      // save arcMx value if not set, or if it is different from saved value
      if (this.arcMx !== arcMxInput.value) {
        this.arcMx = arcMxInput.value
        localStorage.setItem('arcMx', this.arcMx)
      }
      // first we have to convert the inputs to numbers
      let mx = Number(arcMxInput.value)
      let goal = Number(goalInput.value)
      let current = Number(currentInput.value)
      let reward = Number(rewardInput.value)
      // now we can calculate
      let halfLeft = (goal - current) / 2
      let myReward = Math.round(reward * mx)
      let profit = myReward - halfLeft
      myRewardDisplay.innerHTML = myReward
      halfLeftDisplay.innerHTML = halfLeft
      profitDisplay.innerHTML = profit
      if (profit > 0) {
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

    //! add event listeners
    calcBtn.addEventListener('click', calculate)
    clearBtn.addEventListener('click', clear)
    console.log(`quickSnipe_module instantiated`)
  }
}
console.log(`quickSnipe_module loaded`)
