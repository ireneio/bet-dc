import express, { Application, Request, Response } from "express"
import * as path from 'path'
// import cookieParser from 'cookie-parser'
import logger from 'morgan'
// import cors from 'cors'

import indexRouter from './routes/index'

import { runPuppeteer } from '~/utils/cron'

runPuppeteer()

// Init Express
const app: Application = express()

// cors
// const corsOptions = {
//   origin: process.env.NODE_APP_CORS_URL || 'http://localhost:3000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// app.use(cors(corsOptions))

app.use(logger('dev'))
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// console.log(path.join(__dirname, '../public'))

// const ServerRoot = path.resolve(__dirname /** dist */, '..')
// app.use(express.static(path.join(ServerRoot, 'public')))
// console.log(path.join(ServerRoot, 'public'))

// app.use(express.static('public'))

// app.get('/', (req: Request, res: Response) => res.sendFile(path.join(__dirname, 'public') + '/AutryActionShoesWMNSMEDALIST1LOWWHITE.jpg'))

app.use('/', indexRouter)

// 403 all other routes
app.use('*', function (req: Request, res: Response, next: Function): void {
  res.send({ code: 403, message: 'forbidden' })
})

export default app
