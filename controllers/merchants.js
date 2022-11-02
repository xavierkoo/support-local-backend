const merchantsRouter = require('express').Router();
const Merchant = require('../models/merchant');
const logger = require('../utils/logger');

// retrieve all merchants
merchantsRouter.get('/', async (request, response) => {
    const merchants = await Merchant
        .find({}).populate('products');
    if (merchants) {
        response.json(merchants);
    } else {
        response.status(404).end();
    }
});

// retrieve specific merchant
merchantsRouter.get('/:id', async (request, response) => {
    const merchant = await Merchant.findById(request.params.id);
    if (merchant) {
        response.json(merchant);
    } else {
        response.status(404).end();
    }
});

// update product in merchant
merchantsRouter.patch('/:id', async (request, response, next) => {
    const newProduct = request.body;

    try {
        const updatedMerchant = await Merchant.findByIdAndUpdate(request.params.id, newProduct, { new: true });
        return response.status(204).json(updatedMerchant);
    } catch (exception) {
        next(exception);
    }
});

module.exports = merchantsRouter;
