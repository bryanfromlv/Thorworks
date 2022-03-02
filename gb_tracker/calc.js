import { store, navBar, gb_list, showNewGb } from './main.js'
class result {
  constructor(p) {
    this.p = p
    this.mxFlag = false //true for 1.92
    this.needed = 0
    this.ready = false
    this.locked = false
  }
}
export default class calc {
  constructor() {
    this._initialized = false
    this._myGb = {}
    this._myGbKey = ''
    this._pArray = []
    this._calcForm = document.querySelector('#calc_form')
    this._nameField = document.querySelector('#calc_gbName')
    this._goalField = document.querySelector('#calc_goal')
    this._curField = document.querySelector('#calc_cur')
    this._leftField = document.querySelector('#calc_left')
    this._ownerField = document.querySelector('#calc_owner_input')
    this._otherField = document.querySelector('#calc_other_input')
    this._curInputs = document.querySelectorAll('.cur-input')
    this._19Fields = document.querySelectorAll('.mx19btn')
    this._192Fields = document.querySelectorAll('.mx192btn')
    this._tooltipCB = document.querySelector('#calc_enable_tooltips')
    this._tooltipsEnabled
    this._audioCB = document.querySelector('#calc_enable_audio')
    this._audioEnabled
    this._postBtn = document.querySelector('.calc-post-btn')
    this._newUserField = document.querySelector('#postText_username')
    this._userName = store.getPostName()
    this._postTextArray = []
    this._postTextField = document.querySelector('#postText_modal_body')
    this._mxChoices = []
    this._snipeSoundFlag = true
    this._otherSoundFlag = true
    this._otherAlertSound = document.querySelector('#otherSnd')
    this._otherAlertField = document.querySelector('#other_alert')
    this._snipeSound = document.querySelector('#snipeSnd')
    this._snipeField = document.querySelector('#snipe_zone')
    this._posFields = document.querySelectorAll('.position')
    // array of tooltip instances
    this._pTooltips = []
    // grab the mxGroups- these will be arrays of radio button elements
    this._mxrbGroups = [
      document.getElementsByName('p1'),
      document.getElementsByName('p2'),
      document.getElementsByName('p3'),
      document.getElementsByName('p4'),
      document.getElementsByName('p5'),
    ]
    //! common modal background
    this.modalBkg = document.querySelector('#modal_bkg')

    this.init()
    // console.log(`calc instantiated`)
  }

