export interface CrawlerReturnObject {
  title: string
  url: string
  price: string
}

export function filterDuplicate(newArr: CrawlerReturnObject[], oldArr: CrawlerReturnObject[]): CrawlerReturnObject[] {
  return newArr.filter((newArrItem) => !oldArr.find(oldArrItem => oldArrItem.url === newArrItem.url))
}
