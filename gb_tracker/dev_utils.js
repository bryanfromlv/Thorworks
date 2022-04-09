import gb from './gb.js'
import { store } from './main.js'
export default class {
  constructor() {
    this.gb1 = ['Alcatraz', 10, 851, 95, 50, 15, 5, 0] //actual
    this.gb2 = ['Château Frontenac', 30, 1395, 340, 170, 55, 15, 5] //actual
    this.gb3 = ['Cathedral of Aachen', 77, 3217, 755, 380, 125, 30, 5] //actual
    this.gb4 = ['Innovation Tower', 5, 460, 55, 30, 10, 5, 0] //actual
    this.gb5 = ['The Arc', 92, 7531, 1645, 825, 275, 70, 15] //actual
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
    const gb5 = new gb(...this.gb5)
    store.saveGb(gb1.key, gb1)
    store.saveGb(gb2.key, gb2)
    store.saveGb(gb3.key, gb3)
    store.saveGb(gb4.key, gb4)
    store.saveGb(gb5.key, gb5)
    console.log(`5 gb's created and saved to localStorage`)
  }
}
console.log(`dev_utils loaded`)
