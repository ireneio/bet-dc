import { MessageBuilder } from 'discord-webhook-node'
import { bulkSendMessage } from '../discord/webhook'
import puppeteer from 'puppeteer'
import { isHeadless } from '../puppeteer'

export default async function crawler({ queryBrand, limit, webhookUrl, crawlerName }: { queryBrand: string, limit: number, webhookUrl: string, crawlerName: string }): Promise<{ status: boolean, identifier: string }> {
  const browser = await puppeteer.launch({ headless: isHeadless })
  try {
    const [page] = await browser.pages()

    const query = queryBrand
    const baseUrl = `https://www.asos.com/us/search/?currentpricerange=10-230&q=${query}&sort=freshness&refine=attribute_1047:8606`

    await page.goto(baseUrl, { waitUntil : 'networkidle0' })

    await page.setRequestInterception(true)
    page.on('request', (request) => {
      if (request.resourceType() === 'image') request.abort()
      else request.continue()
    })

    let list = await page.evaluate(() => {
      // window.scrollTo(0,window.document.body.scrollHeight)

      function pageLogic(element: Element) {
        const a = element.querySelector('a')
        const url = a?.getAttribute('href')
        const title = a?.children[1].children[0].children[0].children[0].textContent
        const price = a?.children[2].children[0].children[0].textContent
        // @ts-ignore
        // const imgUrl = a?.children[0].children[0].src
        return {
          title,
          url: url?.toString() || '',
          price,
          // imgUrl
        }
      }

      const map = Array.from(
        document.querySelectorAll('article[data-auto-id=productTile]'),
        pageLogic
      )
      return map
    })
    list = list.slice(0, limit)

    console.log(list)

    const messageList: MessageBuilder[] = []

    list.forEach((item: any) => {
      const { url, price, title } = item
      const embed = new MessageBuilder()
        .setTitle(title)
        .setAuthor(`ASOS [Search: ${queryBrand}]`, 'https://logo-logos.com/wp-content/uploads/2016/10/Asos_logo.png', baseUrl)
        // @ts-ignore
        .setURL(url)
        .addField('價格', price, true)
        .setFooter(`最新 ${limit} 筆`)
        .setTimestamp()
      messageList.push(embed)
    })

    await bulkSendMessage(messageList, webhookUrl)

    return { status: true, identifier: `asos-${crawlerName}` }
  } catch(e) {
    console.log('ERROR:', e.message)
    return { status: false, identifier: `asos-${crawlerName}` }
  } finally {
    await browser.close()
  }
}
