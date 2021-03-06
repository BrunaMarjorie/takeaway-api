const express = require('express'); //create express variable;
const bodyParser = require('body-parser'); //create variable to read client entries;
const router = require('./routes'); //create routes;
const cors = require('cors'); 

const hostname = '0.0.0.0'; 
const port = process.env.PORT || 3001;

const app = module.exports = express();

//set up CORs middleware;
app.use(cors());

//set header;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next();
});

//logging 
app.use((request, response, next) => {
    console.log('[%s] %s -- %s', new Date(), request.method, request.url);
    next();
});

//initiate bodyParser;
app.use(bodyParser.json());


//initiate Router;
app.use('/', router);

//listen to the server;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
});

//error if route informed is not valid;
app.use((request, response) => {
    response.status(404).json({
        error: 404,
        message: 'Route not found',
    });
});