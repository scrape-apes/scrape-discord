import Discord from 'discord.js';
import ScraperService from '../services/ScraperService.js';
import tinyurl from 'tinyurl-api';

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

export async function sendUserResults(searchTerm, cityTerm, message) {
  const filter = m => m.author.id === message.author.id;

  message.channel.send('Would you like me to DM you the images? y/n')
    .then(() => {
      message.channel.awaitMessages(filter, { max: 1, time: 8000, errors: ['time'] })
        .then(collected => {
          if (collected.first().content.toLowerCase() === 'y') {
            message.channel.send('Great. Just a moment while I prepare the DMs...');
            sendImages(searchTerm, cityTerm, message);
            return true;
          } else if (collected.first().content.toLowerCase() === 'n') {
            message.channel.send('Ok, no problem. Shutting down.');
          } else {
            message.channel.send('Sorry I don\'t recognize that input. Please retry the !scrape request.')
          }
        })
        .catch(err => { console.log(err) });
    })
  return false;
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
