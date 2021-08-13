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
