import { generateShortUrl } from '../utils/generateShortUrl.js';
import bcrypt from 'bcrypt';
import Url from '../models/Url.js';
export const shortUrl = async (req, res) => {
    try {
        const{originalUrl,password} = req.body;
        if (!originalUrl) { 
            return res.status(400).json({ error: 'Original URL is required' });
        }
        const shortUrl=generateShortUrl();
        const newUrl = new Url({
            originalUrl,
            shortUrl,
            userId: req.user._id, // Assuming req.user is set by authentication middleware
            isPasswordProtected:password ? true : false,
            password: password ? await bcrypt.hash(password, 10) : null,
        })
        
       await newUrl.save();
       res.status(201).json({
        originalUrl,
        shortUrl:`${req.protocol}://${req.get('host')}/${shortUrl}`,
        id: newUrl._id,
        isPasswordProtected: newUrl.isPasswordProtected
       })
    }catch (e) {
        res.status(500).json({
            error:e.message,
            message:'Failed to shorten URL'
        })
    }
}
export const getAllUrls = async (req, res) => {
    try{
        const userId = req.user._id; // Assuming req.user is set by authentication middleware
        const urls = await Url.find({ userId }).select('-password').sort({ createdAt: -1 });
        res.status(200).json(urls);
    }catch (e) {
        res.status(500).json({
            error:e.message,
            message:'Failed to fetch URLs'
        })
    }
}
export const redirectUrl = async (req, res) => {
    try{
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl });
        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }
        if (!url.isActive) {
            return res.status(403).json({ message: 'URL is notactive' });
        }
        if (url.isPasswordProtected) {
            return res.redirect(`/password-prompt.html?shortUrl=${shortUrl}`);
        }
        url.clicks++;
        await url.save();
        res.redirect(url.originalUrl);
    }catch (e) {
        res.status(500).json({
            error:e.message,
            message:'Failed to redirect URL'
        })
    }
}
    export const verifyPassword = async (req, res) => {
        try{
            const { shortUrl, password } = req.body;
            const url = await Url.findOne({ shortUrl });

            if (!url) { 
                return res.status(404).json({ message: 'URL not found' });
            }
            if(!url.isActive) {
                return res.status(403).json({ message: 'URL is not active' });
            }   
            const isPasswordCorrect = await bcrypt.compare(password, url.password);
            if (!isPasswordCorrect) {
                url.passwordAttempts++;
                if (url.passwordAttempts >= 3) {
                    url.isActive = false; // Deactivate URL after 3 failed attempts
                }
                await url.save();
                return res.status(401).json({ error: 'Invalid password' });
            }
            url.passwordAttempts = 0; // Reset password attempts on successful verification
            await url.save();
            res.status(200).json({originalUrl:url.originalUrl});

        }
        catch (e) {
            res.status(500).json({
                error: e.message,
                message: 'Failed to verify password'
            });
        }

}