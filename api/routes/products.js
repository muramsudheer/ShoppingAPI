const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'GET requests to /products'
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'POST requests to /products'
    });
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    if (id == 'special') {
        res.status(200).json({
            message: 'Special product',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'Normal product'
        });
    }
});

router.patch('/:productID', (req, res, next) => {
    res.status(200).json({
        message: 'Updated products'
    });
});

router.delete('/:productID', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted a product'
    });
});

module.exports = router;