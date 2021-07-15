export const client = new Discord.Client();
import dotenv from 'dotenv';
dotenv.config();
import Discord from 'discord.js';
import { sendChannelResults, sendUserResults } from './lib/utils/discord-utils.js';
import { checkForImages, city, search } from './lib/utils/discord-search-utils.js';

const prefix = process.env.PREFIX;

client.once('ready', () => {
  console.log('ready');
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content === `${prefix}scrape`) {
    message.channel.send(`Reply with "${prefix}scrape <search term> -c <city> -i (for images)`);
  } else if (message.content.startsWith(`${prefix}scrape`)) {
    let imageCheck = checkForImages(message);
    let searchTerm = search(message.content);
    let cityTerm = city(message);

    if (!imageCheck) {
      message.channel.send('Please wait while I process your request...');
      message.channel.send(await sendChannelResults(searchTerm, cityTerm));
    } else {
      sendUserResults(searchTerm, cityTerm, message);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
