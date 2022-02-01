import { myArcObj } from './quick_calcs.js'
export default class quickSnipe {
  constructor() {
    // const arcMxInput = document.querySelector('#arc_mx_input')
    const goalInput = document.querySelector('#goal_input')
    const currentInput = document.querySelector('#current_input')
    const rewardInput = document.querySelector('#pos_reward_input')
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
    const quickSnipeFs = document.querySelector('#quick_snipe_fs')

    //! class methods
    // called on calc button click & enter key
    const calculate = () => {
      if (!validate()) {
        return
      }
      // first we have to convert the inputs to numbers
      // let mymx = Number(arcMxInput.value)
      let goal = Number(goalInput.value)
      let current = Number(currentInput.value)
      let reward = Number(rewardInput.value)
      let firstPlace = Number(firstPlaceInput.value)
      // now we can calculate
      let mx19 = Math.round(reward * 1.9)
      let left = goal - current
      let halfLeft = Math.ceil(left / 2)
      let myReward = Math.round(reward * myArcObj.val)
      let toLock = halfLeft + firstPlace / 2
      let profit = myReward - toLock
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
    const update = evt => {
      if (evt.key !== 'Tab' && evt.key !== 'Enter') {
        return
      } else if (evt.key == 'Enter') {
        calculate()
        return
      }
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
      if (reward > 0) {
        let mx19 = Math.round(reward * 1.9)
        let myReward = Math.round(reward * myArcObj.val)
        mx19Display.innerHTML = mx19
        myRewardDisplay.innerHTML = myReward
      }
      resetStyles()
    }

    const validate = () => {
      if (goalInput.value == '') {
        resetStyles()
        goalInput.classList.add('input-invalid')
        goalInput.focus()
        return false
      }
      if (currentInput.value == '') {
        resetStyles()
        currentInput.classList.add('input-invalid')
        currentInput.focus()
        return false
      }
      if (rewardInput.value == '') {
        resetStyles()
        rewardInput.classList.add('input-invalid')
        rewardInput.focus()
        return false
      }
      if (firstPlaceInput.value == '') {
        resetStyles()
        firstPlaceInput.classList.add('input-invalid')
        firstPlaceInput.focus()
        return false
      }
      resetStyles()
      return true
    }

    const resetStyles = () => {
      allInputs.forEach(el => {
        el.classList.remove('input-valid')
        el.classList.remove('input-invalid')
      })
    }

    const clear = () => {
      resetStyles()
      goalInput.value = ''
      currentInput.value = ''
      rewardInput.value = ''
      firstPlaceInput.value = ''
      mx19Display.innerHTML = ''
      myRewardDisplay.innerHTML = ''
      leftDisplay.innerHTML = ''
      halfLeftDisplay.innerHTML = ''
      toLockDisplay.innerHTML = ''
      profitDisplay.innerHTML = ''
      resultDisplay.classList.add('hide')
      goalInput.focus()
    }

    const focusGoalInput = () => {
      if (goalInput.value == '') {
        goalInput.focus()
      }
      return
    }

    //! add event listeners
    quickSnipeFs.addEventListener('keyup', update)
    quickSnipeFs.addEventListener('click', focusGoalInput)
    calcBtn.addEventListener('click', calculate)
    clearBtn.addEventListener('click', clear)
    // console.log(`quickSnipe_module instantiated`)
  }
}
// console.log(`quickSnipe_module loaded`)
