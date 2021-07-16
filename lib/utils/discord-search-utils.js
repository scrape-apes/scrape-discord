export function checkForImages(message) {
  if (message.content.includes('-i')) return true
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