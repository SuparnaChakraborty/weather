const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.log(err));

app.listen(5500, () => console.log('Server started on port 5500'));

const Weather = require('./models/Weather');

cron.schedule('*/5 * * * *', async () => {
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
    const apiKey = process.env.WEATHER_API_KEY;

    try {
        for (let city of cities) {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            const weatherData = response.data;

            const tempCelsius = weatherData.main.temp - 273.15;
            const feelsLikeCelsius = weatherData.main.feels_like - 273.15;

            const newWeather = new Weather({
                city: city,
                temp: tempCelsius,
                feels_like: feelsLikeCelsius,
                weather: weatherData.weather[0].main
            });
            await newWeather.save();
            console.log(`Saved weather data for ${city}`);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
});

app.get('/api/weather/summaries', async (req, res) => {
    try {
        const result = await Weather.aggregate([
            {
                $group: {
                    _id: { city: "$city", day: { $dayOfMonth: "$timestamp" }, month: { $month: "$timestamp" }, year: { $year: "$timestamp" } },
                    avgTemp: { $avg: "$temp" },
                    maxTemp: { $max: "$temp" },
                    minTemp: { $min: "$temp" },
                    dominantWeather: { $first: "$weather" } // Simplified for now
                }
            }
        ]);
        res.json(result);
    } catch (error) {
        res.status(500).send('Error fetching weather summaries');
    }
});

const nodemailer = require('nodemailer');

const sendAlert = async (city, condition) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'recipient-email@gmail.com',
        subject: `Weather Alert for ${city}`,
        text: `Alert: ${condition}`,
    };

    await transporter.sendMail(mailOptions);
};
