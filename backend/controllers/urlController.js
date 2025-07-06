import Url from '../models/Url.js';
import { generateShortUrl } from '../utils/generateShortUrl.js';

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const shortUrl = generateShortUrl();
    const url = new Url({ originalUrl, shortUrl });
    await url.save();

    res.json({
      originalUrl,
      shortUrl: `http://localhost:${process.env.PORT || 5000}/${shortUrl}`,
      id: url._id
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    url.clicks++;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 