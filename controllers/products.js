const productsRouter = require('express').Router();
const Product = require('../models/product');
const logger = require('../utils/logger');

productsRouter.get('/', async (request, response) => {
    const products = await Product;
    if (products) {
        response.json(products);
    } else {
        response.status(404).end();
    }
});

module.exports = productsRouter;
