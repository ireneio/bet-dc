function getRandomInt(limit: number) {
  return Math.floor(Math.random() * limit)
}

namespace Bet {
  type Mode = 'single' | 'double'

  export let mode: Mode = 'single'

  export function setMode(val: Mode) {
    mode = val
  }

  export function getDieRoll() {
    if (mode === 'double') {
      const _dieOne = getRandomInt(6)
      const _dieTwo = getRandomInt(6)
      return _dieOne + 1 + _dieTwo + 1
    } else {
      const _die = getRandomInt(6)
      return _die + 1
    }
  }
}

export default Bet
