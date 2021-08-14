import { MessageBuilder } from 'discord-webhook-node'
import { bulkSendMessage } from '../discord/webhook'
import { CrawlerReturnObject, filterDuplicate, screenshotAndUpdateUrl, waitForTimeout } from './helper'
import { brandLogo } from './constants'
import * as cheerio from 'cheerio'

interface CrawlerInput {
  browser: any,
  queryBrand: string,
  limit: number,
  webhookUrl: string,
  crawlerName: string,
  locale: string
}

let previousUsNike: CrawlerReturnObject[] = []
let previousUsConverse: CrawlerReturnObject[] = []
let previousUsNewBalance: CrawlerReturnObject[] = []
let previousUsVans: CrawlerReturnObject[] = []
let previousUsTheNorthFace: CrawlerReturnObject[] = []

let previousFrNike: CrawlerReturnObject[] = []
let previousFrNewBalance: CrawlerReturnObject[] = []
let previousFrCarhartt: CrawlerReturnObject[] = []
let previousFrConverse: CrawlerReturnObject[] = []

let previousEnNike: CrawlerReturnObject[] = []
let previousEnNewBalance: CrawlerReturnObject[] = []
let previousEnAdidas: CrawlerReturnObject[] = []
let previousEnConverse: CrawlerReturnObject[] = []

const vh = 812
const vw = 375

export default async function crawler({ browser, queryBrand, limit, webhookUrl, crawlerName, locale }: CrawlerInput): Promise<{ status: boolean, identifier: string, message: string }> {
  try {
    const page = await browser.newPage()

    await page.setViewport({
      width: vw,
      height: vh,
    })

    const query = queryBrand
    const baseUrl = locale !== '' ? queryBrand === 'carhartt' ? `https://www.asos.com/${locale}/search/?currentpricerange=10-230&q=${query}&sort=freshness` :
      `https://www.asos.com/${locale}/search/?currentpricerange=10-230&q=${query}&sort=freshness&refine=attribute_1047:8606` :
      `https://www.asos.com/search/?currentpricerange=10-230&q=${query}&sort=freshness&refine=attribute_1047:8606`

    await page.goto(baseUrl)

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight)
    })

    await waitForTimeout(3000)

    const content = await page.content()

    let list: CrawlerReturnObject[] = []

    const $ = cheerio.load(content)
    await $('article[data-auto-id="productTile"]').each((index, element) => {
      if (index < limit) {
        const url = $(element).children('a').attr('href')
        // const title = $(element).children('a').children('div').children('div').children('div').children('p').text()
        const title = $(element).children('a').children('div').children('div').children('div').text()
        const price = $(element).children('a').children('p').children('span').children('span').text()
        const img = $(element).children('a').children('div').children('img').attr('src')

        const response = {
          url: `${url}`,
          title,
          price,
          img: `https:${img}`
        }
        list.push(response)
      }
    })

    // filter dupes
    if (crawlerName === 'en_US-nike') {
      const _list = filterDuplicate(list, previousUsNike)
      previousUsNike = [...list]
      list = _list
    } else if (crawlerName === 'en_US-converse') {
      const _list = filterDuplicate(list, previousUsConverse)
      previousUsConverse = [...list]
      list = _list
    } else if (crawlerName === 'en_US-new-balance') {
      const _list = filterDuplicate(list, previousUsNewBalance)
      previousUsNewBalance = [...list]
      list = _list
    } else if (crawlerName === 'en_US-vans') {
      const _list = filterDuplicate(list, previousUsVans)
      previousUsVans = [...list]
      list = _list
    } else if (crawlerName === 'en_US-the-north-face') {
      const _list = filterDuplicate(list, previousUsTheNorthFace)
      previousUsTheNorthFace = [...list]
      list = _list
    } else if (crawlerName === 'fr-nike') {
      const _list = filterDuplicate(list, previousFrNike)
      previousFrNike = [...list]
      list = _list
    } else if (crawlerName === 'fr-new-balance') {
      const _list = filterDuplicate(list, previousFrNewBalance)
      previousFrNewBalance = [...list]
      list = _list
    } else if (crawlerName === 'fr-carhartt') {
      const _list = filterDuplicate(list, previousFrCarhartt)
      previousFrCarhartt = [...list]
      list = _list
    } else if (crawlerName === 'fr-converse') {
      const _list = filterDuplicate(list, previousFrConverse)
      previousFrConverse = [...list]
      list = _list
    } else if (crawlerName === 'en_EN-nike') {
      const _list = filterDuplicate(list, previousEnNike)
      previousEnNike = [...list]
      list = _list
    } else if (crawlerName === 'en_EN-new-balance') {
      const _list = filterDuplicate(list, previousEnNewBalance)
      previousEnNewBalance = [...list]
      list = _list
    } else if (crawlerName === 'en_EN-converse') {
      const _list = filterDuplicate(list, previousEnConverse)
      previousEnConverse = [...list]
      list = _list
    } else if (crawlerName === 'en_EN-adidas') {
      const _list = filterDuplicate(list, previousEnAdidas)
      previousEnAdidas = [...list]
      list = _list
    }

    if (list.length > 0) {
      await screenshotAndUpdateUrl(page, list)
      console.log(list)
      await page.close()
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
    } else {
      console.log(`asos-${crawlerName}: No New Drops`)
    }

    return { status: true, identifier: `asos-${crawlerName}`, message: 'success' }
  } catch (e) {
    console.log('ERROR:', e.message)
    return { status: false, identifier: `asos-${crawlerName}`, message: e.message }
  }
}
