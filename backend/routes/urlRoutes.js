import express from 'express';
import { shortenUrl, getAllUrls, redirectUrl } from '../controllers/urlController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/shorten', authenticate, shortenUrl);
router.get('/urls', authenticate, getAllUrls);
router.get('/:shortUrl', redirectUrl);

export default router; 