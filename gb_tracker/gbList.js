import { store, calculator, showCalculator, setCalculatorNav } from './main.js'
// const store = new storage()
export default class gbList {
  constructor(listSection) {
    this._listSection = listSection
    this._gbList = []
    this._gbToDelete = ''
    this.build()
    console.log(`gbList instantiated`)
  }

  clearDisplay = () => {
    let allCards = document.querySelectorAll('.display-card')
    allCards.forEach((card) => {
      card.remove()
    })
  }

  addGb = (gb) => {
    //! bug fix- clear the display first to avoid duplicate cards
    this.clearDisplay()
    if (this._gbList.length == 0) {
      // first gb, remove "noGbs display"
      let noGbsDiv = document.querySelector('#display-noGbs')
      if (noGbsDiv) {
        noGbsDiv.remove()
      }
    }
    this._gbList.push(gb)
    //! we need to do a full build here so cards will be sorted after a gb is added
    this.build()
  }

  removeCard = (gbKey) => {
    // console.log(`removeCard(${gbKey})`)
    let foundCard = this.findCard(gbKey)
    // console.log(`foundCard = ${foundCard.id}`)
    if (foundCard) {
      foundCard.remove()
    } else {
      console.log(`removeCard error: foundCard = ${foundCard}`)
    }
  }

  update = (gb) => {
    // console.log('update()')
    // console.log(gb)
    //! find the card for this gb
    let foundCard = this.findCard(gb.key)
    if (!foundCard) {
      console.log('card not found')
    }
    //! set gb current and left values (goal will never change)
    let statsLine = foundCard.querySelector('.card-stats-row')
    statsLine.childNodes[1].innerHTML = `<b>Current: </b>${gb.current}`
    statsLine.childNodes[2].innerHTML = `<b>Left: </b>${gb.left}`

    //! set position columns
    let pArray = [gb.p1, gb.p2, gb.p3, gb.p4, gb.p5]
    let curCols = foundCard.querySelector('#curCol').children
    let needCols = foundCard.querySelector('#needCol').children
    let readyCols = foundCard.querySelector('#readyCol').children
    let lockedCols = foundCard.querySelector('#lockedCol').children
    // skip header, add X or check according to gb position properties
    for (let x = 1; x < 6; x++) {
      curCols[x].innerText = pArray[x - 1].current
      needCols[x].innerText = pArray[x - 1].needed
      //! ready column
      if (pArray[x - 1].ready) {
        this.addCheck(readyCols[x])
      } else {
        this.addX(readyCols[x])
      }
      //! locked column
      if (pArray[x - 1].locked) {
        this.addCheck(lockedCols[x])
      } else {
        this.addX(lockedCols[x])
      }
    }
    //! set owner & other
    let leftSection = foundCard.querySelector('.card-left-section')
    leftSection.childNodes[0].innerHTML = `<b>Owner: </b>${gb.owner}`
    leftSection.childNodes[1].innerHTML = `<b>Other: </b>${gb.other}`
  }

  setOtherAlert = (calcGb, otherWarn) => {
    //! find the card for this gb
    let foundCard = this.findCard(calcGb.key)
    if (!foundCard) {
      return false
    }
    // console.log(`setOtherAlert(${calcGb}, ${otherWarn})`)
    let otherTxt = foundCard.querySelector('.otheralert-txt')
    if (otherWarn) {
      //! show other alert text
      otherTxt.classList.remove('hide-otheralert-txt')
    } else {
      //! hide other alert text
      otherTxt.classList.add('hide-otheralert-txt')
    }
  }

  setSnipeZone = (calcGb, snipeWarn, pos) => {
    //! find the card for this gb
    let foundCard = this.findCard(calcGb.key)
    if (!foundCard) {
      return false
    }
    // console.log(`setSnipeZone(${foundCard.id}, ${snipeWarn}, ${pos})`)
    let szt = foundCard.querySelector('.snipezone-txt')
    let posColumn = foundCard.querySelector('.p-col').children
    if (snipeWarn) {
      //! show snipe zone text
      szt.classList.remove('hide-snipezone-txt')
      //! highlight the position (red)
      for (let x = 1; x < posColumn.length; x++) {
        if (x === pos) {
          posColumn[x].classList.add('snipezone-pos-active')
        } else {
          posColumn[x].classList.remove('snipezone-pos-active')
        }
      }
    } else {
      //! hide snipe zone text
      szt.classList.add('hide-snipezone-txt')
      //! remove position highlight
      for (let i = 1; i < posColumn.length; i++) {
        posColumn[i].classList.remove('snipezone-pos-active')
      }
    }
  }

