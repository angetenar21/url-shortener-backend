require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urlRoutes');
const Url = require('./models/Url');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/url_shortener';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

//Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'URL Shortening Service is running' });
});

//Mount URL routes
app.use('/shorten', urlRoutes);

// Redirect route
app.get('/:code', async (req, res) => {
  const { code } = req.params;
  const urlDoc = await Url.findOne({ shortCode: code });

  if (!urlDoc) {
    return res.status(404).send('Short URL not found');
  }

  urlDoc.accessCount += 1;
  await urlDoc.save();

  return res.redirect(urlDoc.url);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});