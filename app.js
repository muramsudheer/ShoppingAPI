const express = require('express');
const app = express();

const products = require('./api/routes/products');
const orders = require('./api/routes/orders');

app.use('/products', products);
app.use('/orders', orders);

module.exports = app;