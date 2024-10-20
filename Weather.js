const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    city: String,
    temp: Number,
    feels_like: Number,
    weather: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Weather', weatherSchema);
