require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/weather', async (req, res) => {
    const city = req.query.q;

    if (!city) {
        return res.status(400).send('City parameter is required');
    }

    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: city,
                appid: process.env.API_KEY,
                units: 'metric',
                lang: 'ru'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Ошибка при получении данных о погоде:', error.message);
        if (error.response) {
            console.error('Детали ошибки:', error.response.data);
        }
        res.status(500).send('Ошибка при получении данных о погоде');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
