import express, { Router, Request, Response } from "express"
const router: Router = express.Router()

// GET server health
router.get('/health', function(req: Request, res: Response, next: Function): void {
  res.send({ code: 200, message: 'success '})
})

export default router
