import { channels, sendErrorMessage } from '~/utils/discord/webhook'
import crawlers from '~/utils/crawlers/'

export const isHeadless = process.env.NODE_ENV === 'production'

const runInterval = 60000 * 30

async function runLogic() {
  try {
    const result = await Promise.all([
      // add crawlers here
      crawlers.asosSearch({ queryBrand: 'nike', limit: 5, webhookUrl: channels.asosNike, crawlerName: 'nike' }),
      crawlers.asosSearch({ queryBrand: 'converse', limit: 5, webhookUrl: channels.asosConverse, crawlerName: 'converse' }),
      crawlers.asosSearch({ queryBrand: 'new+balance', limit: 5, webhookUrl: channels.asosNewbalance, crawlerName: 'new-balance' })
    ])

    for (let i = 0; i < result.length; i++) {
      const { status, identifier } = result[i]
      console.log({ status, identifier })
      if (status === false) {
        await sendErrorMessage(identifier, 'crawl-failure', channels.errorHandling)
      }
    }
  } catch (e) {
    await sendErrorMessage('system', 'puppeteer-failure', channels.errorHandling)
  }
}

export default async function run() {
  await runLogic()
  console.log('[puppeteer] ran script once.')
}
