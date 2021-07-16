# scrape-discord v1.0

## Team members:
David, Casey, Nick, Joe, Gabriel, Chase

## Description:
This scrapes varagesale and craigslist using  puppeteer using Discord.js as a front-end
Use the command !scrape to search for results. 
- !search <search terms> -c <city> -i (image options)

- -c allows us to separate the city from the search terms
- -i is an optional flag that allows a user to get DM links with images to the search results
  - these DM links will be separate, so you may receive up to 10 messages

## NOTE
At this point in time, users must enter in their city as defined by craigslist. So Oakland, CA would be entered in as sfbay, for example. 
  - !search banjo -c sfbay