import { MessageBuilder, Webhook } from 'discord-webhook-node'

export const channels = {
  asosConverse: 'https://discord.com/api/webhooks/857650534898860052/jwAAM00hmwGdNLFE8X2j482nydiZZpsS8solwl94hJab5qcVUZsls9k3jyj26ZY5caj9',
  asosNewbalance: 'https://discord.com/api/webhooks/857644064894877737/U78_-v5YAyqnzobWo-jUeSzrWn2_HomA5qJRYBKOpqg-QMJWiravkzyCrHRN6Lkyaqc4',
  asosNike: 'https://discord.com/api/webhooks/857638517442347018/eQJrWeTFsgoYmYfv-CJQy_HCr4GR5dBfNFr-ElF3wkC5RabHuRAjhibvEUAOOFr5RRZT',
  asosMenSneakers: 'https://discord.com/api/webhooks/857575460938448906/VCmjBmr7DsHKFMS_HdeAvslb-C9Eu4Kfzb7SLFpfgYV8bY_INJ2h2XbQs9o3o-wGwXFf',
  errorHandling: 'https://discord.com/api/webhooks/857592473253183509/U4YBOSzzdphH_X4dbYnfRvVy7Zfadv6UXRspwLCN4UOjLCN_nsCMBdWfpjpukB6dQ36G'
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
