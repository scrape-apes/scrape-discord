import Discord from 'discord.js';
import ScraperService from '../services/ScraperService.js';
import tinyurl from 'tinyurl-api';

export function checkForImages(message) {
  if (message.content.includes('-i')) return true
  return false;
}

export async function sendUserResults(searchTerm, cityTerm, message) {
  const filter = m => m.author.id === message.author.id;
  message.channel.send('Would you like me to DM you the images? y/n')
    .then(() => {
      message.channel.awaitMessages(filter, { max: 1, time: 8000, errors: ['time'] })
        .then(collected => {
          if (collected.first().content.toLowerCase() === 'y') {
            message.channel.send('ok...');
            sendImages(searchTerm, cityTerm, message);
            return true;
          } else {
            message.channel.send('shutting down');
          }
        })
        .catch(err => { console.log(err) });
    })
  return false;
}

export function search(message) {
  const search = message.split('-c ')[0];
  return search.split(' ').slice(1).join(' ').toLowerCase();
}

export function city(message) {
  const messageContent = message.content;
  if (checkForImages(message)) {
    return messageContent.split(' -i')[0].split('-c ')[1].toLowerCase();
  }
  return messageContent.split('-c ')[1].toLowerCase();
}

export async function sendImages(searchTerm, cityTerm, message) {
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