  init = () => {
    //! prepare tippy tooltips
    tippy.setDefaultProps({
      theme: 'bryan',
      delay: [500, 20],
      duration: [500, 250],
      allowHTML: true,
      maxWidth: 200,
      touch: 'hold',
      animation: 'fade',
    })
    this._pTooltips.push(
      tippy('#p1n', {
        content: ``,
      })
    )
    this._pTooltips.push(
      tippy('#p2n', {
        content: '',
      })
    )
    this._pTooltips.push(
      tippy('#p3n', {
        content: '',
      })
    )
    this._pTooltips.push(
      tippy('#p4n', {
        content: '',
      })
    )
    this._pTooltips.push(
      tippy('#p5n', {
        content: '',
      })
    )
    //! enable/disable tooltip instances
    this.toggleTooltips = enable => {
      this._pTooltips.forEach(tooltip => {
        if (enable) {
          tooltip[0].enable()
        } else {
          tooltip[0].disable()
        }
      })
    }
    //! set tooltips checkbox to saved state
    if (store.getTooltipsFlag() == 'true') {
      this._tooltipCB.checked = true
      this._tooltipsEnabled = true
      this.toggleTooltips(true)
    } else {
      this._tooltipCB.checked = false
      this._tooltipsEnabled
      this.toggleTooltips(false)
    }
    //! set audio enabled property and checkbox to saved state
    if (store.getAudioFlag() == 'true') {
      this._audioCB.checked = true
      this._audioEnabled = true
    } else {
      this._audioCB.checked = false
      this._audioEnabled = false
    }
    //! add event listeners to all number inputs
    this._ownerField.addEventListener('change', evt => {
      this.inputChange(evt)
    })
    this._otherField.addEventListener('change', evt => {
      this.inputChange(evt)
    })
    for (let x = 0; x < this._curInputs.length; x++) {
      this._curInputs[x].addEventListener('change', evt => {
        this.inputChange(evt)
      })
    }
    //! add event listeners to 1.9 & 1.92 fields
    const chEvt = new Event('change') //! bug fix- we have to manually trigger change event
    for (let i = 0; i < 5; i++) {
      this._19Fields[i].addEventListener('click', evt => {
        if (this._curInputs[i].value == 0) {
          this._curInputs[i].value = evt.target.innerText
        } else if (this._curInputs[i].value !== evt.target.innerText) {
          this._curInputs[i].value = evt.target.innerText
        } else {
          this._curInputs[i].value = 0
        }
        this._curInputs[i].dispatchEvent(chEvt)
      })
      this._192Fields[i].addEventListener('click', evt => {
        if (this._curInputs[i].value == 0) {
          this._curInputs[i].value = evt.target.innerText
        } else if (this._curInputs[i].value !== evt.target.innerText) {
          this._curInputs[i].value = evt.target.innerText
        } else {
          this._curInputs[i].value = 0
        }
        this._curInputs[i].dispatchEvent(chEvt)
      })
    }
    //! add change event listeners to mx radio buttons (requires looping through groups)
    this._mxrbGroups.forEach(group => {
      for (let x = 0; x < group.length; x++) {
        group[x].addEventListener('change', evt => {
          this.mxrbChange(evt)
        })
      }
    })
    //! add event listener to tooltips checkbox
    this._tooltipCB.addEventListener('change', evt => {
      let checked = evt.target.checked
      this.toggleTooltips(checked)
      // set localStorage flag
      if (checked) {
        store.setTooltipsFlag(true)
      } else {
        store.setTooltipsFlag(false)
      }
    })
    //! add event listener to audio checkbox
    this._audioCB.addEventListener('change', evt => {
      // set audio flags
      if (evt.target.checked) {
        this._audioEnabled = true
        // localStorage method
        store.setAudioFlag(true)
      } else {
        this._audioEnabled = false
        // localStorage method
        store.setAudioFlag(false)
      }
    })
    //! add event listener to post button
    this._postBtn.addEventListener('click', () => {
      if (this._userName) {
        // console.log(`savedName found: ${savedName}`)
        this.doPostTextModal()
      } else {
        // console.log(`First time using Post Text`)
        this.doNewUserModal()
      }
    })
    //! add event listener to post modal new user save button
    document.querySelector('#newUser_save_btn').addEventListener('click', () => {
      // grab the text, save to localStorage, and save to class property
      let userName = this._newUserField.value
      if (userName) {
        // console.log(`userName: ${userName}`)
        store.savePostName(userName) // storage.js function
        this._userName = userName
      } else {
        alert('You must enter a user name or nickname')
      }
      // hide the modal
      this.modalBkg.classList.add('modal-bkg-hide')
      let modalContainer = document.querySelector('#newUser_modal_container')
      modalContainer.classList.remove('postText-modal-container-show')
      modalContainer.classList.add('postText-modal-container-hide')
    })
    //! add event listener to post modal new user input
    //! convert enter key to button click
    this._newUserField.addEventListener('keyup', evt => {
      if (evt.key === 'Enter' || evt.keyCode === 13) {
        evt.preventDefault()
        document.querySelector('#newUser_save_btn').click()
      }
    })
    //! add event listener to post modal new user cancel button
    document.querySelector('#newUser_cancel_btn').addEventListener('click', () => {
      // hide the modal and do nothing
      let modalContainer = document.querySelector('#newUser_modal_container')
      this.modalBkg.classList.add('modal-bkg-hide')
      modalContainer.classList.remove('postText-modal-container-show')
      modalContainer.classList.add('postText-modal-container-hide')
    })
    //! add event listener to 'include fp' checkbox
    document.querySelector('#include_fp').addEventListener('click', () => {
      // all we have to do here is update the post text displayed
      // in the modal body, it will be copied on copy button click
      let newPostText = this.preparePostText()
      // update the modal display text
      this._postTextField.innerText = newPostText
      // show the copy button (hidden in event listener)
      document.querySelector('#postText_copy_btn').style.display = 'block'
    })
    //! add event listener to post modal copy button
    document.querySelector('#postText_copy_btn').addEventListener('click', evt => {
      let textToCopy = this._postTextField.innerText
      // write to clipboard
      navigator.clipboard.writeText(textToCopy).then(
        function () {
          /* clipboard successfully set */
          // hide the copy button
          evt.target.style.display = 'none'
          document.querySelector('#postText_modal_body').innerText = `"${textToCopy}"
          was copied to your clipboard. You may now close this window`
        },
        function (err) {
          /* clipboard write failed */
          // hide the copy button
          evt.target.style.display = 'none'
          document.querySelector(
            '#postText_modal_body'
          ).innerText = `There was an error copying the text to your clipboard: ${err}`
        }
      )
    })
    //! add event listener to post modal close button
    document.querySelector('#postText_close_btn').addEventListener('click', () => {
      // hide the modal and do nothing
      let modalContainer = document.querySelector('#postText_modal_container')
      this.modalBkg.classList.add('modal-bkg-hide')
      modalContainer.classList.remove('postText-modal-container-show')
      modalContainer.classList.add('postText-modal-container-hide')
    })
    //! add event listener to post modal change name button
    document.querySelector('#postText_changeName_btn').addEventListener('click', () => {
      // hide the post modal
      let modalContainer = document.querySelector('#postText_modal_container')
      this.modalBkg.classList.add('modal-bkg-hide')
      modalContainer.classList.remove('postText-modal-container-show')
      modalContainer.classList.add('postText-modal-container-hide')
      this.doNewUserModal()
    })
    //! current GB check
    let curGbKey = store.getCurGbKey()
    // console.log(`current GB check: ${curGbKey}`)
    if (curGbKey) {
      // found a curGbKey
      this._myGbKey = curGbKey
      this.calculate(curGbKey)
    } else {
      //put up no gb modal
      this.doNoGbModal()
    }
    // console.log(`calc initalized`)
  } //! end init()

  //! set curGbKey in localStorage and load the GB object from localStorage
  setGb = gbKey => {
    // console.log(`setGb(${gbKey})`)
    store.saveCurGb(gbKey)
    this._myGbKey = gbKey
    this._myGb = store.getSavedGb(gbKey)
    // console.log(this._myGb)
  }

