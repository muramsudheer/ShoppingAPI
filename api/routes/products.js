const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    url: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(doc => {
        if (doc) {
            res.status(201).json({
                message: "POST request to /products",
                newProd: {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            });
        } else {
            res.status(404).json({message: "No such entry in database"});
        }
        
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });  
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });

});

router.patch('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findByIdAndUpdate(id, { $set: req.body }, { new: true})
    .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err})
    });
});

router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http:localhost:3000/products',
                body: {
                    name: "String",
                    price: "Number"
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

module.exports = router;