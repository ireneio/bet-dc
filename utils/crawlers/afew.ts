import { MessageBuilder } from 'discord-webhook-node'
import { bulkSendMessage } from '../discord/webhook'
import { CrawlerReturnObject, filterDuplicate } from './helper'
import { brandLogo } from './constants'

interface CrawlerInput {
  browser: any,
  queryBrand: 'en',
  limit: number,
  webhookUrl: string,
  crawlerName: string,
  siteBrand: 'afew'
}

let previousEnList: CrawlerReturnObject[] = []

const vh = 768
const vw = 1366

export default async function crawler({ browser, queryBrand, limit, webhookUrl, crawlerName, siteBrand }: CrawlerInput): Promise<{ status: boolean, identifier: string, message: string }> {
  try {
    const page = await browser.newPage()

    await page.setViewport({
      width: vw,
      height: vh,
    })

    const host = 'https://en.afew-store.com'
    const baseUrl = `${host}/collections/sneakers?sort%5B0%5D%5Bfield%5D=created_at&sort%5B0%5D%5Border%5D=desc`

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'language', {
        get: function () {
          return 'en-US'
        }
      })
      Object.defineProperty(navigator, 'languages', {
        get: function () {
          return ['en-US', 'en']
        }
      })
    })

    await page.goto(baseUrl, { waitUntil: 'networkidle0' })

    let list = await page.evaluate(() => {
      function pageLogic(element: Element) {
        const url = `${element?.getAttribute('href')}`
        const title = `${element?.querySelector('.card-title')?.textContent}`
        const price = `${element?.querySelector('.price')?.textContent}`
        const img = `${element.children[0]?.getAttribute('src')}`
        return {
          title,
          url,
          price,
          img: `https:${img}`
        }
      }

      const map = Array.from(
        document.querySelectorAll('.product-card'),
        pageLogic
      )
      return map
    })
    list = list.slice(0, limit)

    const _list = filterDuplicate(list, previousEnList)
    previousEnList = [...list]
    list = _list

    if (list.length > 0) {
      console.log(list)
      await page.close()
      const messageList: MessageBuilder[] = []
      list.forEach((item: any, index: number) => {
        const { url, price, title, img } = item
        const authorText = `${siteBrand}_${queryBrand}`.toUpperCase()
        const embed = new MessageBuilder()
          .setTitle(title)
          .setAuthor(`${authorText} [Search: Sneakers Release]`, brandLogo.afew, baseUrl)
          // @ts-ignore
          .setURL(`${host}${url}`)
          .addField('價格', price, true)
          .setFooter(`最新 ${index + 1}/${limit} 筆`)
          .setImage(img)
          .setTimestamp()
        messageList.push(embed)
      })
      await bulkSendMessage(messageList, webhookUrl)
    } else {
      await page.close()
      console.log(`${siteBrand}-${crawlerName}: No New Drops`)
    }

    return { status: true, identifier: `${siteBrand}-${crawlerName}`, message: 'success' }
  } catch (e: any) {
    console.log('ERROR:', e.message)
    return { status: false, identifier: `${siteBrand}-${crawlerName}`, message: e.message }
  }
}
