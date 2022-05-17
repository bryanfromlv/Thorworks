export default class gbModel {
  constructor(gb) {
    this._gb = gb
    this._positions = [this._gb.p1, this._gb.p2, this._gb.p3, this._gb.p4, this._gb.p5]
    this._mx192Array = []
    this._positions.forEach(p => {
      this._mx192Array.push(p.mxChoice === 'mx192')
    })
    // for (const p in this._positions) {
    //   console.log(p)
    //   this._mx192Array.push(p.mxChoice === 'mx192')
    // }
  }

  init = () => {
    console.log(`gbModel.init()`)
  }
}
// console.log(`gbModel loaded`)
