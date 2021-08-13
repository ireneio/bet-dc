import { channels, sendErrorMessage } from '~/utils/discord/webhook'
import crawlers from '~/utils/crawlers/'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { waitForTimeout } from './crawlers/helper'

puppeteer.use(StealthPlugin())

const isHeadless = true

async function makeCrawlerResult(result: { status: boolean, identifier: string }[]) {
  for (let i = 0; i < result.length; i++) {
    const { status, identifier } = result[i]
    console.log({ status, identifier })
    if (status === false) {
      await sendErrorMessage(identifier, 'crawl-failure', channels.errorHandling)
    }
  }
}

async function runLogic() {
  let proc
  let browser

  try {
    browser = await puppeteer.launch({
      headless: isHeadless,
      args: [
        '--no-sandbox',
        '--lang=ja-JP,ja',
        '--disable-setuid-sandbox'
      ],
    })

    proc = await crawlers.nike({ browser, queryBrand: 'jp', limit: 8, webhookUrl: channels.nikeJp, crawlerName: 'jp', siteBrand: 'nike' })
    makeCrawlerResult([proc])

    await browser.close()

    waitForTimeout(3000)

    browser = await puppeteer.launch({
      headless: isHeadless,
      args: [
        '--no-sandbox',
        '--lang=en-US',
        '--disable-setuid-sandbox'
      ],
    })

    proc = await crawlers.nike({ browser, queryBrand: 'us', limit: 8, webhookUrl: channels.nikeUs, crawlerName: 'us', siteBrand: 'nike' })
    makeCrawlerResult([proc])

    proc = await crawlers.newBalance({ browser, queryBrand: 'us', limit: 8, webhookUrl: channels.newBalanceUs, crawlerName: 'us', siteBrand: 'newbalance' })
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'nike', limit: 8, webhookUrl: channels.asosUsNike, crawlerName: 'en_US-nike', locale: 'us' }),
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'converse', limit: 8, webhookUrl: channels.asosUsConverse, crawlerName: 'en_US-converse', locale: 'us' }),
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'new+balance', limit: 8, webhookUrl: channels.asosUsNewbalance, crawlerName: 'en_US-new-balance', locale: 'us' }),
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'vans', limit: 8, webhookUrl: channels.asosUsVans, crawlerName: 'en_US-vans', locale: 'us' }),
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'the+north+face', limit: 8, webhookUrl: channels.asosUsNorthFace, crawlerName: 'en_US-the-north-face', locale: 'us' }),
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'nike', limit: 8, webhookUrl: channels.asosFrNike, crawlerName: 'fr-nike', locale: 'fr' }),
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'new+balance', limit: 8, webhookUrl: channels.asosFrNewBalance, crawlerName: 'fr-new-balance', locale: 'fr' }),
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'carhartt', limit: 8, webhookUrl: channels.asosFrCarhartt, crawlerName: 'fr-carhartt', locale: 'fr' })
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'converse', limit: 8, webhookUrl: channels.asosFrConverse, crawlerName: 'fr-converse', locale: 'fr' }),
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'nike', limit: 8, webhookUrl: channels.asosEnNike, crawlerName: 'en_EN-nike', locale: '' }),
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'new+balance', limit: 8, webhookUrl: channels.asosEnNewBalance, crawlerName: 'en_EN-new-balance', locale: '' }),
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'converse', limit: 8, webhookUrl: channels.asosEnConverse, crawlerName: 'en_EN-converse', locale: '' }),
    makeCrawlerResult([proc])

    proc = await crawlers.asos({ browser, queryBrand: 'adidas', limit: 8, webhookUrl: channels.asosEnAdidas, crawlerName: 'en_EN-adidas', locale: '' })
    makeCrawlerResult([proc])

    proc = await crawlers.afew({ browser, queryBrand: 'en', limit: 8, webhookUrl: channels.afewEn, crawlerName: 'en', siteBrand: 'afew' })
    makeCrawlerResult([proc])

    proc = await crawlers.footLocker({ browser, queryBrand: 'new-balance', limit: 8, webhookUrl: channels.footLockerNewBalance, crawlerName: 'new-balance', siteBrand: 'footlocker' })
    makeCrawlerResult([proc])

    proc = await crawlers.footLocker({ browser, queryBrand: 'nike', limit: 8, webhookUrl: channels.footLockerNike, crawlerName: 'nike', siteBrand: 'footlocker' })
    makeCrawlerResult([proc])

    proc = await crawlers.footLocker({ browser, queryBrand: 'adidas', limit: 8, webhookUrl: channels.eastBayAdidas, crawlerName: 'adidas', siteBrand: 'eastbay' }),
    makeCrawlerResult([proc])

    proc = await crawlers.footLocker({ browser, queryBrand: 'converse', limit: 8, webhookUrl: channels.eastBayConverse, crawlerName: 'converse', siteBrand: 'eastbay' }),
    makeCrawlerResult([proc])

    proc = await crawlers.footLocker({ browser, queryBrand: 'hoka-one-one', limit: 8, webhookUrl: channels.eastBayHokaOneOne, crawlerName: 'hoka-one-one', siteBrand: 'eastbay' })
    makeCrawlerResult([proc])

    proc = await crawlers.footLocker({ browser, queryBrand: 'adidas', limit: 8, webhookUrl: channels.eastBayAdidas, crawlerName: 'adidas', siteBrand: 'eastbay' }),
    makeCrawlerResult([proc])

    proc = await crawlers.footLocker({ browser, queryBrand: 'converse', limit: 8, webhookUrl: channels.eastBayConverse, crawlerName: 'converse', siteBrand: 'eastbay' }),
    makeCrawlerResult([proc])

    proc = await crawlers.footLocker({ browser, queryBrand: 'hoka-one-one', limit: 8, webhookUrl: channels.eastBayHokaOneOne, crawlerName: 'hoka-one-one', siteBrand: 'eastbay' })
    makeCrawlerResult([proc])

    await browser.close()

  } catch (e) {
    await sendErrorMessage('system', e.message, channels.errorHandling)
  } finally {
    // await browser.close()
    console.log('[puppeteer] iteration done')
  }
}

export default async function run() {
  await runLogic()
}
