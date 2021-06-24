// import { Page } from "puppeteer";

// export async function pageEvaluateThenScroll(page: Page, cb: Function, cbArgs: any[]) {
//   return await page.evaluate((cb, cbArgs) => {
//     window.scrollTo(0,window.document.body.scrollHeight)
//     return cb(...cbArgs)
//   })
// }

export function bulkGetElements(
  selector: string,
  cb: (element: Element) => {},
  limit: number
) {
  const map = Array.from(document.querySelectorAll(selector), cb)
  return map.slice(0, limit)
}
