// console.log("storage.js loaded");
// confirm browser allows local storage
function storageAvailable(type) {
  let storage
  try {
    storage = window[type]
    let x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    )
  }
}

//! localStorage functions
// bug fix for server deploy- scan localStorage only for valid keys
// compare with gbNameRef declared in index.js
// server adds unknown keys to localStorage so old method didn't work
getAllGbKeys = () => {
  let gbKeys = []
  for (let i = 0; i < localStorage.length; i++) {
    gbNameRef.forEach((gb) => {
      if (localStorage.key(i).includes(gb.name)) {
        gbKeys.push(localStorage.key(i))
      }
    })
  }
  return gbKeys
}

// save a gb object as JSON and set curGb
saveGb = (key, gb) => {
  // console.log(`storage- saveGb(${key})`)
  // console.log(JSON.stringify(gb));
  localStorage.setItem(key, JSON.stringify(gb))
  saveCurGb(key)
}

saveCurGb = (key) => {
  // console.log(`storage- saveCurGb(${key})`)
  localStorage.setItem('curGb', key)
}

setTooltipsFlag = (bool) => {
  localStorage.setItem('tooltip', bool)
}

getTooltipsFlag = () => {
  return localStorage.getItem('tooltip')
}

setAudioFlag = (bool) => {
  localStorage.setItem('audio', bool)
}

getAudioFlag = () => {
  return localStorage.getItem('audio')
}

savePostName = (name) => {
  localStorage.setItem('postName', name)
}

getPostName = () => {
  return localStorage.getItem('postName')
}

getCurGbKey = () => {
  // console.log(`getCurGbKey(): ${localStorage.getItem('curGb')}`)
  return localStorage.getItem('curGb')
}

getSavedCurGb = () => {
  let savedCurBg = localStorage.getItem('curGb')
  // console.log(`storage- getSavedCurGb(${savedCurBg})`)
  if (savedCurBg == 'none') {
    return false
  } else {
    return savedCurBg // this is the key for the last saved GB
  }
}

getSavedGb = (key) => {
  if (key === undefined) {
    console.log('no GB found, key: ' + key)
    return false
  }
  // console.log(`storage- getSavedGb(${key})`)
  return JSON.parse(localStorage.getItem(key))
}

deleteCurGbKey = () => {
  // console.log('deleteCurGbKey()')
  localStorage.removeItem('curGb')
}

deleteGb = (key) => {
  // console.log(`deleteGb(${key})`)
  localStorage.removeItem(key)
}

deleteGbKey = () => {
  localStorage.removeItem('curGb')
}

checkStorageEmpty = () => {
  let noGbs = true
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) !== 'curGb') {
      noGbs = false
    }
  }
  return noGbs
}