  //! noGb modal
  doNoGbModal = () => {
    //console.log(`doNoGbModal()`)
    // show the modal
    this.modalBkg.classList.remove('modal-bkg-hide')
    let modalContainer = document.querySelector('#nogb_modal_container')
    modalContainer.classList.remove('modal-container-hide')
    modalContainer.classList.add('modal-container-show')
    // add event listeners to modal buttons
    let closeButton = document.querySelector('#noGbClose_btn')
    closeButton.addEventListener('click', () => {
      // remove the modal
      this.modalBkg.classList.add('modal-bkg-hide')
      modalContainer.classList.remove('modal-container-show')
      modalContainer.classList.add('modal-container-hide')
    })
    let newgbBtn = document.querySelector('#noGbNew_btn')
    newgbBtn.addEventListener('click', () => {
      // console.log('newgbBtn clicked, launch newGb form')
      showNewGb()
      navBar.activateNewGb()
      // remove the modal
      this.modalBkg.classList.add('modal-bkg-hide')
      modalContainer.classList.remove('modal-container-show')
      modalContainer.classList.add('modal-container-hide')
    })
  }

  //! post text new user modal
  doNewUserModal = () => {
    // console.log(`doNewUserModal`)
    // show the modal
    let modalContainer = document.querySelector('#newUser_modal_container')
    this.modalBkg.classList.remove('modal-bkg-hide')
    modalContainer.classList.remove('postText-modal-container-hide')
    modalContainer.classList.add('postText-modal-container-show')
    // focus the text input and clear it
    this._newUserField.focus()
    this._newUserField.value = ''
  }
  //! post text modal
  doPostTextModal = () => {
    // show the copy button (hidden in event listener)
    document.querySelector('#postText_copy_btn').style.display = 'block'
    // prepare the final text to be displayed and copied in the modal
    let postText = this.preparePostText()
    // console.log(`initial postText: ${postText}`)
    // update the modal display text
    this._postTextField.innerText = postText
    // show the modal
    let modalContainer = document.querySelector('#postText_modal_container')
    this.modalBkg.classList.remove('modal-bkg-hide')
    modalContainer.classList.remove('modal-container-hide')
    modalContainer.classList.add('modal-container-show')
  }
  //! prepare post text
  preparePostText = () => {
    // console.log(`preparePostText()`)
    // first lets grab the nickname for this gb
    let postGbName = this._myGb.name
    let gbNickname = ''
    // gbNameRef is defined in storage.js
    store.gbNameRef.forEach(nameObject => {
      if (postGbName === nameObject.name) {
        gbNickname = nameObject.nickname
        return
      }
    })
    let finalPostText = ''
    let isChecked = document.querySelector('#include_fp').checked
    let positionText = ''
    if (isChecked) {
      // add 'P' to position and fp amount in parentheses
      this._postTextArray.forEach(obj => {
        positionText += `P${obj.p}(${obj.amnt}) `
      })
      finalPostText = `${this._userName} ${gbNickname} ${positionText}`
    } else {
      // just use position, no 'P', no amount
      this._postTextArray.forEach(obj => {
        positionText += `${obj.p} `
      })
      finalPostText = `${this._userName} ${gbNickname} ${positionText}`
    }
    // console.log(`finalPostText: ${finalPostText}`)
    return finalPostText
  }

  //! handle mx radio button change events
  mxrbChange = evt => {
    switch (evt.target.name) {
      case 'p1':
        this._myGb.p1.mxChoice = evt.target.value
        break
      case 'p2':
        this._myGb.p2.mxChoice = evt.target.value
        break
      case 'p3':
        this._myGb.p3.mxChoice = evt.target.value
        break
      case 'p4':
        this._myGb.p4.mxChoice = evt.target.value
        break
      case 'p5':
        this._myGb.p5.mxChoice = evt.target.value
        break
      default:
        console.log(`mx selector error: ${evt.target.name}`)
        break
    }
    // console.log(this._myGb)
    this.calculate()
  }
  //! set gb object values to changed value on input element change
  inputChange = evt => {
    // console.log(`${evt.target.id} changed`)
    //! enable audio only after user has interacted with the page
    this._snipeSoundFlag = false
    this._otherSoundFlag = false
    // convert target values to Number type
    switch (evt.target.id) {
      case 'calc_owner_input':
        this._myGb.owner = Number(evt.target.value)
        break
      case 'calc_other_input':
        this._myGb.other = Number(evt.target.value)
        break
      case 'p1_cur':
        this._myGb.p1.current = Number(evt.target.value)
        break
      case 'p2_cur':
        this._myGb.p2.current = Number(evt.target.value)
        break
      case 'p3_cur':
        this._myGb.p3.current = Number(evt.target.value)
        break
      case 'p4_cur':
        this._myGb.p4.current = Number(evt.target.value)
        break
      case 'p5_cur':
        this._myGb.p5.current = Number(evt.target.value)
        break
      default:
        console.log(`inputChange error- no target identified (${evt.target.id})`)
        break
    }
    this.calculate()
  }

