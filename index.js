import dotenv from 'dotenv';
dotenv.config();
import Discord, { User } from 'discord.js';
import { search, city, checkForImages, sendChannelResults, sendUserResults } from './lib/utils/discord-utils.js';

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
    imageCheck = checkForImages(message);
    searchTerm = search(message.content);
    cityTerm = city(message);

    if (!imageCheck) {
      message.channel.send(await sendChannelResults(searchTerm, cityTerm));
    } else {
      sendUserResults(searchTerm, cityTerm, message);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
