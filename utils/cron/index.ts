import cron from 'node-cron'
import run from '~/utils/puppeteer'

export async function runPuppeteer() {
  await run()
  cron.schedule('*/30 * * * *', async () => {
    console.log('running puppeteer scripts every 30 minutes')
    await run()
  })
}
