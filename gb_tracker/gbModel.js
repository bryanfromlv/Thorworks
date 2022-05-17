export default class gbModel {
  constructor(gb) {
    this._gb = gb
    // this._positions = [this._gb.p1, this._gb.p2, this._gb.p3, this._gb.p4, this._gb.p5]
    this._positions = []
    this._mxValues = []
    this._currentValues = []
    // populate the positions array
    for (const prop in this._gb) {
      if (prop.length == 2 && prop.substring(0, 1) == 'p') {
        this._positions.push(this._gb[prop])
      }
    }

    let pCounter = 0
    this._positions.forEach(p => {
      // populate the mx values array
      if (p.mxChoice == 'mx192') {
        this._mxValues.push(p.mx192)
      } else {
        this._mxValues.push(p.mx19)
      }
      // populate the current values array
      this._currentValues.push(p.current)
      //todo: branch out here and calculate needed for each position
      //todo: then branch out and calculate ready, locked, snipezone, intruder??
      //! NO: we just want values needed in calculations- do the rest in class methods.
      this.calculateNeeded(pCounter)
      pCounter++
    })
  }

  // not used so far, may replace with a general recalculate method
  init = () => {
    console.log(`gbModel.init()`)
  }

  calculateNeeded = position => {
    console.log(`calculateNeeded(${position})`)
  }
}
// console.log(`gbModel loaded`)
