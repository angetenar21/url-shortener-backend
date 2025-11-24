const express = require('express');
const Url = require('../models/Url');
const generateShortCode = require('../utils/generateShortCode');
const { url } = require('inspector');

const router = express.Router();

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    //validation 
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    // generate unique short code
    let shortCode;
    let existing;
    do {
      shortCode = generateShortCode(6);
      existing = await Url.findOne({ shortCode });
    } while (existing);

    //save to database 
    const newUrl = await Url.create({ url, shortCode });

    res.status(201).json({ id: newUrl._id, shortCode: newUrl.shortCode, url: newUrl.url, createdAt: newUrl.createdAt, updatedAt: newUrl.updatedAt });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const urlDoc = await Url.findOne({ shortCode: code });
    if (!urlDoc) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Increment access count
    urlDoc.accessCount += 1;
    await urlDoc.save();

    return res.status(200).json({
      id: urlDoc._id.toString(),
      url: urlDoc.url,
      shortCode: urlDoc.shortCode,
      accessCount: urlDoc.accessCount,
      createdAt: urlDoc.createdAt,
      updatedAt: urlDoc.updatedAt,
    });
  }
  catch (error) {
    console.error('Error retrieving short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /shorten/:code
router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const result = await Url.deleteOne({ shortCode: code });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // 204 No Content: just send status, no body
    return res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /shorten/:code', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /shorten/:code/stats
router.get('/:code/stats', async (req, res) => {
  try {
    const { code } = req.params;

    const urlDoc = await Url.findOne({ shortCode: code });

    if (!urlDoc) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    return res.status(200).json({
      id: urlDoc._id.toString(),
      url: urlDoc.url,
      shortCode: urlDoc.shortCode,
      createdAt: urlDoc.createdAt,
      updatedAt: urlDoc.updatedAt,
      accessCount: urlDoc.accessCount,
    });
  } catch (error) {
    console.error('Error in GET /shorten/:code/stats', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;