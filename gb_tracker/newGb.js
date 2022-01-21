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

let gbKey = ''
let savedKeys = []

const newGbForm = document.querySelector('#new_gb_form')
const listDisplay = document.querySelector('#list_section')

function initNewGb() {
  savedKeys = store.getAllGbKeys()
  //! Major problem solved! preventDefault() here blocks submit event
  //! but only after validation (which requires the submit event)
  newGbForm.addEventListener('submit', evt => {
    evt.preventDefault()
    //console.log('submit event detected')
  })

  // handle the save button just as a button click, activate submit action manually to reset the form
  let saveBtn = document.querySelector('#saveButton')
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
    console.log('doDuplicateModal')
    // insert duplicate gb name/level
    let dupNameSpan = document.querySelector('#duplicate_gb_name')
    let name = key.slice(0, -2)
    let level = key.slice(-2)
    dupNameSpan.innerText = `${name} level ${level}`
    // fade in modal background and slide in the modal
    let modalBkg = document.querySelector('#duplicate_modal_bkg')
    let duplicateModalContainer = document.querySelector('#duplicate_modal_container')
    modalBkg.classList.add('modal-show')
    duplicateModalContainer.classList.remove('modal-container-hide')
    duplicateModalContainer.classList.add('modal-container-show')
  }

  const doNewGbModal = gb => {
    // console.log('doNewGbModal()')
    // insert new gb name/level
    let gbNameSpan = document.querySelector('#newGb_confirm_gbName')
    gbNameSpan.innerText = `${gb.name} level ${gb.level}`
    // fade in modal background and slide in the modal
    let modalBkg = document.querySelector('#newgb_modal_bkg')
    let confirmModalContainer = document.querySelector('#newGb_modal_container')
    modalBkg.classList.add('modal-show')
    confirmModalContainer.classList.remove('modal-container-hide')
    confirmModalContainer.classList.add('modal-container-show')
  }

  //! handle modal buttons
  const closeButton = document.querySelector('#close_btn')
  closeButton.addEventListener('click', () => {
    // we have to reset the form here because we're blocking the submit event
    newGbForm.reset()
    // all this code handles removing the modal (with animations)
    let modalBkg = document.querySelector('#newgb_modal_bkg')
    let confirmModalContainer = document.querySelector('#newGb_modal_container')
    modalBkg.classList.remove('modal-show')
    confirmModalContainer.classList.remove('modal-container-show')
    confirmModalContainer.classList.add('modal-container-hide')
    // now remove the newGb form and show main content
    showGbList()
    navBar.activateGbList()
  })

  const addButton = document.querySelector('#add_btn')
  addButton.addEventListener('click', () => {
    // console.log('add button clicked')
    // we have to reset the form here because we're blocking the submit event
    newGbForm.reset()
    // all this code handles removing the modal (with animations)
    let modalBkg = document.querySelector('#newgb_modal_bkg')
    let confirmModalContainer = document.querySelector('#newGb_modal_container')
    modalBkg.classList.remove('modal-show')
    confirmModalContainer.classList.remove('modal-container-show')
    confirmModalContainer.classList.add('modal-container-hide')
    // enable the calculator menu item if disabled
    checkCalcNav()
    // and this leaves us in the newGb form display so we can add more gb's
  })

  const calcButton = document.querySelector('#calc_btn')
  calcButton.addEventListener('click', () => {
    // console.log('calculator button clicked')
    // tell the calculator to calculate the new gb (curGbKey is already saved at this point)
    calculator.calculate(store.getCurGbKey())
    // we have to reset the form here because we're blocking the submit event
    resetNewGbForm()
    // all this code handles removing the modal (with animations)
    let modalBkg = document.querySelector('#newgb_modal_bkg')
    let confirmModalContainer = document.querySelector('#newGb_modal_container')
    modalBkg.classList.remove('modal-show')
    confirmModalContainer.classList.remove('modal-container-show')
    confirmModalContainer.classList.add('modal-container-hide')
    // now remove the newGb form and show calculator content
    showCalculator()
    // and enable the calculator menu item if disabled
    checkCalcNav()
    // finally set the calculator nav to active
    navBar.activateCalc()
  })

  const replaceButton = document.querySelector('#replace_btn')
  replaceButton.addEventListener('click', () => {
    // console.log('replace button clicked')
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
    // all this code handles removing the modal (with animations)
    let modalBkg = document.querySelector('#duplicate_modal_bkg')
    let duplicateModalContainer = document.querySelector('#duplicate_modal_container')
    modalBkg.classList.remove('modal-show')
    duplicateModalContainer.classList.remove('modal-container-show')
    duplicateModalContainer.classList.add('modal-container-hide')
  })

  const cancelButton = document.querySelector('#cancel_btn')
  cancelButton.addEventListener('click', () => {
    // console.log('cancel button clicked')
    // reset the form
    resetNewGbForm()
    // all this code handles removing the modal (with animations)
    let modalBkg = document.querySelector('#duplicate_modal_bkg')
    let duplicateModalContainer = document.querySelector('#duplicate_modal_container')
    modalBkg.classList.remove('modal-show')
    duplicateModalContainer.classList.remove('modal-container-show')
    duplicateModalContainer.classList.add('modal-container-hide')
  })

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
  console.log('resetNewGbForm()')
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
console.log(`newGb.js loaded`)
