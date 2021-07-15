import dotenv from 'dotenv';
dotenv.config();
import Discord, { User } from 'discord.js';
import { search, city, sendImages, sendChannelResults, sendUserResults } from './lib/utils/discord-utils.js';

export const client = new Discord.Client();

const prefix = '!';
let searchTerm = '';
let cityTerm = '';
let imageCheck = false;

client.once('ready', () => {
  console.log('ready');
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content === '!scrape') {
    message.channel.send('Reply with "!scrape <search term> -c <city> -i for images');
  } else if (message.content.startsWith('!scrape ')) {

    imageCheck = sendImages(message.content);
    searchTerm = search(message.content);
    cityTerm = city(message.content);
  }
  if (!imageCheck) {
    message.channel.send(await sendChannelResults(searchTerm, cityTerm));
  } else {
    message.channel.send(`${message.author}, please check your DMs.`);
    sendUserResults(searchTerm, cityTerm, message);
  }
});

client.login(process.env.DISCORD_TOKEN);
