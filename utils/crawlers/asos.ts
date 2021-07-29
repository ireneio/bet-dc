import { MessageBuilder } from 'discord-webhook-node'
import { bulkSendMessage } from '../discord/webhook'
import puppeteer from 'puppeteer'
import { isHeadless } from '../puppeteer'
import { CrawlerReturnObject, filterDuplicate } from './helper'
import { brandLogo, imgDefault } from './constants'

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

export default async function crawler({ queryBrand, limit, webhookUrl, crawlerName, locale }: CrawlerInput): Promise<{ status: boolean, identifier: string, message: string }> {
  const browser = await puppeteer.launch({ headless: isHeadless })
  try {
    const [page] = await browser.pages()

    const query = queryBrand
    const baseUrl = locale !== '' ?
      `https://www.asos.com/${locale}/search/?currentpricerange=10-230&q=${query}&sort=freshness&refine=attribute_1047:8606` :
      `https://www.asos.com/search/?currentpricerange=10-230&q=${query}&sort=freshness&refine=attribute_1047:8606`

    await page.goto(baseUrl, { waitUntil: 'networkidle0' })

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight)
    })

    await page.waitForTimeout(3000)

    // await page.setRequestInterception(true)
    // page.on('request', (request) => {
    //   if (request.resourceType() === 'image') request.abort()
    //   else request.continue()
    // })

    await page.screenshot({ path: '../../public/ss.jpg' })

    let list = await page.evaluate(() => {
      function pageLogic(element: Element) {
        const a = element.querySelector('a')
        const url = `${a?.getAttribute('href')}`
        const title = `${a?.children[1].children[0].children[0].children[0].textContent}`
        let price = `${a?.children[2].children[0].children[0].textContent}`
        if (price?.toString() === 'RRP') {
          price = `${a?.children[2].children[1].children[0].textContent}`
        }

        const img = `${element.querySelector('img[data-auto-id="productTileImage"]')?.getAttribute('src')}`
        return {
          title,
          url,
          price,
          img
        }
      }

      const map = Array.from(
        document.querySelectorAll('article[data-auto-id=productTile]'),
        pageLogic
      )
      return map
    })
    list = list.slice(0, limit)

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
      const _img = img === 'undefined' ? imgDefault : `https:${img.split('?')[0]}`
      const embed = new MessageBuilder()
        .setTitle(title)
        .setAuthor(`ASOS [Search: ${queryBrand}]`, brandLogo.asos, baseUrl)
        // @ts-ignore
        .setURL(url)
        .addField('價格', price, true)
        .setFooter(`最新 ${index + 1}/${limit} 筆`)
        .setImage(_img)
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
