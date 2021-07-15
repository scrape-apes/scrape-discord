import Discord from 'discord.js';
import ScraperService from '../services/ScraperService.js';
import tinyurl from 'tinyurl-api';

export function sendImages(message) {
  console.log('message', message);
  if (message.includes('-i')) return true
}

export function search(string) {
  const search = string.split('-c ')[0];
  return search.split(' ').slice(1).join(' ').toLowerCase();
}

export function city(string) {
  if (sendImages(string)) return string.split(' -i')[0].split('-c ')[1].toLowerCase();
  return string.split('-c ')[1].toLowerCase();
}

export async function sendUserResults(searchTerm, cityTerm, message) {
  const results = await ScraperService.fetchSearchResults(searchTerm, cityTerm);
  await Promise.all(results.map(result => {
    const embed = new Discord.MessageEmbed()
      .setTitle(`${result.title}`)
      .setURL(`${result.link}`)
      .setDescription(`${result.price}`)
      .setThumbnail(`${result.image}`);
    message.author.send(embed);
  }));
}

export async function sendChannelResults(searchTerm, cityTerm) {
  const results = await ScraperService.fetchSearchResults(searchTerm, cityTerm);
  const tinyLinks = await Promise.all(results.map(result => tinyurl(`${result.link}`)));

  const embeddedResultsMsg = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Results for \'${searchTerm}\' in ${cityTerm}`)
    .setThumbnail('https://sendbird.com/wp-content/uploads/20180629_marketplace@2x.png')
    .setTimestamp()

  results.map((result, index) => {
    embeddedResultsMsg.addField(`${result.title}\n${result.price}`, `${tinyLinks[index]}`, true)
  });

  return embeddedResultsMsg;
}