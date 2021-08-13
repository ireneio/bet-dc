import { MessageBuilder } from 'discord-webhook-node'
import { bulkSendMessage } from '../discord/webhook'
import { CrawlerReturnObject, filterDuplicate } from './helper'
import { brandLogo } from './constants'

interface CrawlerInput {
  browser: any,
  queryBrand: string,
  limit: number,
  webhookUrl: string,
  crawlerName: string,
  siteBrand: 'eastbay' | 'footlocker'
}

let previousFootLockerList: CrawlerReturnObject[] = []
let previousEastBayList: CrawlerReturnObject[] = []

const vh = 1080
const vw = 1920

export default async function crawler({ browser, queryBrand, limit, webhookUrl, crawlerName, siteBrand }: CrawlerInput): Promise<{ status: boolean, identifier: string, message: string }> {
  try {
    const page = await browser.newPage()

    await page.setViewport({
      width: vw,
      height: vh,
    })

    const host = siteBrand === 'eastbay' ? 'https://www.eastbay.com' : 'https://www.footlocker.com'
    const query = queryBrand.replaceAll('-', '+')
    const baseUrl = `${host}/category/brands/${queryBrand}.html?query=${encodeURIComponent(query)}%3AnewArrivals%3Aproducttype%3AShoes&sort=newArrivals&currentPage=0`

    // await page.goto(baseUrl, { waitUntil: 'networkidle0' })

    await page.goto(baseUrl)

    await page.setRequestInterception(true)
    page.on('request', (request: any) => {
      if (request.resourceType() === 'image') request.abort()
      else request.continue()
    })

    // await page.waitForXPath('//button[@name="bluecoreCloseButton"]', { visible: true })
    // await page.click('button[name="bluecoreCloseButton"]')

    let list = await page.evaluate(() => {
      function pageLogic(element: Element) {
        const a = element.querySelector('a')
        const url = `${a?.getAttribute('href')}`
        const title = `${element.querySelector('.ProductName-primary')?.textContent}`
        const price = `${element.querySelector('.ProductPrice')?.children[0].textContent}`
        const img = `${element.querySelector('img')?.getAttribute('src')}`
        return {
          title,
          url,
          price,
          img
        }
      }

      const map = Array.from(
        document.querySelectorAll('.ProductCard'),
        pageLogic
      )
      return map
    })
    list = list.slice(0, limit)

    if (siteBrand === 'footlocker') {
      const _list = filterDuplicate(list, previousFootLockerList)
      previousFootLockerList = [...list]
      list = _list
    } else if (siteBrand === 'eastbay') {
      const _list = filterDuplicate(list, previousEastBayList)
      previousEastBayList = [...list]
      list = _list
    }

    console.log(list)

    const messageList: MessageBuilder[] = []

    list.forEach((item: any, index: number) => {
      const { url, price, title, img } = item
      const authorImgUrl = siteBrand === 'eastbay' ? brandLogo.eastBay : brandLogo.footLocker
      const embed = new MessageBuilder()
        .setTitle(title)
        .setAuthor(`${siteBrand.toUpperCase()} [Search: ${queryBrand}]`, authorImgUrl, baseUrl)
        // @ts-ignore
        .setURL(`${host}${url}`)
        .addField('價格', price, true)
        .setFooter(`最新 ${index + 1}/${limit} 筆`)
        .setImage(img)
        .setTimestamp()
      messageList.push(embed)
    })

    await bulkSendMessage(messageList, webhookUrl)

    await page.close()

    return { status: true, identifier: `${siteBrand}-${crawlerName}`, message: 'success' }
  } catch (e) {
    console.log('ERROR:', e.message)
    return { status: false, identifier: `${siteBrand}-${crawlerName}`, message: e.message }
  }
}
