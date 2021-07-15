import craigsListScraper from '../utils/craigslistScraper.js';
import varagesaleScraper from '../utils/varagesaleScraper.js';
import mergeResults from '../utils/mergeResults.js';



export default class ScraperService {

  static async fetchSearchResults(searchTerm, city) {

    const craiglistSearchResults = await craigsListScraper(searchTerm, city);
    const varagesaleSearchResults = await varagesaleScraper(city, searchTerm);

    return mergeResults(craiglistSearchResults, varagesaleSearchResults);
    // return craiglistSearchResults;

  }
}
