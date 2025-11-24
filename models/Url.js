const mongoose = require('mongoose');


const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  accessCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true }); // adds createdAt and updatedAt fields

module.exports = mongoose.model('Url', urlSchema);