  /* this is called on input type=number change event as well as
   from init(), gbList calc method, gbList delete method, and new gb.
   call without gbKey to avoid multiple setGb calls
   call with gbKey to load gb object
   all this does is update the gb object, updateForm() will handle the display */
  //! main calculations
  calculate = gbKey => {
    // console.log(`calculate(${gbKey})`)
    if (gbKey) {
      this.setGb(gbKey)
    }
    //! track 1.9/1.92 choices from radio button selectors
    this._mxChoices = [
      this._myGb.p1.mxChoice,
      this._myGb.p2.mxChoice,
      this._myGb.p3.mxChoice,
      this._myGb.p4.mxChoice,
      this._myGb.p5.mxChoice,
    ]
    // console.table(this._mxChoices)
    //! build array of position objects from current GB object
    this._pArray = [this._myGb.p1, this._myGb.p2, this._myGb.p3, this._myGb.p4, this._myGb.p5]
    //! calculate current and left, update current GB object
    let pTotal = 0
    this._pArray.forEach(p => {
      pTotal += Number(p.current)
    })
    let current = Number(this._myGb.owner) + Number(this._myGb.other) + pTotal
    let left = Number(this._myGb.goal) - current
    this._myGb.current = current
    this._myGb.left = left
    // variables needed for further calculation
    let resultsArray = []
    let other = Number(this._myGb.other)
    let p1mxFlag
    let p2mxFlag
    let p3mxFlag
    let p4mxFlag
    let p1Filled = false
    let p2Filled = false
    let p3Filled = false
    let p4Filled = false
    let mx
    // tooltip variables
    let after
    let ttmx
    let total
    let halfLeft = Math.ceil(left / 2)
    // hide the post text button
    this._postBtn.classList.add('hide-post-btn')
    // initialize the postText array on each run
    this._postTextArray = []
    //! calculate needed, ready, locked, etc for all 5 positions
    for (let x = 0; x < this._pArray.length; x++) {
      let allPrevLocked = false
      let allPrevReady = false
      //! set flag for all previous positions locked & ready (skip P1)
      if (x > 0) {
        for (let i = 0; i < resultsArray.length; i++) {
          if (resultsArray[i].locked) {
            allPrevLocked = true
          } else {
            allPrevLocked = false
          }
          if (resultsArray[i].ready) {
            allPrevReady = true
          } else {
            allPrevReady = false
          }
        }
      }
      //! we need to process each position differently
      switch (resultsArray.length) {
        case 0:
          // position 1
          // create a result object for position 1
          let p1Result = new result(1)
          // set result object mxFlag
          p1Result.mxFlag = this._mxChoices[0] === 'mx192'
          // console.log(`p1Result.mxFlag: ${p1Result.mxFlag}`)
          //! calculate p1 needed
          let p1Needed
          if (p1Result.mxFlag) {
            // 1.92
            after = left - this._pArray[0].mx192
            p1Needed = left - this._pArray[0].mx192 * 2
          } else {
            // 1.9
            after = left - this._pArray[0].mx19
            p1Needed = left - this._pArray[0].mx19 * 2
          }
          if (p1Needed < 0) {
            p1Needed = 0
          }
          p1Result.needed = p1Needed
          //! calculate p1 ready
          if (p1Needed == 0) {
            p1Result.ready = true
          } else {
            p1Result.ready = false
          }
          //! calculate p1 locked
          if (left <= this._pArray[0].current) {
            p1Result.locked = true
          } else {
            p1Result.locked = false
          }
          //! calculate tooltip content
          if (!p1Result.locked && !p1Result.ready) {
            if (after < 0) {
              after = 0
            }
            if (p1Result.mxFlag) {
              ttmx = '1.92'
            } else {
              ttmx = '1.9'
            }
            total = p1Needed + this._myGb.owner
            this.setTooltipContent(1, after, ttmx, total, halfLeft)
          } else if (p1Result.ready && !p1Result.locked) {
            this._pTooltips[x][0].setContent(`P1 is ready<br>Left/2 = ${halfLeft}`)
          } else {
            this._pTooltips[x][0].setContent(`P1 is locked<br>Left/2 = ${halfLeft}`)
          }
          //! check for snipe zone (skip other check for P1 & P2)
          this.checkSnipeZone(1, left, p1Result.locked)
          //! we still need to clear other alert for P1 & P2 (bug fix)
          this.setOtherAlert(false)
          //! prepare post text if p.ready && !p.locked
          if (p1Result.ready && !p1Result.locked) {
            // show the Post button
            this._postBtn.classList.remove('hide-post-btn')
            let amount = ''
            if (p1Result.mxFlag) {
              amount = this._pArray[0].mx192
            } else {
              amount = this._pArray[0].mx19
            }
            this._postTextArray.push({ p: '1', amnt: amount })
          }
          //! push completed result object to results array
          resultsArray.push(p1Result)
          break
        case 1:
          // position 2
          // create a result object for position 2
          let p2Result = new result(2)
          // set result object mxFlag
          p2Result.mxFlag = this._mxChoices[1] === 'mx192'
          //! calculate p2 needed
          let p2Needed
          let p2Left
          // first we check if previous position has been filled and locked
          // if not we run simulation
          if (this._pArray[0].current > 0 && this._pArray[0].locked) {
            p1Filled = true
            // process just like first position
            if (p2Result.mxFlag) {
              // 1.92
              after = left - this._pArray[1].mx192
              p2Needed = left - this._pArray[1].mx192
            } else {
              // 1.9
              after = left - this._pArray[1].mx19
              p2Needed = left - this._pArray[1].mx19
            }
          } else {
            // simulate previous position(s) filled
            p1mxFlag = resultsArray[0].mxFlag
            if (p2Result.mxFlag) {
              // 1.92
              if (p1mxFlag) {
                p2Left = left - this._pArray[0].mx192 - resultsArray[0].needed
              } else {
                p2Left = left - this._pArray[0].mx19 - resultsArray[0].needed
              }
              p2Needed = p2Left - this._pArray[1].mx192 * 2
            } else {
              // 1.9
              if (p1mxFlag) {
                p2Left = left - this._pArray[0].mx192 - resultsArray[0].needed
              } else {
                p2Left = left - this._pArray[0].mx19 - resultsArray[0].needed
              }
              p2Needed = p2Left - this._pArray[1].mx19 * 2
            }
          }
          // this means that filling p1 makes p2 ready
          if (p2Needed < 0 || p2Needed <= this._pArray[1].mx19) {
            // this sets p2 needed to 0 if p1 is locked
            if (this._pArray[0].locked) {
              p2Needed = 0
              // otherwise it should just show p1 needed
            } else {
              p2Needed = this._pArray[0].needed
            }
          }
          // so if filling p1 does not make p2 ready, we just leave it alone
          p2Result.needed = p2Needed
          //! calculate p2 ready
          mx = this._pArray[1].mx19
          if (p2Result.mxFlag) {
            mx = this._pArray[1].mx192
          }
          if (p2Needed <= 0 && resultsArray[0].needed == 0) {
            p2Result.ready = true
          } else {
            p2Result.ready = false
          }
          //! calculate p2 locked
          if (left <= this._pArray[1].current) {
            p2Result.locked = true
          } else {
            p2Result.locked = false
          }
          //! calculate tooltip content
          if (!p2Result.locked && !p2Result.ready) {
            if (after < 0) {
              after = 0
            }
            if (p2Result.mxFlag) {
              ttmx = '1.92'
            } else {
              ttmx = '1.9'
            }
            total = p2Needed + this._myGb.owner
            this.setTooltipContent(2, after, ttmx, total, halfLeft)
          } else if (p2Result.ready && !p2Result.locked) {
            this._pTooltips[x][0].setContent(`P2 is ready<br>Left/2 = ${halfLeft}`)
          } else {
            this._pTooltips[x][0].setContent(`P2 is locked<br>Left/2 = ${halfLeft}`)
          }
          //! check for snipe zone only if all previous positions are locked
          //! (skip other check for P1 & P2)
          //! we still need to clear other alert for P1 & P2 (bug fix)
          this.setOtherAlert(false)
          if (allPrevLocked) {
            this.checkSnipeZone(2, left, p2Result.locked)
          }
          //! prepare post text if p.ready && !p.locked
          if (p2Result.ready && !p2Result.locked) {
            // show the Post button
            this._postBtn.classList.remove('hide-post-btn')
            let amount = ''
            if (p2Result.mxFlag) {
              amount = this._pArray[1].mx192
            } else {
              amount = this._pArray[1].mx19
            }
            this._postTextArray.push({ p: '2', amnt: amount })
          }
          //! push completed result object to results array
          resultsArray.push(p2Result)
          break
        case 2:
          // position 3
          // create a result object for position 3
          let p3Result = new result(3)
          // set result object mxFlag
          p3Result.mxFlag = this._mxChoices[2] === 'mx192'
          //! calculate p3 needed
          let p3Needed
          let p3Left
          /* first we check if previous positions have been filled
             if not we run simulation
             it gets more complicated here because we have to check multiple
             previous positions so we'll use flags */
          if (this._pArray[0].current > 0) {
            p1Filled = true
          }
          if (this._pArray[1].current > 0) {
            p2Filled = true
          }
          p1mxFlag = resultsArray[0].mxFlag
          p2mxFlag = resultsArray[1].mxFlag
          // check p1
          if (p1Filled) {
            p3Left = left
          } else {
            // simulate p1 mx filled
            if (p1mxFlag) {
              // 1.92
              p3Left = left - this._pArray[0].mx192
            } else {
              // 1.9
              p3Left = left - this._pArray[0].mx19
            }
          }
          // check p2
          if (p2Filled) {
            p3Left = left
          } else {
            // simulate p2 mx filled
            if (p2mxFlag) {
              // 1.92
              p3Left -= this._pArray[1].mx192
            } else {
              // 1.9
              p3Left -= this._pArray[1].mx19
            }
          }
          //! calculate p3Needed
          if (p3Result.mxFlag) {
            // 1.92
            after = left - this._pArray[2].mx192
            p3Needed = p3Left - this._pArray[2].mx192 * 2
          } else {
            // 1.9
            after = left - this._pArray[2].mx19
            p3Needed = p3Left - this._pArray[2].mx19 * 2
          }
          if (p3Needed < 0) {
            // this sets p3 needed to 0 if p2 is locked
            if (this._pArray[1].locked) {
              p3Needed = 0
              // otherwise it should just show p2 needed
            } else {
              p3Needed = this._pArray[1].needed
            }
          }
          // so if filling p1 does not make p2 ready, we just leave it alone
          p3Result.needed = p3Needed
          //! calculate p3 ready
          mx = this._pArray[2].mx19
          if (p3Result.mxFlag) {
            mx = this._pArray[2].mx192
          }
          if (p3Needed <= 0 && resultsArray[1].needed == 0) {
            p3Result.ready = true
          } else {
            p3Result.ready = false
          }
          //! calculate p3 locked
          if (left <= this._pArray[2].current) {
            p3Result.locked = true
          } else {
            p3Result.locked = false
          }
          //! calculate tooltip content
          if (!p3Result.locked && !p3Result.ready) {
            if (after < 0) {
              after = 0
            }
            if (p3Result.mxFlag) {
              ttmx = '1.92'
            } else {
              ttmx = '1.9'
            }
            total = p3Needed + this._myGb.owner
            this.setTooltipContent(3, after, ttmx, total, halfLeft)
          } else if (p3Result.ready && !p3Result.locked) {
            this._pTooltips[x][0].setContent(`P3 is ready<br>Left/2 = ${halfLeft}`)
          } else {
            this._pTooltips[x][0].setContent(`P3 is locked<br>Left/2 = ${halfLeft}`)
          }
          //! check for snipe zone & other only if all previous positions are locked
          if (allPrevLocked) {
            this.checkSnipeZone(3, left, p3Result.locked)
            if (other > 0 && p3Result.ready && !p3Result.locked) {
              this.checkOther(3, this._pArray[2].mx19, left, other)
            } else {
              this.setOtherAlert(false)
            }
          }
          //! prepare post text if p.ready && !p.locked
          if (p3Result.ready && !p3Result.locked) {
            // show the Post button
            this._postBtn.classList.remove('hide-post-btn')
            let amount = ''
            if (p3Result.mxFlag) {
              amount = this._pArray[2].mx192
            } else {
              amount = this._pArray[2].mx19
            }
            this._postTextArray.push({ p: '3', amnt: amount })
          }
          //! push completed result object to results array
          resultsArray.push(p3Result)
          break
        case 3:
          // position 4
          // create a result object for position 4
          let p4Result = new result(4)
          // set result object mxFlag
          p4Result.mxFlag = this._mxChoices[3] === 'mx192'
          // calculate p4 needed
          let p4Needed
          let p4Left
          /* first we check if previous positions have been filled
             if not we run simulation
             it gets more complicated here because we have to check multiple previous positions
             so we'll use flags */
          if (this._pArray[0].current > 0) {
            p1Filled = true
          }
          if (this._pArray[1].current > 0) {
            p2Filled = true
          }
          if (this._pArray[2].current > 0) {
            p3Filled = true
          }
          p1mxFlag = resultsArray[0].mxFlag
          p2mxFlag = resultsArray[1].mxFlag
          p3mxFlag = resultsArray[2].mxFlag
          // check p1
          if (p1Filled) {
            p4Left = left
          } else {
            // simulate p1 mx filled
            if (p1mxFlag) {
              // 1.92
              p4Left = left - this._pArray[0].mx192
            } else {
              // 1.9
              p4Left = left - this._pArray[0].mx19
            }
          }
          // check p2
          if (p2Filled) {
            p4Left = left
          } else {
            // simulate p2 mx filled
            if (p2mxFlag) {
              // 1.92
              p4Left -= this._pArray[1].mx192
            } else {
              // 1.9
              p4Left -= this._pArray[1].mx19
            }
          }
          // check p3
          if (p3Filled) {
            p4Left = left
          } else {
            // simulate p3 mx filled
            if (p3mxFlag) {
              // 1.92
              p4Left -= this._pArray[2].mx192
            } else {
              // 1.9
              p4Left -= this._pArray[2].mx19
            }
          }
          //! calculate p4Needed
          if (p4Result.mxFlag) {
            // 1.92
            after = left - this._pArray[3].mx192
            p4Needed = p4Left - this._pArray[3].mx192 * 2
          } else {
            // 1.9
            after = left - this._pArray[3].mx19
            p4Needed = p4Left - this._pArray[3].mx19 * 2
          }
          if (p4Needed < 0) {
            p4Needed = 0
          }
          p4Result.needed = p4Needed
          //! calculate p4 ready
          mx = this._pArray[3].mx19
          if (p4Result.mxFlag) {
            mx = this._pArray[3].mx192
          }
          if (p4Needed <= 0 && resultsArray[2].needed == 0) {
            p4Result.ready = true
          } else {
            p4Result.ready = false
          }
          //! calculate p4 locked
          if (left <= this._pArray[3].current) {
            p4Result.locked = true
          } else {
            p4Result.locked = false
          }
          //! calculate tooltip content
          if (!p4Result.locked && !p4Result.ready) {
            if (after < 0) {
              after = 0
            }
            if (p4Result.mxFlag) {
              ttmx = '1.92'
            } else {
              ttmx = '1.9'
            }
            total = p4Needed + this._myGb.owner
            this.setTooltipContent(4, after, ttmx, total, halfLeft)
          } else if (p4Result.ready && !p4Result.locked) {
            this._pTooltips[x][0].setContent(`P4 is ready<br>Left/2 = ${halfLeft}`)
          } else {
            this._pTooltips[x][0].setContent(`P4 is locked<br>Left/2 = ${halfLeft}`)
          }
          //! check for snipe zone & other only if all previous positions are locked
          if (allPrevLocked) {
            this.checkSnipeZone(4, left, p4Result.locked)
            if (other > 0 && p4Result.ready && !p4Result.locked) {
              this.checkOther(4, this._pArray[3].mx19, left, other)
            } else {
              this.setOtherAlert(false)
            }
          }
          //! prepare post text if p.ready && !p.locked
          if (p4Result.ready && !p4Result.locked) {
            // show the Post button
            this._postBtn.classList.remove('hide-post-btn')
            let amount = ''
            if (p4Result.mxFlag) {
              amount = this._pArray[3].mx192
            } else {
              amount = this._pArray[3].mx19
            }
            this._postTextArray.push({ p: '4', amnt: amount })
          }
          //! push completed result object to results array
          resultsArray.push(p4Result)
          break
        case 4:
          // position 5
          // create a result object for position 5
          let p5Result = new result(5)
          // set result object mxFlag
          p5Result.mxFlag = this._mxChoices[4] === 'mx192'
          // calculate p5 needed
          let p5Needed
          let p5Left
          /* first we check if previous positions have been filled
             if not we run simulation
             it gets more complicated here because we have to check multiple previous positions
             so we'll use flags */
          if (this._pArray[0].current > 0) {
            p1Filled = true
          }
          if (this._pArray[1].current > 0) {
            p2Filled = true
          }
          if (this._pArray[2].current > 0) {
            p3Filled = true
          }
          if (this._pArray[3].current > 0) {
            p4Filled = true
          }
          p1mxFlag = resultsArray[0].mxFlag
          p2mxFlag = resultsArray[1].mxFlag
          p3mxFlag = resultsArray[2].mxFlag
          p4mxFlag = resultsArray[3].mxFlag
          // check p1
          if (p1Filled) {
            p5Left = left
          } else {
            // simulate p1 mx filled
            if (p1mxFlag) {
              // 1.92
              p5Left = left - this._pArray[0].mx192
            } else {
              // 1.9
              p5Left = left - this._pArray[0].mx19
            }
          }
          // check p2
          if (p2Filled) {
            p5Left = left
          } else {
            // simulate p2 mx filled
            if (p2mxFlag) {
              // 1.92
              p5Left -= this._pArray[1].mx192
            } else {
              // 1.9
              p5Left -= this._pArray[1].mx19
            }
          }
          // check p3
          if (p3Filled) {
            p5Left = left
          } else {
            // simulate p3 mx filled
            if (p3mxFlag) {
              // 1.92
              p5Left -= this._pArray[2].mx192
            } else {
              // 1.9
              p5Left -= this._pArray[2].mx19
            }
          }
          // check p4
          if (p4Filled) {
            p5Left = left
          } else {
            // simulate p4 mx filled
            if (p4mxFlag) {
              // 1.92
              p5Left -= this._pArray[3].mx192
            } else {
              // 1.9
              p5Left -= this._pArray[3].mx19
            }
          }
          //! calculate p5Needed
          if (p5Result.mxFlag) {
            // 1.92
            after = left - this._pArray[4].mx192
            p5Needed = p5Left - this._pArray[4].mx192 * 2
          } else {
            // 1.9
            after = left - this._pArray[4].mx19
            p5Needed = p5Left - this._pArray[4].mx19 * 2
          }
          if (p5Needed < 0) {
            p5Needed = 0
          }
          // bug fix added 2/17/22
          if (this._pArray[4].mx19 <= 0) {
            p5Needed = resultsArray[3].needed
          }
          p5Result.needed = p5Needed
          //! calculate p5 ready
          mx = this._pArray[4].mx19
          if (p5Result.mxFlag) {
            mx = this._pArray[4].mx192
          }
          if (p5Needed <= 0 && resultsArray[3].needed == 0) {
            p5Result.ready = true
          } else {
            p5Result.ready = false
          }
          //! calculate p5 locked
          // bug fix added 2/17/22
          if (left <= this._pArray[4].current || this._pArray[4].mx19 <= 0) {
            p5Result.locked = true
          } else {
            p5Result.locked = false
          }
          //! calculate tooltip content
          if (!p5Result.locked && !p5Result.ready) {
            if (after < 0) {
              after = 0
            }
            if (p5Result.mxFlag) {
              ttmx = '1.92'
            } else {
              ttmx = '1.9'
            }
            total = p5Needed + this._myGb.owner
            this.setTooltipContent(5, after, ttmx, total, halfLeft)
          } else if (p5Result.ready && !p5Result.locked) {
            this._pTooltips[x][0].setContent(`P5 is ready<br>Left/2 = ${halfLeft}`)
          } else {
            this._pTooltips[x][0].setContent(`P5 is locked<br>Left/2 = ${halfLeft}`)
          }
          //! check for snipe zone & other only if all previous positions are locked
          if (allPrevLocked) {
            this.checkSnipeZone(5, left, p5Result.locked)
            if (other > 0 && p5Result.ready && !p5Result.locked) {
              this.checkOther(5, this._pArray[4].mx19, left, other)
            } else {
              this.setOtherAlert(false)
            }
          }
          //! prepare post text if p.ready && !p.locked
          if (p5Result.ready && !p5Result.locked) {
            // show the Post button
            this._postBtn.classList.remove('hide-post-btn')
            let amount = ''
            if (p5Result.mxFlag) {
              amount = this._pArray[4].mx192
            } else {
              amount = this._pArray[4].mx19
            }
            this._postTextArray.push({ p: '5', amnt: amount })
          }
          //! push completed result object to results array
          resultsArray.push(p5Result)
          break
        default:
          console.log(`processing error- resultsArray.length(${resultsArray.length}) failed`)
          break
      }
      // now update the gb object
      this._pArray[x].needed = resultsArray[x].needed
      this._pArray[x].ready = resultsArray[x].ready
      this._pArray[x].locked = resultsArray[x].locked
      //console.table(this._pArray)
    }
    // console.table(resultsArray)
    //! reverse postTextArray
    this._postTextArray.reverse()
    // save the updated gb object to localStorage (also saves key as curGb)
    // console.log('calc is saving updated gb object, updating calc form, and updating display')
    store.saveGb(this._myGbKey, this._myGb)
    // update the form display
    this.updateForm()
    // console.log(this._myGb)
    gb_list.update(this._myGb)
  }
  //! update the calc form
  updateForm = () => {
    // console.log(`updateForm()`)
    this._nameField.innerText = `${this._myGb.name} Level ${this._myGb.level}`
    this._goalField.innerText = `Goal: ${this._myGb.goal}`
    this._curField.innerText = `Current: ${this._myGb.current}`
    this._leftField.innerText = `Left: ${this._myGb.left}`
    this._ownerField.value = this._myGb.owner
    this._otherField.value = this._myGb.other
    this.updatePositions()
  }

