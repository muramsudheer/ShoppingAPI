const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../auth/check-auth');

router.get('/', checkAuth, (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(doc => {
            res.status(200).json({
                count: doc.length,
                order: doc.map(doc => {
                    return {
                        _id: doc._id,
                        prdouct: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(200).json(err);
        });
});

router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.product)
        .then(prod => {
            if (!prod) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.product,
                quantity: req.body.quantity
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Order processed',
                request: {
                    type: 'GET',
                    newOrder: {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity
                    },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            });
        });
    
});

router.get('/:orderID', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderID)
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:orderID', checkAuth, (req, res, next) => {
    Order.remove({_id: req.params.orderID})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: {product: 'ID', quantity: 'Number'}
                }
            });
        })
        .catch(err => {
            res.status(200).json({
                error: err
            });
        });
});

module.exports = router;