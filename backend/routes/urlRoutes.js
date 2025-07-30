import express from 'express';
import { shortUrl, getAllUrls, redirectUrl, verifyPassword } from '../controllers/urlController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/shorten', authenticate, shortUrl);
router.get('/urls', authenticate, getAllUrls);
router.post('/verify-password', verifyPassword);
router.get('/:shortUrl', redirectUrl);

export default router; 