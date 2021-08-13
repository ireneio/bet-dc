import cron from 'node-cron'
import run from '~/utils/puppeteer'
import { removeDiskImages } from '../system'

export async function runPuppeteer() {
  run()
  cron.schedule('0 * * * *', async () => {
    await run()
    console.log('[cron] puppeteer scripts ran.')
  })
  console.log('[cron] runPuppeteer on 0 * * * * (every hour)')
}

// every sunday
export async function removeImage() {
  cron.schedule('0 0 * * 0', async () => {
    removeDiskImages()
    console.log('[cron] images removed.')
  })
  console.log('[cron] removeImage on 0 0 * * 0  (every sunday)')
}
