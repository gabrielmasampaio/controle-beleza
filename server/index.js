require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.send('API online');
});

const routes = require('./routes');
app.use('/api', routes);


const {
    DB_USER,
    DB_PASS,
    DB_HOST,
    DB_NAME,
    DB_OPTIONS
} = process.env;

const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}${DB_OPTIONS}`;


mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`✅ Conected succesfully to DB`);
        const PORT = 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server online at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Error connecting to MongoDB:', err.message);
    });