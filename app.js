const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
// Importing all necessary routes
const products = require('./api/routes/products');
const orders = require('./api/routes/orders');

mongoose.connect('mongodb+srv://mohamed:' + process.env.mongoPW + '@shopping-api.lpoen.mongodb.net/shopping-api?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Body parsing
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS error handling: making sure clients from different servers (different urls)
// can access the API. By default, browsers have it so that clients and their servers
// are run on the same url
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        res.status(200).json({});
    }
    next();
});

// Accessing appropriate route based on request
app.use('/products', products);
app.use('/orders', orders);

// Error handling if request doesn't go into any of the routes
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404; // 404 Error = route not found
    next(error);
});

// Error handling for errors from anywhere else in the API
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;