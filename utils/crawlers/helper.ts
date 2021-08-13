import { v4 as uuidv4 } from 'uuid'

export interface CrawlerReturnObject {
  title: string
  url: string
  price: string
  img: string
}

export function filterDuplicate(newArr: CrawlerReturnObject[], oldArr: CrawlerReturnObject[]): CrawlerReturnObject[] {
  return newArr.filter((newArrItem) => !oldArr.find(oldArrItem => serializeString(oldArrItem.title) === serializeString(newArrItem.title)))
}

function serializeString(str: string) {
  return str.split(' ').join().toLowerCase()
}

export async function waitForTimeout(sleepTime: number) {
  await new Promise((resolve) => { setTimeout(resolve, sleepTime) })
}

export async function screenshotAndUpdateUrl(page: any, list: CrawlerReturnObject[]) {
  for (let i = 0; i < list.length; i++) {
    const url = list[i].url
    const _imageName = uuidv4()
    const imageExt = '.jpg'
    const imageName = _imageName.replaceAll('-', '')
    const extractPath = `public/${imageName}${imageExt}`

    await page.goto(url)
    await page.screenshot({ path: extractPath })
    list[i].img = `${process.env.SELF_URL}/${imageName}${imageExt}`
  }
}