  /* This requires some rather convoluted code because
  we're using grid to display the position elements.
  We have to use a complicated and not scalable algorithm
  to select all the next siblings from the target element
  nodeList (class= position in this case) */
  updatePositions = () => {
    const pArray = this._pArray
    const pElements = document.querySelectorAll('.position')
    for (let x = 0; x < pArray.length; x++) {
      // build array of position elements
      let mySiblings = this.getSiblings(pElements[x])
      // assign position values from array of GB objects
      mySiblings[0].innerText = pArray[x].reward
      mySiblings[1].checked = this._mxChoices[x] === 'mx19'
      mySiblings[2].innerText = pArray[x].mx19
      mySiblings[3].checked = this._mxChoices[x] === 'mx192'
      mySiblings[4].innerText = pArray[x].mx192
      mySiblings[6].firstChild.value = pArray[x].current
      mySiblings[7].innerText = pArray[x].needed
      // update ready
      if (pArray[x].ready) {
        //add green check here
        this.addCheck(mySiblings[8])
      } else {
        //add red x here
        this.addX(mySiblings[8])
      }
      // update locked
      if (pArray[x].locked) {
        //add green check here
        this.addCheck(mySiblings[9])
      } else {
        //add red x here
        this.addX(mySiblings[9])
      }
    }
  }
  //! builds and returns array of position elements
  getSiblings = el => {
    let siblings = []
    let sibling = el.nextElementSibling
    siblings.push(sibling)
    for (let x = 0; x < 9; x++) {
      sibling = sibling.nextElementSibling
      siblings.push(sibling)
    }
    return siblings
  }
  //! tooltip content builder
  setTooltipContent = (pos, after, mx, total, halfLeft) => {
    let myContent = `P${pos}<br>Left after ${mx}: ${after}<br>Total Owner: ${total}<br>Left/2 = ${halfLeft}`
    let myPos = pos - 1
    this._pTooltips[myPos][0].setContent(myContent)
  }
  //! other alert calculation/implementation
  checkOther = (p, mx, left, other) => {
    let halfLeft = Math.ceil(left / 2)
    let hisNeeded = mx - other
    // console.log(`hisNeeded: ${hisNeeded}`)
    // console.log(`halfLeft: ${halfLeft}`)
    // handle P5 differently- basically alert if any amount is on other
    if (p == 5 && other > 0) {
      // console.log(`P5`)
      // console.log(`Intruder: P${p}`)
      this.setOtherAlert(true)
      return true
    }
    if (hisNeeded >= 0 && hisNeeded <= halfLeft) {
      // console.log(`Intruder: P${p}`)
      this.setOtherAlert(true)
      return true
    } else {
      this.setOtherAlert(false)
      return false
    }
  }
  //! snipe zone calculation/implementation
  checkSnipeZone = (pos, left, locked) => {
    // console.log(`checkSnipeZone(${pos}, ${left}, ${locked})`)
    let snipeTest = Math.ceil(left / 2)
    let snipeZone =
      snipeTest < this._pArray[pos - 1].mx19 && snipeTest > this._pArray[pos - 1].current
    if (snipeZone && !locked) {
      // console.log(`P${pos} Snipezone alert!`)
      this.showSnipeZone(pos)
      if (!this._snipeSoundFlag && this._audioEnabled) {
        this.playSnipeZone()
      }
      return true
    } else {
      // console.log(`p${pos} safe`)
      this.hideSnipeZone(pos)
      return false
    }
  }
  //! show/hide other alert display & handle intruder sound
  setOtherAlert = show => {
    if (show) {
      this._otherAlertField.classList.remove('hide-otheralert-txt')
      if (!this._otherSoundFlag && this._audioEnabled) {
        this._otherAlertSound.play()
      }
    } else {
      this._otherAlertField.classList.add('hide-otheralert-txt')
    }
    gb_list.setOtherAlert(this._myGb, show)
  }
  //! show snipe zone display
  showSnipeZone = pos => {
    // console.log(`showSnipeZone(${pos})`)
    let thisPos = this._posFields[pos - 1]
    // console.log(thisPos)
    this._snipeField.classList.remove('hide-snipezone-txt')
    thisPos.classList.add('position-red')
    let flashCount = 0
    let snipeInterval = setInterval(() => {
      if (flashCount < 7) {
        if (this._snipeField.classList.contains('hide-snipezone-txt')) {
          this._snipeField.classList.remove('hide-snipezone-txt')
          flashCount++
        } else {
          this._snipeField.classList.add('hide-snipezone-txt')
          flashCount++
        }
        if (thisPos.classList.contains('hide-position')) {
          thisPos.classList.remove('hide-position')
        } else {
          thisPos.classList.add('hide-position')
        }
      } else {
        clearInterval(snipeInterval)
        this._snipeField.classList.remove('hide-snipezone-txt')
        thisPos.classList.remove('hide-position')
      }
    }, 100)
    gb_list.setSnipeZone(this._myGb, true, pos)
  }
  //! hide snipe zone display and highlighted position
  hideSnipeZone = pos => {
    // console.log(`hideSnipeZone`)
    this._snipeField.classList.add('hide-snipezone-txt')
    for (let x = 0; x < this._posFields.length; x++) {
      this._posFields[x].classList.remove('position-red')
    }
    //! hide same in display card
    gb_list.setSnipeZone(this._myGb, false, pos)
  }
  //! play snipe zone alert sound
  playSnipeZone = () => {
    // console.log(`playSnipeZone() snipeSoundFlag = ${this._snipeSoundFlag}`)
    this._snipeSound.play()
  }
  //! add check symbol to div parameter
  addCheck = div => {
    if (div.innerText == '✘' || div.innerText == '') {
      div.innerText = '✔'
    }
    div.classList.remove('calc-x-mark')
    div.classList.add('calc-check-mark')
  }
  //! add X symbol to div parameter
  addX = div => {
    if (div.innerText == '✔' || div.innerText == '') {
      div.innerText = '✘'
    }
    div.classList.remove('calc-check-mark')
    div.classList.add('calc-x-mark')
  }
}
// console.log(`calc.js loaded`)
