const productsRouter = require('express').Router();
const Product = require('../models/product');
const logger = require('../utils/logger');

productsRouter.get('/', async (request, response) => {
    const products = await Product
        .find({}).populate('merchant').populate('reviews');
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

productsRouter.post('/', async (request, response, next) => {
    const { body } = request;

    const product = new Product({
        name: body.name,
        price: body.price,
        specialPrice: body.specialPrice,
        category: body.category,
        rating: body.rating,
        imgUrl: body.imgUrl,
        numberSold: body.numberSold,
        productDesc: body.productDesc,
        productSpec: body.prodcuctSpec,
        merchant: body.merchant,
        reviews: body.reviews,
    });
    try {
        const savedProduct = await product.save();
        logger.info(`added ${product.name} to products`);
        response.status(201).json(savedProduct);
    } catch (exception) {
        next(exception);
    }
});

productsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Product.findByIdAndRemove(request.params.id);
        response.status(204).end();
    } catch (exception) {
        next(exception);
    }
});

productsRouter.patch('/:id', async (request, response, next) => {
    const product = request.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(request.params.id, product, { new: true });
        return response.status(204).json(updatedProduct);
    } catch (exception) {
        next(exception);
    }
});
module.exports = productsRouter;
