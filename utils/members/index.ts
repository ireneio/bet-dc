export enum BetValue {
  LARGE = 'large',
  SMALL = 'small',
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
  ELEVEN = 11,
  TWELVE = 12,
  ODD = 'odd',
  EVEN = 'even',
  CLEAR = -1
}

export const BET_RANGE = [
  BetValue.LARGE,
  BetValue.SMALL,
  BetValue.ONE,
  BetValue.TWO,
  BetValue.THREE,
  BetValue.FOUR,
  BetValue.FIVE,
  BetValue.SIX,
  BetValue.SEVEN,
  BetValue.EIGHT,
  BetValue.NINE,
  BetValue.TEN,
  BetValue.ELEVEN,
  BetValue.TWELVE,
  BetValue.ODD,
  BetValue.EVEN,
  BetValue.CLEAR,
]

export interface Member {
  userId: string
  name: string
  credit: number
  history: number[]
  current: { amount: number, value: BetValue }
}

export const members: Member[] = []
