const productsRouter = require('express').Router();
const Product = require('../models/product');
const logger = require('../utils/logger');

productsRouter.get('/', async (request, response) => {
    const products = await Product
        .find({}).populate('merchant');
    if (products) {
        response.json(products);
    } else {
        response.status(404).end();
    }
});

productsRouter.get('/:id', async (request, response) => {
    const product = await Product.findById(request.params.id);
    if (product) {
        response.json(product);
    } else {
        response.status(404).end();
    }
});

module.exports = productsRouter;
