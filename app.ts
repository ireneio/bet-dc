import express, { Application, Request, Response } from 'express'
import * as path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
// import cors from 'cors'

import indexRouter from './routes/index'

import { removeImage } from '~/utils/cron'
// import { removeDiskImages } from "./utils/system"
import Order from './utils/order'

console.log('[env] SELF_URL', process.env.SELF_URL)
console.log()

// Init Express
const app: Application = express()

// cors
// const corsOptions = {
//   origin: process.env.NODE_APP_CORS_URL || 'http://localhost:3000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// app.use(cors(corsOptions))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/', indexRouter)

// 403 all other routes
app.use('*', function (req: Request, res: Response, next: Function): void {
  res.send({ code: 403, message: 'forbidden' })
})

Promise.all([
  removeImage()
])

/* business logic start */

// init round id by date
Order.setRoundId()

/* business logic end */

export default app
