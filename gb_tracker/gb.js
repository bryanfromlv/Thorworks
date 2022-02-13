//* note: functions cannot be stringified by JSON so we simply can't use them.
export default class gb {
  constructor(name, level, goal, p1, p2, p3, p4, p5) {
    this.name = name
    this.level = level
    this.key = `${this.name}${this.level}`
    this.goal = goal
    this.current = 0
    this.left = goal
    this.owner = 0
    this.other = 0
    // initialize position objects
    this.p1 = {
      reward: p1,
      mx19: Math.round(p1 * 1.9),
      mx192: Math.round(p1 * 1.92),
      mxChoice: 'mx19',
      current: 0,
      ready: false,
      locked: false,
      needed: null,
    }
    this.p2 = {
      reward: p2,
      mx19: Math.round(p2 * 1.9),
      mx192: Math.round(p2 * 1.92),
      mxChoice: 'mx19',
      current: 0,
      ready: false,
      locked: false,
      needed: null,
    }
    this.p3 = {
      reward: p3,
      mx19: Math.round(p3 * 1.9),
      mx192: Math.round(p3 * 1.92),
      mxChoice: 'mx19',
      current: 0,
      ready: false,
      locked: false,
      needed: null,
    }
    this.p4 = {
      reward: p4,
      mx19: Math.round(p4 * 1.9),
      mx192: Math.round(p4 * 1.92),
      mxChoice: 'mx19',
      current: 0,
      ready: false,
      locked: false,
      needed: null,
    }
    this.p5 = {
      reward: p5,
      mx19: Math.round(p5 * 1.9),
      mx192: Math.round(p5 * 1.92),
      mxChoice: 'mx19',
      current: 0,
      ready: false,
      locked: false,
      needed: null,
    }
    // console.log(`${this.key} gb object constructed`)
  }
}
