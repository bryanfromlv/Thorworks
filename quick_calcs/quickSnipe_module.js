export default class quickSnipe {
  constructor() {
    const arcMxInput = document.querySelector('#arc_mx_input')
    const goalInput = document.querySelector('#goal_input')
    const currentInput = document.querySelector('#current_input')
    const rewardInput = document.querySelector('#reward_input')
    const firstPlaceInput = document.querySelector('#first_place_input')
    const allInputs = document.querySelectorAll('.qs-container input[type="text"]')
    const mx19Display = document.querySelector('#mx19display')
    const myRewardDisplay = document.querySelector('#my_reward')
    const leftDisplay = document.querySelector('#left')
    const halfLeftDisplay = document.querySelector('#half_left')
    const toLockDisplay = document.querySelector('#to_lock')
    const profitDisplay = document.querySelector('#profit')
    const resultDisplay = document.querySelector('#result_txt')
    const calcBtn = document.querySelector('#qs_calc_btn')
    const clearBtn = document.querySelector('#qs_clear_btn')
    const container = document.querySelector('#quick_snipe_fs')

    //! check localStorage for saved arcMx value (saved on first run of calculate() and when changed)
    this.arcMx = localStorage.getItem('arcMx')
    if (!this.arcMx) {
      arcMxInput.focus()
    } else {
      arcMxInput.value = this.arcMx
      goalInput.focus()
    }

    //! class methods
    // called on calc button click & enter key
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
      let firstPlace = Number(firstPlaceInput.value)
      // now we can calculate
      let mx19 = Math.round(reward * 1.9)
      let left = goal - current
      let halfLeft = Math.ceil(left / 2)
      let myReward = Math.round(reward * mx)
      let toLock = halfLeft + firstPlace
      let profit = myReward - halfLeft
      mx19Display.innerHTML = mx19
      myRewardDisplay.innerHTML = myReward
      leftDisplay.innerHTML = left
      halfLeftDisplay.innerHTML = halfLeft
      toLockDisplay.innerHTML = toLock
      profitDisplay.innerHTML = profit
      if (profit > 0) {
        resultDisplay.innerHTML = 'Snipe it!'
      } else {
        resultDisplay.innerHTML = 'Give it up!'
      }
      resultDisplay.classList.remove('hide')
    }

    // called on keyup
    const update = (evt) => {
      // console.log(evt.key)
      if (evt.key !== 'Tab' && evt.key !== 'Enter') {
        return
      } else if (evt.key == 'Enter') {
        calculate()
        return
      }
      // console.log(evt.key)
      let goal = Number(goalInput.value)
      let current = Number(currentInput.value)
      if (goal == 0 || current == 0) {
        return
      }
      let left = goal - current
      let halfLeft = Math.ceil(left / 2)
      leftDisplay.innerHTML = left
      halfLeftDisplay.innerHTML = halfLeft
      let reward = Number(rewardInput.value)
      let mx19 = Math.round(reward * 1.9)
      if (reward > 0) {
        mx19Display.innerHTML = mx19
      }
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
      if (firstPlaceInput.value === '') {
        resetStyles()
        firstPlaceInput.style.borderColor = 'red'
        firstPlaceInput.style.borderWidth = '3px'
        firstPlaceInput.focus()
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
      firstPlaceInput.value = ''
      halfLeftDisplay.innerHTML = ''
      profitDisplay.innerHTML = ''
      resultDisplay.classList.add('hide')
      goalInput.focus()
    }

    //! add event listeners
    container.addEventListener('keyup', update)
    calcBtn.addEventListener('click', calculate)
    clearBtn.addEventListener('click', clear)
    console.log(`quickSnipe_module instantiated`)
  }
}
console.log(`quickSnipe_module loaded`)
