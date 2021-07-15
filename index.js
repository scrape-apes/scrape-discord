import dotenv from 'dotenv';
dotenv.config();
import Discord from 'discord.js';
import { search, city } from './lib/utils/discord-utils.js';
import ScraperService from '../scrape-discord/lib/services/ScraperService.js';
import tinyurl from 'tinyurl-api';

const client = new Discord.Client();

const prefix = '!';
let searchTerm = '';
let cityTerm = '';

client.once('ready', () => {
  console.log('ready');
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  if (message.content === '!scrape') {
    message.channel.send('Reply with "!scrape <search term> -c <city>');
  } else if (message.content.startsWith('!scrape ')) {
    searchTerm = search(message.content);
    cityTerm = city(message.content);
  }
  const results = await ScraperService.fetchSearchResults(searchTerm, cityTerm);
  const tiny = await Promise.all(results.map(result => tinyurl(`${result.link}`)));

  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Results for ${searchTerm} in ${cityTerm}`)
    .setThumbnail('https://sendbird.com/wp-content/uploads/20180629_marketplace@2x.png')
    .setTimestamp()

  results.map((result, index) => {
    embed.addField(`${result.title}\n${result.price}`, `${tiny[index]}`, true)
  });

  message.channel.send(embed);
});

client.login(process.env.DISCORD_TOKEN);
