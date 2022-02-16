import moment from "moment-timezone"

namespace Order {
  export let pool = 0

  export let history: number[] = []

  export let roundId: string = '0'

  export let odds = {
    odd: 1.05,
    even: 1.05,
    large: 1.05,
    small: 1.05,
    match: 2.5
  }

  let date = { month: 1, day: 1 }

  export function setPool(val: number, direction: boolean) {
    if (direction) {
      pool = pool += val
    } else {
      pool = pool -= val
    }
  }

  export function setPoolClear() {
    pool = 0
  }

  export function setHistory(val: number) {
    history.push(val)
  }

  export function setHistoryClear() {
    history = []
  }

  export function setRoundId() {
    const _month = moment.tz('Asia/Taipei').month() + 1
    const _day = moment.tz('Asia/Taipei').date()

    if (date.month !== _month && date.day !== _day) {
      date.month = _month
      date.day = _day
      roundId = `${moment.tz('Asia/Taipei').format('YYYYMMDD')}_1`
      return
    } else {
      roundId = `${moment.tz('Asia/Taipei').format('YYYYMMDD')}_${Number(roundId) + 1}`
      return
    }
  }
}

export default Order