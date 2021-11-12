const express = require('express');
const app = express();

require('dotenv/config');
const api = process.env.API_URL;

// specify inital route
app.get(api + '/', (req, res) => {
    res.send('Hello API!');
})

// Run server with msg on success
app.listen(3000, () => {
    console.log(api);
    console.log('Backend Server running on http://localhost:3000');
})