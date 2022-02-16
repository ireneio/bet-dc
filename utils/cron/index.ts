import cron from 'node-cron'
import { removeDiskImages } from '../system'

// every sunday
export async function removeImage() {
  cron.schedule('0 0 * * 0', async () => {
    removeDiskImages()
    console.log('[cron] images removed.')
  })
  console.log('[cron] removeImage on 0 0 * * 0  (every sunday)')
}
