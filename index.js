const express = require('express');
const json = require('./json.js');
const app = express();
const port = 3000;

// All the routing is taken care here. Change them if you need to
app.get('/json', json.getJson)

// Root directory
app.get('/', (request, response) => {
    response.json({ info: 'This is a simple REST API built on node.js to allow users to read json files from a location and serve them via API.' })
})

// Listening to defined port
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})