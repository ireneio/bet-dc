import { channels, sendErrorMessage } from '~/utils/discord/webhook'
import crawlers from '~/utils/crawlers/'

// export const isHeadless = process.env.NODE_ENV === 'production'
export const isHeadless = false

const TIMEOUT_BETWEEN_BATCH = 30000

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
  try {
    setTimeout(async () => {
      const asosUs = await Promise.all([
        crawlers.asos({ queryBrand: 'nike', limit: 5, webhookUrl: channels.asosUsNike, crawlerName: 'en_US-nike', locale: 'us' }),
        crawlers.asos({ queryBrand: 'converse', limit: 5, webhookUrl: channels.asosUsConverse, crawlerName: 'en_US-converse', locale: 'us' }),
      ])
      makeCrawlerResult(asosUs)
    }, 0)

    setTimeout(async () => {
      const asosUs = await Promise.all([
        crawlers.asos({ queryBrand: 'new+balance', limit: 5, webhookUrl: channels.asosUsNewbalance, crawlerName: 'en_US-new-balance', locale: 'us' }),
        crawlers.asos({ queryBrand: 'vans', limit: 5, webhookUrl: channels.asosUsVans, crawlerName: 'en_US-vans', locale: 'us' }),
        crawlers.asos({ queryBrand: 'the+north+face', limit: 5, webhookUrl: channels.asosUsNorthFace, crawlerName: 'en_US-the-north-face', locale: 'us' }),
      ])
      makeCrawlerResult(asosUs)
    }, TIMEOUT_BETWEEN_BATCH)

    setTimeout(async () => {
      const asosFr = await Promise.all([
        crawlers.asos({ queryBrand: 'nike', limit: 5, webhookUrl: channels.asosFrNike, crawlerName: 'fr-nike', locale: 'fr' }),
        crawlers.asos({ queryBrand: 'new+balance', limit: 5, webhookUrl: channels.asosFrNewBalance, crawlerName: 'fr-new-balance', locale: 'fr' }),
      ])
      makeCrawlerResult(asosFr)
    }, TIMEOUT_BETWEEN_BATCH * 2)

    setTimeout(async () => {
      const asosFr = await Promise.all([
        crawlers.asos({ queryBrand: 'converse', limit: 5, webhookUrl: channels.asosFrConverse, crawlerName: 'fr-converse', locale: 'fr' }),
        crawlers.asos({ queryBrand: 'carhartt', limit: 5, webhookUrl: channels.asosFrCarhartt, crawlerName: 'fr-carhartt', locale: 'fr' })
      ])
      makeCrawlerResult(asosFr)
    }, TIMEOUT_BETWEEN_BATCH * 3)

    setTimeout(async () => {
      const asosEn = await Promise.all([
        crawlers.asos({ queryBrand: 'nike', limit: 5, webhookUrl: channels.asosEnNike, crawlerName: 'en_EN-nike', locale: '' }),
        crawlers.asos({ queryBrand: 'new+balance', limit: 5, webhookUrl: channels.asosEnNewBalance, crawlerName: 'en_EN-new-balance', locale: '' }),
      ])
      makeCrawlerResult(asosEn)
    }, TIMEOUT_BETWEEN_BATCH * 4)

    setTimeout(async () => {
      const asosEn = await Promise.all([
        crawlers.asos({ queryBrand: 'converse', limit: 5, webhookUrl: channels.asosEnConverse, crawlerName: 'en_EN-converse', locale: '' }),
        crawlers.asos({ queryBrand: 'adidas', limit: 5, webhookUrl: channels.asosEnAdidas, crawlerName: 'en_EN-adidas', locale: '' })
      ])
      makeCrawlerResult(asosEn)
    }, TIMEOUT_BETWEEN_BATCH * 5)

    setTimeout(async () => {
      const footLocker = await Promise.all([
        crawlers.footLocker({ queryBrand: 'new-balance', limit: 5, webhookUrl: channels.footLockerNewBalance, crawlerName: 'new-balance', siteBrand: 'footlocker' }),
        crawlers.footLocker({ queryBrand: 'nike', limit: 5, webhookUrl: channels.footLockerNike, crawlerName: 'nike', siteBrand: 'footlocker' }),
      ])
      makeCrawlerResult(footLocker)
    }, TIMEOUT_BETWEEN_BATCH * 6)

    setTimeout(async () => {
      const footLocker = await Promise.all([
        crawlers.footLocker({ queryBrand: 'adidas', limit: 5, webhookUrl: channels.footLockerAdidas, crawlerName: 'adidas', siteBrand: 'footlocker' }),
        crawlers.footLocker({ queryBrand: 'converse', limit: 5, webhookUrl: channels.footLockerConverse, crawlerName: 'converse', siteBrand: 'footlocker' }),
        crawlers.footLocker({ queryBrand: 'hoka-one-one', limit: 5, webhookUrl: channels.footLockerHokaOneOne, crawlerName: 'hoka-one-one', siteBrand: 'footlocker' })
      ])
      makeCrawlerResult(footLocker)
    }, TIMEOUT_BETWEEN_BATCH * 7)

    setTimeout(async () => {
      const eastBay = await Promise.all([
        crawlers.footLocker({ queryBrand: 'new-balance', limit: 5, webhookUrl: channels.eastBayNewBalance, crawlerName: 'new-balance', siteBrand: 'eastbay' }),
        crawlers.footLocker({ queryBrand: 'nike', limit: 5, webhookUrl: channels.eastBayNike, crawlerName: 'nike', siteBrand: 'eastbay' }),
      ])
      makeCrawlerResult(eastBay)
    }, TIMEOUT_BETWEEN_BATCH * 8)

    setTimeout(async () => {
      const eastBay = await Promise.all([
        crawlers.footLocker({ queryBrand: 'adidas', limit: 5, webhookUrl: channels.eastBayAdidas, crawlerName: 'adidas', siteBrand: 'eastbay' }),
        crawlers.footLocker({ queryBrand: 'converse', limit: 5, webhookUrl: channels.eastBayConverse, crawlerName: 'converse', siteBrand: 'eastbay' }),
        crawlers.footLocker({ queryBrand: 'hoka-one-one', limit: 5, webhookUrl: channels.eastBayHokaOneOne, crawlerName: 'hoka-one-one', siteBrand: 'eastbay' })
      ])
      makeCrawlerResult(eastBay)
    }, TIMEOUT_BETWEEN_BATCH * 9)

    setTimeout(async () => {
      const nb = await crawlers.newBalance({ queryBrand: 'us', limit: 5, webhookUrl: channels.newBalanceUs, crawlerName: 'us', siteBrand: 'newbalance' })
      makeCrawlerResult([nb])
    }, TIMEOUT_BETWEEN_BATCH * 10)

    setTimeout(async () => {
      const nikeUs = await crawlers.nike({ queryBrand: 'us', limit: 5, webhookUrl: channels.nikeUs, crawlerName: 'us', siteBrand: 'nike' })
      makeCrawlerResult([nikeUs])
    }, TIMEOUT_BETWEEN_BATCH * 11)

    setTimeout(async () => {
      const nikeJp = await crawlers.nike({ queryBrand: 'jp', limit: 5, webhookUrl: channels.nikeJp, crawlerName: 'jp', siteBrand: 'nike' })
      makeCrawlerResult([nikeJp])
    }, TIMEOUT_BETWEEN_BATCH * 12)

    setTimeout(async () => {
      const afewEn = await crawlers.afew({ queryBrand: 'en', limit: 5, webhookUrl: channels.afewEn, crawlerName: 'en', siteBrand: 'afew' })
      makeCrawlerResult([afewEn])
    }, TIMEOUT_BETWEEN_BATCH * 12)
  } catch (e) {
    await sendErrorMessage('system', 'puppeteer-failure', channels.errorHandling)
  }
}

export default async function run() {
  await runLogic()
  console.log('[puppeteer] ran script once.')
}
