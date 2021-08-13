import { MessageBuilder } from 'discord-webhook-node'
import { bulkSendMessage } from '../discord/webhook'
import { CrawlerReturnObject, filterDuplicate, waitForTimeout } from './helper'
import { brandLogo } from './constants'
import { v4 as uuidv4 } from 'uuid'
import * as cheerio from 'cheerio'

interface CrawlerInput {
  browser: any,
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

    // get and extract images
    for (let i = 0; i < list.length; i++) {
      const url = list[i].url
      const _imageName = uuidv4()
      const imageExt = '.jpg'
      const imageName = _imageName.replaceAll('-', '')
      const extractPath = `public/${imageName}${imageExt}`

      await page.goto(url)
      await page.screenshot({ path: extractPath })
      // const extracted = await sharp(`public/${_imageName}${imageExt}`).extract({
      //   width: vw,
      //   height: parseInt((vh * 0.6).toString()),
      //   left: 0,
      //   top: 50
      // })
      // await extracted.toFile(extractPath)
      // const form = new FormData()
      // form.append('blobs', fs.createReadStream(extractPath))
      // const config = {
      //   headers: {
      //     ...form.getHeaders()
      //   }
      // }
      // const response = await blob.post('/upload?uuid=snkr_crawler', form, config)
      // const { data: { data } } = response
      // const { blobData } = data
      // const blobUrl = blobData[0].accessUrl
      // list[i].img = blobUrl
      list[i].img = `${process.env.SELF_URL}/${imageName}${imageExt}`
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

    await page.close()

    return { status: true, identifier: `asos-${crawlerName}`, message: 'success' }
  } catch (e) {
    console.log('ERROR:', e.message)
    return { status: false, identifier: `asos-${crawlerName}`, message: e.message }
  }
}
