import { MessageBuilder, Webhook } from 'discord-webhook-node'

export const channels = {
  errorHandling: 'https://discord.com/api/webhooks/857592473253183509/U4YBOSzzdphH_X4dbYnfRvVy7Zfadv6UXRspwLCN4UOjLCN_nsCMBdWfpjpukB6dQ36G',
  asosUsConverse: 'https://discord.com/api/webhooks/857650534898860052/jwAAM00hmwGdNLFE8X2j482nydiZZpsS8solwl94hJab5qcVUZsls9k3jyj26ZY5caj9',
  asosUsNewbalance: 'https://discord.com/api/webhooks/857644064894877737/U78_-v5YAyqnzobWo-jUeSzrWn2_HomA5qJRYBKOpqg-QMJWiravkzyCrHRN6Lkyaqc4',
  asosUsNike: 'https://discord.com/api/webhooks/870420608406683698/9xDm9Ercl5Xg98oNC0wWC2atHvofQpUlMKsJn9w8CZU7yZUygl1SQWsapvyq3nWiND6g',
  asosUsVans: 'https://discord.com/api/webhooks/869953171932446753/Ifckd1gNOP1gyMrrgfuSK6l3xT-mTI429GaadJC9HbB9zph8gHc9UPq7-fozXNMtNeot',
  asosUsNorthFace: 'https://discord.com/api/webhooks/869953268812509204/3d9eNv82i7YxQ89hZqRIgMnI2c1TKc2exPpHcOtOfL2YCoMUBfKUrDf9rqAOGeH3Od4t',
  asosFrNike: 'https://discord.com/api/webhooks/869956632224890881/qAb7ESHPvlzF140j0qmSEH83gqxQcoMLeOLpeDkAEztt67UEijA9mLmN0fDAA2VNTN35',
  asosFrNewBalance: 'https://discord.com/api/webhooks/869957523602554960/2YJ8RPUm73NEBCKIQ_eobnWBpo1LvKbnjJhw4K1w09WhKaLkDIEmLi-yHwcPKTufMee9',
  asosFrConverse: 'https://discord.com/api/webhooks/869957715873632296/jLuxdqK08zmBdFvaCiaTNOY0AVQfk0Scfoafu37ICpXBXAG0QGmuMEI_7v9PkrAvj9NP',
  asosFrCarhartt: 'https://discord.com/api/webhooks/869957767572619284/7jDsEMb7QfWNCk1Zg5Dr97Fte7DuMmleHcuVxbVvriDnREHu_Q952YH79RLRt4WDTMj-',
  asosEnNike: 'https://discord.com/api/webhooks/869960415575162911/BHf2g81eSQk1q3uNuN1xGAIHK7LICoFqxtGU-Wj-geOfCpQRz5K8HMk4QqmWmhLs9qG0',
  asosEnNewBalance: 'https://discord.com/api/webhooks/869960476900089876/wGQwuKIq8N_fQyzvaDLNcyKChBBTW6CJPMdUVAWB85vxc3N6BuqtzZc033g8Vk0kj0j7',
  asosEnConverse: 'https://discord.com/api/webhooks/869960531916759040/csjhEr7xvBOdGb9hcdqvl6HtQAZyYHsrOd1t1-ZVGBsJvrhQClripO1M1Q_xXZYun60_',
  asosEnAdidas: 'https://discord.com/api/webhooks/869960558680621076/8l090itNT5xNd7-4-MPM0pMDg3BZVVtQpipX3v85SFjOssVPRX8qHwgzPB2egvE7b1rw',
  footLockerNewBalance: 'https://discord.com/api/webhooks/869975576985878592/sMTzW9UJNXuMijOIOmDMpdCOH2G-VNhIIz-wivToVY_CeuBqgFd3GkcOvNQ8IeFGRtZs',
  footLockerNike: 'https://discord.com/api/webhooks/869976361769508896/VF5PkWbm32JkRVGcMk1zXbtklGmTXkauGiB76_5QyOGiV2nQWWE3QpAGjrYAAGnbUAdX',
  footLockerConverse: 'https://discord.com/api/webhooks/869976502953971782/Mgx7sNGbnmRyDmCCqKeTArdjtryZEVp9atsZgjvqwomT8q9UfGnD7g6k1Mm5YlWeYTap',
  footLockerAdidas: 'https://discord.com/api/webhooks/869976444846100480/G-G19fpooyJR6YpkA0pzox4iRsHKd7_aiJngr-puYxXifNINCEL2g5VsFom-XcL0R54J',
  footLockerHokaOneOne: 'https://discord.com/api/webhooks/869976555353411594/hQvc82rdUTQb93ToRR0JhKt7RVYCDvkYxk9K5bmcb3B88gb3KTPt4VQ1w4Eu6hoXWtJO',
  eastBayNike: 'https://discord.com/api/webhooks/869978812136443955/FYKC3UJNa2HRfrw9rC4TlDCS2W-2hjN2xOfF0g0oCZtFzQ--GNAHX9wavilyek34zdSS',
  eastBayNewBalance: 'https://discord.com/api/webhooks/869978912552263690/S-aB1ab29Znm1DbvHKikwoLwxYaTACHxpsCygXdcdmRNkbQNq7hskJCe8RGRTCU2DscI',
  eastBayConverse: 'https://discord.com/api/webhooks/869978986699182260/zxQ-2kczQFUXQ4CJrZv_M9nrQ446WAXXVG0GbMuG5-WbapQv5K2cHUhPKh9yTI19ROXR',
  eastBayAdidas: 'https://discord.com/api/webhooks/869979040038129716/oTrYyoRm87OQs2CYO9eKjCWoKhizEjgPEou59YhnH3MbBdlVidzzL3MJoSY9ysUHU1bc',
  eastBayHokaOneOne: 'https://discord.com/api/webhooks/869979100578717696/C0eW8NxIXxejRt9WQF4Dc3ZEfAtvev5HOIs4t2DyyMbtd4umJazFngfZrdPkOehrATCr',
  newBalanceUs: 'https://discord.com/api/webhooks/869985072722350081/uAzVC_4d4q8zGWPpwzxvlAg1qSm5nHYAVOs7vfsr3oF0Wrqq7wac69f13TNxM1KJfWXP',
  nikeUs: 'https://discord.com/api/webhooks/870003057256198155/t7MC7G3O7gr9gbmtONXkIQgWvNViFZs51CrwFEyedPfhVcTA5mVoXf4o7fdeXIBiF18C',
  nikeJp: 'https://discord.com/api/webhooks/870003146947178497/TPMSV5fbEGKivN9uyPd5NAlBGLDpJKpHUU0hpOL5j0cLJN-u0OyKaKTgTaxwbnzdG0Bu',
  afewEn: 'https://discord.com/api/webhooks/870013790975062056/BvbnmerCx3VyFhbCZ94FpieMm6ivUf84rsj4JoKO7JTK7CyOc5_v3J9ARak8YbU1vH22'
}

// creates a webhook instance
export default function createHook(url: string) {
  return new Webhook({ url, throwErrors: true })
}

export async function bulkSendMessage(messageList: MessageBuilder[], webhookUrl: string) {
  for (let i = 0; i < messageList.length; i++) {
    const hook = createHook(webhookUrl)
    await hook.send(messageList[i])
  }
}

export async function sendMessage(message: MessageBuilder, webhookUrl: string) {
  const hook = createHook(webhookUrl)
  await hook.send(message)
}

export async function sendErrorMessage(title: string, content: string, webhookUrl: string) {
  const hook = createHook(webhookUrl)
  await hook.error('Error', title, content)
}