  findCard = (gbKey) => {
    // console.log(`findCard(${gbKey})`)
    let cards = document.querySelectorAll('.display-card')
    // console.log(cards)
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      if (card.id === gbKey) {
        return card
      }
    }
    return false
  }

  build = () => {
    // console.log(`build()`)
    this.getStoredGbs()
    if (this._gbList.length >= 1) {
      this.buildDisplay()
    }
  }

  getStoredGbs = () => {
    /* this is also called from delete method so
    clear the list first to handle deleted gb's */
    this._gbList = []
    let noGbsDiv = document.querySelector('#display-noGbs')
    let storedKeys = store.getAllGbKeys()
    if (storedKeys.length > 0) {
      if (noGbsDiv) {
        noGbsDiv.remove()
      }
      //! sort without 'The '
      // console.log(`storedKeys: ${storedKeys}`)
      const sorter = (a, b) => {
        // strip 'The ' from both parameters
        if (a.startsWith('The ')) {
          // console.log(`stripping "The" from ${a}`)
          a = a.slice(4)
          // console.log(a)
        }
        if (b.startsWith('The ')) {
          // console.log(`stripping "The" from ${b}`)
          b = b.slice(4)
          // console.log(b)
        }
        if (a < b) {
          return -1
        }
        if (a > b) {
          return 1
        }
        return 0
      }
      storedKeys.sort(sorter)
      // console.log(`sorted: ${storedKeys}`)
      //! add the sorted keys to gbList
      storedKeys.forEach((key) => {
        this._gbList.push(store.getSavedGb(key))
      })
    } else {
      let noGbs = document.createElement('div')
      noGbs.innerText = "You have no saved GB's"
      noGbs.id = 'display-noGbs'
      this._listSection.append(noGbs)
    }
  }

  sortKeys = (a, b) => {
    if (a < b) {
      return -1
    }
    if (a > b) {
      return 1
    }
    return 0
  }

  buildDisplay() {
    this._gbList.forEach((gb) => {
      this.buildCard(gb)
    })
  }

  buildCard = (gb) => {
    // console.log('buildCard called')
    // console.log(gb)
    //! First we build and attach the card
    let card = document.createElement('div')
    card.classList.add('display-card')
    card.id = gb.key
    this._listSection.append(card)

    //! then we build all our card elements
    // top row
    let topRow = document.createElement('div')
    topRow.classList.add('card-top-row')
    // name row
    let name = document.createElement('div')
    name.classList.add('card-name-row')
    let nameTxt = document.createElement('span')
    nameTxt.classList.add('card-gb-name')
    nameTxt.innerText = `${gb.name} level ${gb.level}`
    name.append(nameTxt)
    // stats row
    let statsLine = document.createElement('div')
    statsLine.classList.add('card-stats-row')
    let goal = document.createElement('span')
    goal.innerHTML = `<b>Goal: </b>${gb.goal} `
    let current = document.createElement('span')
    current.innerHTML = `<b>Current: </b>${gb.current} `
    let left = document.createElement('span')
    left.innerHTML = `<b>Left: </b>${gb.left}`
    statsLine.append(goal, current, left)
    topRow.append(name, statsLine)

    //! Begin main display
    // build the container
    let displayContainer = document.createElement('div')
    displayContainer.classList.add('display-container')
    // position heading column
    let pColumn = document.createElement('div')
    pColumn.classList.add('p-col')
    // heading column rows
    let pHeading = document.createElement('div')
    pHeading.innerText = 'Pos'
    pHeading.classList.add('display-stats-heading')
    let p1 = document.createElement('div')
    p1.innerText = 'P1'
    let p2 = document.createElement('div')
    p2.innerText = 'P2'
    let p3 = document.createElement('div')
    p3.innerText = 'P3'
    let p4 = document.createElement('div')
    p4.innerText = 'P4'
    let p5 = document.createElement('div')
    p5.innerText = 'P5'
    // add heading rows to pColumn
    pColumn.append(pHeading, p1, p2, p3, p4, p5)

    // reward column
    let rewardColumn = document.createElement('div')
    // reward column rows
    let rewardHeading = document.createElement('div')
    rewardHeading.innerText = 'Reward'
    rewardHeading.classList.add('display-stats-heading')
    let p1Rew = document.createElement('div')
    p1Rew.innerText = gb.p1.reward
    let p2Rew = document.createElement('div')
    p2Rew.innerText = gb.p2.reward
    let p3Rew = document.createElement('div')
    p3Rew.innerText = gb.p3.reward
    let p4Rew = document.createElement('div')
    p4Rew.innerText = gb.p4.reward
    let p5Rew = document.createElement('div')
    p5Rew.innerText = gb.p5.reward
    // add reward rows to rewardColumn
    rewardColumn.append(rewardHeading, p1Rew, p2Rew, p3Rew, p4Rew, p5Rew)

    // 1.9 column
    let mx19Column = document.createElement('div')
    // 1.9 column rows
    let mx19Heading = document.createElement('div')
    mx19Heading.innerText = '1.9'
    mx19Heading.classList.add('display-stats-heading')
    let p1_19 = document.createElement('div')
    p1_19.innerText = gb.p1.mx19
    let p2_19 = document.createElement('div')
    p2_19.innerText = gb.p2.mx19
    let p3_19 = document.createElement('div')
    p3_19.innerText = gb.p3.mx19
    let p4_19 = document.createElement('div')
    p4_19.innerText = gb.p4.mx19
    let p5_19 = document.createElement('div')
    p5_19.innerText = gb.p5.mx19
    // add 1.9 rows to mx19Column
    mx19Column.append(mx19Heading, p1_19, p2_19, p3_19, p4_19, p5_19)

    // 1.92 column
    let mx192Column = document.createElement('div')
    // 1.92 column rows
    let mx192Heading = document.createElement('div')
    mx192Heading.innerText = '1.92'
    mx192Heading.classList.add('display-stats-heading')
    let p1_192 = document.createElement('div')
    p1_192.innerText = gb.p1.mx192
    let p2_192 = document.createElement('div')
    p2_192.innerText = gb.p2.mx192
    let p3_192 = document.createElement('div')
    p3_192.innerText = gb.p3.mx192
    let p4_192 = document.createElement('div')
    p4_192.innerText = gb.p4.mx192
    let p5_192 = document.createElement('div')
    p5_192.innerText = gb.p5.mx192
    // add 1.92 rows to mx192Column
    mx192Column.append(mx192Heading, p1_192, p2_192, p3_192, p4_192, p5_192)

    // current column
    let curColumn = document.createElement('div')
    curColumn.id = 'curCol'
    // current column rows
    let curHeading = document.createElement('div')
    curHeading.innerText = 'Current'
    curHeading.classList.add('display-stats-heading')
    let p1Cur = document.createElement('div')
    p1Cur.innerText = gb.p1.current
    let p2Cur = document.createElement('div')
    p2Cur.innerText = gb.p2.current
    let p3Cur = document.createElement('div')
    p3Cur.innerText = gb.p3.current
    let p4Cur = document.createElement('div')
    p4Cur.innerText = gb.p4.current
    let p5Cur = document.createElement('div')
    p5Cur.innerText = gb.p5.current
    // add current rows to curColumn
    curColumn.append(curHeading, p1Cur, p2Cur, p3Cur, p4Cur, p5Cur)

    // needed column
    let needCol = document.createElement('div')
    needCol.id = 'needCol'
    // needed column rows
    let neededHeading = document.createElement('div')
    neededHeading.innerText = 'Needed'
    neededHeading.classList.add('display-stats-heading')
    let p1need = document.createElement('div')
    p1need.innerText = gb.p1.needed
    let p2need = document.createElement('div')
    p2need.innerText = gb.p2.needed
    let p3need = document.createElement('div')
    p3need.innerText = gb.p3.needed
    let p4need = document.createElement('div')
    p4need.innerText = gb.p4.needed
    let p5need = document.createElement('div')
    p5need.innerText = gb.p5.needed
    // add need rows to needCol
    needCol.append(neededHeading, p1need, p2need, p3need, p4need, p5need)

    // ready column
    let readyCol = document.createElement('div')
    readyCol.id = 'readyCol'
    // ready column rows
    let readyHeading = document.createElement('div')
    readyHeading.innerText = 'Ready'
    readyHeading.classList.add('display-stats-heading')
    let p1Ready = document.createElement('div')
    if (gb.p1.ready) {
      this.addCheck(p1Ready)
    } else {
      this.addX(p1Ready)
    }
    let p2Ready = document.createElement('div')
    if (gb.p2.ready) {
      this.addCheck(p2Ready)
    } else {
      this.addX(p2Ready)
    }
    let p3Ready = document.createElement('div')
    if (gb.p3.ready) {
      this.addCheck(p3Ready)
    } else {
      this.addX(p3Ready)
    }
    let p4Ready = document.createElement('div')
    if (gb.p4.ready) {
      this.addCheck(p4Ready)
    } else {
      this.addX(p4Ready)
    }
    let p5Ready = document.createElement('div')
    if (gb.p5.ready) {
      this.addCheck(p5Ready)
    } else {
      this.addX(p5Ready)
    }
    // add ready rows to readyCol
    readyCol.append(readyHeading, p1Ready, p2Ready, p3Ready, p4Ready, p5Ready)

    // locked column
    let lockedCol = document.createElement('div')
    lockedCol.id = 'lockedCol'
    // locked column rows
    let lockedHeading = document.createElement('div')
    lockedHeading.innerText = 'Locked'
    lockedHeading.classList.add('display-stats-heading')
    let p1Locked = document.createElement('div')
    if (gb.p1.locked) {
      this.addCheck(p1Locked)
    } else {
      this.addX(p1Locked)
    }
    let p2Locked = document.createElement('div')
    if (gb.p2.locked) {
      this.addCheck(p2Locked)
    } else {
      this.addX(p2Locked)
    }
    let p3Locked = document.createElement('div')
    if (gb.p3.locked) {
      this.addCheck(p3Locked)
    } else {
      this.addX(p3Locked)
    }
    let p4Locked = document.createElement('div')
    if (gb.p4.locked) {
      this.addCheck(p4Locked)
    } else {
      this.addX(p4Locked)
    }
    let p5Locked = document.createElement('div')
    if (gb.p5.locked) {
      this.addCheck(p5Locked)
    } else {
      this.addX(p5Locked)
    }
    // add locked rows to lockedCol
    lockedCol.append(lockedHeading, p1Locked, p2Locked, p3Locked, p4Locked, p5Locked)

    //! add columns to container
    displayContainer.append(
      pColumn,
      rewardColumn,
      mx19Column,
      mx192Column,
      curColumn,
      needCol,
      readyCol,
      lockedCol
    )

    //! build the bottom row
    let bottomRow = document.createElement('div')
    bottomRow.classList.add('card-bottom-row')
    //! build the left section
    let leftSection = document.createElement('div')
    leftSection.classList.add('card-left-section')
    let owner = document.createElement('div')
    owner.innerHTML = `<b>Owner: </b>${gb.owner}`
    let other = document.createElement('div')
    other.innerHTML = `<b>Other: </b>${gb.other}`
    leftSection.append(owner, other)
    //! build the center section
    let centerSection = document.createElement('div')
    centerSection.classList.add('card-center-section')
    let displayOtherZone = document.createElement('div')
    // displayOtherZone.id = 'display_otherZone'
    displayOtherZone.classList.add('otheralert-txt', 'hide-otheralert-txt')
    displayOtherZone.innerText = 'Intruder!'
    let displaySnipeZone = document.createElement('div')
    displaySnipeZone.classList.add('snipezone-txt', 'hide-snipezone-txt')
    displaySnipeZone.innerText = 'Snipe Zone!'
    centerSection.append(displayOtherZone, displaySnipeZone)
    //! build the right section
    let rightSection = document.createElement('div')
    rightSection.classList.add('card-right-section')
    let deleteButton = document.createElement('button')
    let deleteButtonText = document.createTextNode('Delete')
    deleteButton.appendChild(deleteButtonText)
    deleteButton.name = gb.key
    deleteButton.id = gb.key
    deleteButton.classList.add('delete-btn')
    deleteButton.addEventListener('click', (evt) => {
      this.confirmDelete(gb.key)
    })
    let calcButton = document.createElement('button')
    let calcButtonText = document.createTextNode('Calc')
    calcButton.appendChild(calcButtonText)
    calcButton.name = 'calcBtn'
    calcButton.classList.add('calc-btn')
    calcButton.addEventListener('click', () => {
      this.doCalc(`${gb.name}${gb.level}`)
    })
    rightSection.append(calcButton)
    rightSection.append(deleteButton)
    bottomRow.append(leftSection, centerSection, rightSection)
    //! finally we add all our prepared elements to the card
    card.append(topRow, displayContainer, bottomRow)
  }

  // getters
  get gblist() {
    return this._gbList
  }

  //! put up new gb modal
  doNewGbModal = (gb) => {
    console.log('doNewGbModal()')
    // fade in modal background and slide in the modal
    let modalBkg = document.querySelector('#newgb_modal_bkg')
    let confirmModalContainer = document.querySelector('#newGb_modal_container')
    modalBkg.classList.add('modal-show')
    confirmModalContainer.classList.remove('modal-container-hide')
    confirmModalContainer.classList.add('modal-container-show')
  }

  //! put up delete confirmation modal
  confirmDelete = (gbKey) => {
    // console.log(`confirmDelete(${gbKey})`)
    // console.log(this._gbList)
    //! important, we have to store a permanent reference to the gbKey (major bug fix)
    this._gbToDelete = gbKey
    // fade in modal background and slide in the modal
    let modalBkg = document.querySelector('#deleteGb_modal_bkg')
    let confirmDeleteModalContainer = document.querySelector('#deleteGb_modal_container')
    modalBkg.classList.add('modal-show')
    confirmDeleteModalContainer.classList.remove('deleteGb-modal-container-hide')
    confirmDeleteModalContainer.classList.add('deleteGb-modal-container-show')
    // add event listeners to delete & cancel buttons
    let confirmDeleteBtn = document.querySelector('#deleteGb_btn')
    confirmDeleteBtn.addEventListener('click', this.doDelete)
    let cancelBtn = document.querySelector('#deleteGb_cancel_btn')
    cancelBtn.addEventListener('click', this.doCancel)
  }

  //! internal utility methods
  doDelete = (evt) => {
    let gbKey = this._gbToDelete
    // store a reference to curGbKey
    let curKey = store.getCurGbKey()
    // remove the card from display
    this.removeCard(gbKey)
    // next, delete the gb from localStorage
    store.deleteGb(gbKey)
    // getStoredGbs() rebuilds _gbList, checks for 0 stored GB's, and handles noGb's display line
    this.getStoredGbs()
    // if deleted GB was curGb set curGb to first in list, if any
    if (this._gbList.length > 0) {
      let newGbKey
      if (gbKey == curKey) {
        newGbKey = this._gbList[0].key
        store.saveCurGb(newGbKey)
      } else {
        newGbKey = curKey
      }
      // update the calculator after deleting a GB or it just stays as it was
      calculator.calculate(newGbKey)
    } else {
      //! bug fix-  we have to delete the curGb key
      deleteCurGbKey()
    }
    // disable calculator menu item if no gb's (this is an index.js function)
    setCalculatorNav()
    //! remove the event listeners (major bug fix)
    let cancelBtn = document.querySelector('#deleteGb_cancel_btn')
    evt.target.removeEventListener('click', this.doDelete)
    cancelBtn.removeEventListener('click', this.doCancel)
    // clear this._gbToDelete after gb is deleted
    this._gbToDelete = ''
    // hide the modal
    this.hideConfirmDeleteModal()
  }

  doCancel = (evt) => {
    //! remove the event listeners (major bug fix)
    let confirmDeleteBtn = document.querySelector('#deleteGb_btn')
    confirmDeleteBtn.removeEventListener('click', this.doDelete)
    evt.target.removeEventListener('click', this.doCancel)
    // hide the modal
    this.hideConfirmDeleteModal()
  }

  hideConfirmDeleteModal = () => {
    let modalBkg = document.querySelector('#deleteGb_modal_bkg')
    let confirmDeleteModalContainer = document.querySelector('#deleteGb_modal_container')
    modalBkg.classList.remove('modal-show')
    confirmDeleteModalContainer.classList.remove('deleteGb-modal-container-show')
    confirmDeleteModalContainer.classList.add('deleteGb-modal-container-hide')
  }

  doCalc = (gbKey) => {
    // console.log(`doCalc(${gbKey})`)
    calculator.calculate(gbKey)
    setCalculatorNav()
    showCalculator()
  }

  addCheck = (div) => {
    if (div.innerText == '✘' || div.innerText == '') {
      div.innerText = '✔'
    }
    div.classList.remove('x-mark')
    div.classList.add('check-mark')
  }

  addX = (div) => {
    if (div.innerText == '✔' || div.innerText == '') {
      div.innerText = '✘'
    }
    div.classList.remove('check-mark')
    div.classList.add('x-mark')
  }
}
console.log(`gbList.js loaded`)
