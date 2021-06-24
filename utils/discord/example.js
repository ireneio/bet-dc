import createHook from '~/utils/discord/webhook'
import { MessageBuilder } from "discord-webhook-node"

function test() {
  const url = 'https://discord.com/api/webhooks/857527465685418014/kpUqEppCFvNqWSG5B3PQqkhPGInPdtijBnVM_RCImJGpr2t1RoXBIWdYyUuqz79u4SzO'
  const hook = createHook(url)
  const embed = new MessageBuilder()
  .setTitle('TEST ITEM')
  .setAuthor('Author here', 'https://cdn.discordapp.com/embed/avatars/0.png', 'https://www.google.com')
  // @ts-ignore
  .setURL('https://www.google.com')
  .addField('First field', 's is inline', true)
  .addField('Second field', 'this is not inline')
  .setColor('#f00')
  .setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
  .setDescription('Oh look a description :)')
  .setImage('https://cdn.discordapp.com/embed/avatars/0.png')
  .setFooter('Hey its a footer', 'https://cdn.discordapp.com/embed/avatars/0.png')
  .setTimestamp()

  hook.send(embed)
}
