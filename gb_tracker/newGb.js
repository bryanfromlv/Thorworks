import {
  store,
  gb_list,
  navBar,
  calculator,
  showCalculator,
  showGbList,
  checkCalcNav,
} from './main.js'
import gb from './gb.js'
export { initNewGb, resetNewGbForm }

// let savedKeys = [] not needed?
const newGbForm = document.querySelector('#new_gb_form')
const modalBkg = document.querySelector('#modal_bkg')
const confirmModalContainer = document.querySelector('#newGb_modal_container')
const dupModalContainer = document.querySelector('#dupGb_modal_container')
const dupReplaceBtn = document.querySelector('#dupGb-replace_btn')
const dupCancelBtn = document.querySelector('#dupGb-cancel_btn')
const newGbCloseButton = document.querySelector('#newGb_close_btn')
const newGbAddButton = document.querySelector('#newGb_add_btn')
const newGbCalcButton = document.querySelector('#newGb_calc_btn')
const saveBtn = document.querySelector('#saveButton')
const gbNameSpan = document.querySelector('#newGb_confirm_gbName')
const dupNameSpan = document.querySelector('#duplicate_gb_name')

function initNewGb() {
  // savedKeys = store.getAllGbKeys() not needed?
  //! Major problem solved! preventDefault() here blocks submit event
  //! but only after validation (which requires the submit event)
  newGbForm.addEventListener('submit', evt => {
    evt.preventDefault()
    //console.log('submit event detected')
  })

  // handle the save button just as a button click, activate submit action manually to reset the form
  saveBtn.addEventListener('click', evt => {
    if (validate()) {
      // console.log('validity passed, saving new gb')
      //check for duplicate and put up modal
      let name = document.querySelector('#gb_select').value
      let level = document.querySelector('#level_input').value
      let key = `${name}${level}`
      let savedGbKeys = store.getAllGbKeys()
      let duplicate = false
      let duplicateKey
      for (let x = 0; x < savedGbKeys.length; x++) {
        if (savedGbKeys[x] == key) {
          duplicate = true
          duplicateKey = key
        }
      }
      if (duplicate) {
        //do duplicate modal and reset the form (via modal button handlers)
        doDuplicateModal(duplicateKey)
      } else {
        let newGb = buildGb()
        finalSave(newGb)
        doNewGbModal(newGb)
      }
    } else {
      console.log('validity failed')
    }
  })

  const doDuplicateModal = key => {
    // insert duplicate gb name/level
    let name = key.slice(0, -2)
    let level = key.slice(-2)
    dupNameSpan.innerText = `${name} level ${level}`
    // show the modal
    modalBkg.classList.remove('modal-bkg-hide')
    dupModalContainer.classList.remove('modal-container-hide')
    dupModalContainer.classList.add('modal-container-show')
  }

  const doNewGbModal = gb => {
    // insert new gb name/level
    gbNameSpan.innerText = `${gb.name} level ${gb.level}`
    // show the modal
    modalBkg.classList.remove('modal-bkg-hide')
    confirmModalContainer.classList.remove('modal-container-hide')
    confirmModalContainer.classList.add('modal-container-show')
  }

  //! handle modal buttons
  const removeConfirmModal = () => {
    modalBkg.classList.add('modal-bkg-hide')
    confirmModalContainer.classList.remove('modal-container-show')
    confirmModalContainer.classList.add('modal-container-hide')
  }

  newGbCloseButton.addEventListener('click', () => {
    console.log(`close button clicked`)
    // we have to reset the form here because we're blocking the submit event
    newGbForm.reset()
    // remove the modal
    removeConfirmModal()
    // now remove the newGb form and show main content
    showGbList()
    navBar.activateGbList()
  })

  newGbAddButton.addEventListener('click', () => {
    // we have to reset the form here because we're blocking the submit event
    newGbForm.reset()
    // remove the modal
    removeConfirmModal()
    // enable the calculator menu item if disabled
    checkCalcNav()
    // and this leaves us in the newGb form display so we can add more gb's
  })

  newGbCalcButton.addEventListener('click', () => {
    // tell the calculator to calculate the new gb (curGbKey is already saved at this point)
    calculator.calculate(store.getCurGbKey())
    // we have to reset the form here because we're blocking the submit event
    resetNewGbForm()
    // remove the modal
    removeConfirmModal()
    // now remove the newGb form and show calculator content
    showCalculator()
    // and enable the calculator menu item if disabled
    checkCalcNav()
    // finally set the calculator nav to active
    navBar.activateCalc()
  })

  dupReplaceBtn.addEventListener('click', () => {
    // delete the duplicate in storage
    let name = document.querySelector('#gb_select').value
    let level = document.querySelector('#level_input').value
    let deletedKey = `${name}${level}`
    gb_list.doDelete(deletedKey)
    // and save the duplicate
    let newGb = buildGb()
    finalSave(newGb)
    // update calculator display (gbKey stays the same)
    calculator.calculate(deletedKey)
    // reset the form
    resetNewGbForm()
    // remove the modal
    modalBkg.classList.remove('modal-show')
    dupModalContainer.classList.remove('modal-container-show')
    dupModalContainer.classList.add('modal-container-hide')
  })

  dupCancelBtn.addEventListener('click', () => {
    // reset the form
    resetNewGbForm()
    // remove the modal
    modalBkg.classList.remove('modal-show')
    dupModalContainer.classList.remove('modal-container-show')
    dupModalContainer.classList.add('modal-container-hide')
  })

  //! final code block
  const validate = () => {
    // console.log('validate()')
    return newGbForm.reportValidity()
  }

  const buildGb = () => {
    //console.log('saveBtnHandler()')
    // let's do the gb property assignments for now (maybe not here)
    let name = document.querySelector('#gb_select').value
    let level = document.querySelector('#level_input').value
    let goal = Number(document.querySelector('#goal_input').value)
    let p1 = Number(document.querySelector('#p1_input').value)
    let p2 = Number(document.querySelector('#p2_input').value)
    let p3 = Number(document.querySelector('#p3_input').value)
    let p4 = Number(document.querySelector('#p4_input').value)
    let p5 = Number(document.querySelector('#p5_input').value)
    // build the gb object
    let newGb = new gb(name, level, goal, p1, p2, p3, p4, p5)
    return newGb
  }
  //console.log('newGb initialized')
}

// this function needed for access by other code
const resetNewGbForm = () => {
  // console.log('resetNewGbForm()')
  newGbForm.reset()
}

const finalSave = newGb => {
  // console.log(`finalSave(${newGb.key})`)
  // save 'curGb' key
  store.saveCurGb(newGb.key)
  // save the new GB
  store.saveGb(newGb.key, newGb)
  gb_list.addGb(newGb)
  //! bug fix- we have to run calculate here so needed will show up in main display
  calculator.calculate(newGb.key)
  // console.log(`finalSave called, ${newGb.key} saved`)
}
// console.log(`newGb.js loaded`)
