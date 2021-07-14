import { Router } from 'express';
import ScraperService from '../services/ScraperService.js';

export default Router()
  .get('/:searchTerm/:city', (req, res, next) => {
    ScraperService.fetchSearchResults(req.params.searchTerm, req.params.city)
      .then(results => res.send(results))
      .catch(next);
  });
