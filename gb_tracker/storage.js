export default class storage {
  constructor() {
    this.gbNameRef = [
      { name: 'Alcatraz', nickname: 'Traz', sort: 'Alcatraz' },
      { name: 'The Arc', nickname: 'Arc', sort: 'Arc' },
      { name: 'Arctic Orangery', nickname: 'AO', sort: 'Arctic' },
      { name: 'Atlantis Museum', nickname: 'AM', sort: 'Atlantis' },
      { name: 'Atomium', nickname: 'Atomium', sort: 'Atomium' },
      { name: 'The Blue Galaxy', nickname: 'BG', sort: 'Blue' },
      { name: 'Cape Canaveral', nickname: 'Cape', sort: 'Cape' },
      { name: 'Capitol', nickname: 'Capitol', sort: 'Capitol' },
      { name: 'Castel del Monte', nickname: 'CdM', sort: 'Castel' },
      { name: 'Cathedral of Aachen', nickname: 'CoA', sort: 'Cathedral' },
      { name: 'Château Frontenac', nickname: 'Château', sort: 'Château' },
      { name: 'Colosseum', nickname: 'Colosseum', sort: 'Colosseum' },
      { name: 'Deal Castle', nickname: 'DC', sort: 'Deal' },
      { name: 'Dynamic Tower', nickname: 'DT', sort: 'Dynamic' },
      { name: 'Frauenkirche of Dresden', nickname: 'FoD', sort: 'Frauenkirche' },
      { name: 'Flying Island', nickname: 'FI', sort: 'Flying' },
      { name: 'Gaea Statue', nickname: 'Gaea', sort: 'Gaea' },
      { name: 'Galata Tower', nickname: 'GT', sort: 'Galata' },
      { name: 'The Habitat', nickname: 'Habitat', sort: 'Habitat' },
      { name: 'Hagia Sophia', nickname: 'HS', sort: 'Hagia' },
      { name: 'Himeji Castle', nickname: 'HC', sort: 'Himeji' },
      { name: 'Innovation Tower', nickname: 'IT', sort: 'Innovation' },
      { name: 'The Kraken', nickname: 'Kraken', sort: 'Kraken' },
      { name: 'Lighthouse of Alexandria', nickname: 'LoA', sort: 'Lighthouse' },
      { name: 'Lotus Temple', nickname: 'LT', sort: 'Lotus' },
      { name: 'Notre Dame', nickname: 'ND', sort: 'Notre' },
      { name: 'Observatory', nickname: 'OBS', sort: 'Observatory' },
      { name: 'Oracle of Delphi', nickname: 'Oracle', sort: 'Oracle' },
      { name: 'Rain Forest Project', nickname: 'RFP', sort: 'Rain' },
      { name: 'Royal Albert Hall', nickname: 'RAH', sort: 'Royal' },
      { name: "Saint Basil's Cathedral", nickname: 'SBC', sort: 'Saint' },
      { name: 'Seed Vault', nickname: 'SV', sort: 'Seed' },
      { name: 'Space Needle', nickname: 'SN', sort: 'Space' },
      { name: "St. Mark's Basilica", nickname: 'SMB', sort: 'St' },
      { name: 'Star Gazer', nickname: 'SG', sort: 'Star' },
      { name: 'Statue of Zeus', nickname: 'Zeus', sort: 'Statue' },
      { name: 'Temple of Relics', nickname: 'ToR', sort: 'Temple' },
      { name: 'Terracotta Army', nickname: 'TA', sort: 'Terracotta' },
      { name: 'Tower of Babel', nickname: 'ToB', sort: 'Tower' },
      { name: 'The Virgo Project', nickname: 'Virgo', sort: 'Virgo' },
      { name: 'Voyager V1', nickname: 'Voyager', sort: 'Voyager' },
    ]
    console.log(`storage instantiated`)
  }

  // confirm browser allows local storage
  storageAvailable = (type) => {
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
      this.gbNameRef.forEach((gb) => {
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
    this.saveCurGb(key)
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
}
console.log(`storage.js loaded`)
