import cron from 'node-cron'
import run from '~/utils/puppeteer'

export async function runPuppeteer() {
  await run()
  cron.schedule('*/30 * * * *', async () => {
    await run()
    console.log('[puppeteer] ran script once.')
  })
  console.log('running puppeteer scripts every 30 minutes')
}
