const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'GET requests to /orders'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'POST requests to /orders'
    });
});

router.get('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'GET requests to /products/orderID',
        orderID: req.params.orderID
    });
});

router.delete('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'DELETE requests to /products/orderID',
        orderID: req.params.orderID
    });
});

module.exports = router;