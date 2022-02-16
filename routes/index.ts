import express, { Router, Request, Response } from "express"
import Bet from "~/utils/bet"
import { BET_RANGE, Member, members } from "~/utils/members"
import { v4 as uuid } from 'uuid'
import Order from "~/utils/order"

const router: Router = express.Router()

router.get('/health', function(req: Request, res: Response, next: Function): void {
  res.send({ code: 200, message: 'success '})
})

router.get('/user', function(req: Request, res: Response, next: Function): void {
  try {
    res.send({ code: 200, message: 'success', data: members })
    return
  } catch (e: unknown) {
    res.send({ code: 500 })
    return
  }
})

router.post('/user/create', function(req: Request, res: Response, next: Function): void {
  try {
    const name = req.body.name
    const _member: Member = {
      userId: uuid(),
      name,
      credit: 0,
      history: [],
      current: { amount: 0, value: -1 }
    }
    members.push(_member)
    res.send({ code: 200, message: 'success', data: _member })
    return
  } catch (e: unknown) {
    res.send({ code: 500 })
    return
  }
})

router.post('/user/update/name', function(req: Request, res: Response, next: Function): void {
  try {
    const userId = req.body.userId
    const name = req.body.name
    const _target = members.find((member) => member.userId === userId)
    if (!_target) {
      res.send({ code: 400 })
      return
    }
    _target.name = name
    res.send({ code: 200, message: 'success', data: _target })
    return
  } catch (e: unknown) {
    res.send({ code: 500 })
    return
  }
})

router.post('/user/update/credit', function(req: Request, res: Response, next: Function): void {
  try {
    const userId = req.body.userId
    const credit = req.body.credit
    const direction = req.body.direction
    const _target = members.find((member) => member.userId === userId)
    if (!_target) {
      res.send({ code: 400 })
      return
    }
    if (direction) {
      _target.credit += credit
    } else {
      _target.credit -= credit
    }
    res.send({ code: 200, message: 'success', data: _target })
    return
  } catch (e: unknown) {
    res.send({ code: 500 })
    return
  }
})

router.get('/order/bet', function(req: Request, res: Response, next: Function): void {
  try {
    const userId = req.body.userId
    const amount = req.body.amount
    const value = req.body.value
    const _isInBetRange = BET_RANGE.find((val) => value === val)
    if (!_isInBetRange) {
      res.send({ code: 400 })
      return
    }
    const _target = members.find(member => member.userId === userId)
    if (!_target) {
      res.send({ code: 400 })
      return
    }
    Order.setPool(amount, true)
    _target.current.amount = amount
    _target.current.value = value
    res.send({
      code: 200,
      message: 'success',
      data: {
        pool: Order.pool,
        roundId: Order.roundId,
        amount,
        userId
      }
    })
  } catch (e: unknown) {
    res.send({ code: 500 })
    return
  }
})

router.get('/game/die', function(req: Request, res: Response, next: Function): void {
  try {
    const _roll = Bet.getDieRoll()
    const _isEven = _roll % 2 === 0
    const _isLarge = Bet.mode === 'single' ? _roll >= 4 : _roll >= 7
    Order.setHistory(_roll)
    members.forEach((member) => {
      const _betValue = member.current.value
      const _betAmount = member.current.amount
      if (_isEven) {
        if (_betValue === 'even') {
          member.credit += _betAmount * Order.odds.even
          Order.setPool(_betAmount * Order.odds.even, false)
        } else {
          member.credit -= _betAmount
        }
      } else if (!_isEven) {
        if (_betValue === 'odd') {
          member.credit += _betAmount * Order.odds.odd
          Order.setPool(_betAmount * Order.odds.odd, false)
        } else {
          member.credit -= _betAmount
        }
      } else if (_isLarge) {
        if (_betValue === 'large') {
          member.credit += _betAmount * Order.odds.large
          Order.setPool(_betAmount * Order.odds.large, false)
        } else {
          member.credit -= _betAmount
        }
      } else if (!_isLarge) {
        if (_betValue === 'small') {
          member.credit += _betAmount * Order.odds.small
          Order.setPool(_betAmount * Order.odds.small, false)
        } else {
          member.credit -= _betAmount
        }
      } else if (typeof _betValue === 'number' && _betValue >= 1 && _betValue <= 12) {
        if (_betValue === _roll) {
          member.credit += _betAmount * Order.odds.match
          Order.setPool(_betAmount * Order.odds.match, false)
        } else {
          member.credit -= _betAmount
        }
      }
    })

    res.send({
      code: 200,
      data: {
        roll: _roll,
        history: Order.history,
        members
      }
    })
    return
  } catch (e: unknown) {
    res.send({ code: 500 })
    return
  }
})

router.post('/game/mode', function(req: Request, res: Response, next: Function): void {
  const mode = req.body.mode
  if (mode !== 'single' || mode !== 'double') {
    res.send({ code: 400 })
    return
  }
  Bet.setMode(mode)
  res.send({ code: 200, data: Bet.mode })
  return
})

router.post('/game/clear', function(req: Request, res: Response, next: Function): void {
  Order.setHistoryClear()
  Order.setPoolClear()
  res.send({ code: 200, data: { history: Order.history, pool: Order.pool } })
  return
})

export default router
