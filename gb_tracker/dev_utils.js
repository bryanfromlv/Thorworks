import gb from './gb.js'
import { store } from './main.js'
export default class {
  constructor() {
    this.gb1 = ['Alcatraz', 10, 851, 95, 50, 15, 5, 0]
    this.gb2 = ['Château Frontenac', 30, 1395, 340, 170, 55, 15, 5]
    this.gb3 = ['The Blue Galaxy', 40, 2495, 665, 335, 110, 30, 5]
    this.gb4 = ['Seed Vault', 50, 3055, 830, 415, 140, 35, 5]
    console.log(`dev_utils instantiated`)
  }
  buildGbs = () => {
    if (store.getAllGbKeys().length > 0) {
      console.log(`Error creating test GB's: storage is not empty`)
      return
    }
    const gb1 = new gb(...this.gb1)
    const gb2 = new gb(...this.gb2)
    const gb3 = new gb(...this.gb3)
    const gb4 = new gb(...this.gb4)
    store.saveGb(gb1.key, gb1)
    store.saveGb(gb2.key, gb2)
    store.saveGb(gb3.key, gb3)
    store.saveGb(gb4.key, gb4)
    console.log(`4 gb's created and saved to localStorage`)
  }
}
console.log(`dev_utils loaded`)
