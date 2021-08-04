import { MessageBuilder } from 'discord-webhook-node'
import { bulkSendMessage } from '../discord/webhook'
import puppeteer from 'puppeteer'
import { isHeadless } from '../puppeteer'
import { CrawlerReturnObject, filterDuplicate } from './helper'
import { brandLogo } from './constants'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import { blob } from '../api'
import FormData from 'form-data'
import fs from 'fs'

interface CrawlerInput {
  queryBrand: string,
  limit: number,
  webhookUrl: string,
  crawlerName: string,
  locale: string
}

let previousUsList: CrawlerReturnObject[] = []
let previousFrList: CrawlerReturnObject[] = []
let previousEnList: CrawlerReturnObject[] = []

const vh = 812
const vw = 375

export default async function crawler({ queryBrand, limit, webhookUrl, crawlerName, locale }: CrawlerInput): Promise<{ status: boolean, identifier: string, message: string }> {
  const browser = await puppeteer.launch({
    headless: isHeadless,
    args: [
      `--window-size=${vw},${vh}`,
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })

  try {
    const [page] = await browser.pages()

    await page.setViewport({
      width: vw,
      height: vh,
    })

    const query = queryBrand
    const baseUrl = locale !== '' ?
      `https://www.asos.com/${locale}/search/?currentpricerange=10-230&q=${query}&sort=freshness&refine=attribute_1047:8606` :
      `https://www.asos.com/search/?currentpricerange=10-230&q=${query}&sort=freshness&refine=attribute_1047:8606`

    await page.goto(baseUrl, { waitUntil: 'networkidle0' })

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight)
    })

    // await page.waitForTimeout(3000)

    let list = await page.evaluate(() => {
      function pageLogic(element: Element) {
        const a = element.querySelector('a')
        const url = `${a?.getAttribute('href')}`
        const title = `${a?.children[1].children[0].children[0].children[0].textContent}`
        let price = `${a?.children[2].children[0].children[0].textContent}`
        if (price?.toString() === 'RRP') {
          price = `${a?.children[2].children[1].children[0].textContent}`
        }

        // const img = `${element.querySelector('img[data-auto-id="productTileImage"]')?.getAttribute('src')}`
        return {
          title,
          url,
          price,
          img: ''
        }
      }

      const map = Array.from(
        document.querySelectorAll('article[data-auto-id=productTile]'),
        pageLogic
      )
      return map
    })
    list = list.slice(0, limit)

    const [btn] = await page.$x('//button[@icon="_1cZV-7Z"]')
    if (btn) {
      await btn.click()
    }

    // get and extract images
    for (let i = 0; i < list.length; i++) {
      const url = list[i].url
      const _imageName = uuidv4()
      const imageExt = '.jpg'
      const imageName = _imageName.replaceAll('-', '')
      const extractPath = `public/${imageName}${imageExt}`

      await page.goto(url)
      await page.screenshot({ path: `public/${_imageName}${imageExt}` })
      const extracted = await sharp(`public/${_imageName}${imageExt}`).extract({
        width: vw,
        height: parseInt((vh * 0.6).toString()),
        left: 0,
        top: 50
      })
      await extracted.toFile(extractPath)
      const form = new FormData()
      form.append('blobs', fs.createReadStream(extractPath))
      const config = {
        headers: {
          ...form.getHeaders()
        }
      }
      // const response = await blob.post('/upload?uuid=snkr_crawler', form, config)
      // const { data: { data } } = response
      // const { blobData } = data
      // const blobUrl = blobData[0].accessUrl
      // list[i].img = blobUrl
      list[i].img = `${process.env.SELF_URL}/${imageName}${imageExt}`
    }

    if (crawlerName.includes('en_US')) {
      const _list = filterDuplicate(list, previousUsList)
      previousUsList = [...list]
      list = _list
    } else if (crawlerName.includes('fr')) {
      const _list = filterDuplicate(list, previousFrList)
      previousFrList = [...list]
      list = _list
    } else if (crawlerName.includes('en_EN')) {
      const _list = filterDuplicate(list, previousEnList)
      previousEnList = [...list]
      list = _list
    }

    console.log(list)

    const messageList: MessageBuilder[] = []

    list.forEach((item: any, index: number) => {
      const { url, price, title, img } = item
      const embed = new MessageBuilder()
        .setTitle(title)
        .setAuthor(`ASOS [Search: ${queryBrand}]`, brandLogo.asos, baseUrl)
        // @ts-ignore
        .setURL(url)
        .addField('價格', price, true)
        .setFooter(`最新 ${index + 1}/${limit} 筆`)
        .setImage(img)
        .setTimestamp()
      messageList.push(embed)
    })

    await bulkSendMessage(messageList, webhookUrl)

    return { status: true, identifier: `asos-${crawlerName}`, message: 'success' }
  } catch (e) {
    console.log('ERROR:', e.message)
    return { status: false, identifier: `asos-${crawlerName}`, message: e.message }
  } finally {
    await browser.close()
  }
}
