const merchantsRouter = require('express').Router();
const Merchant = require('../models/merchant');
const logger = require('../utils/logger');

merchantsRouter.get('/', async (request, response) => {
    const merchants = await Merchant
        .find({}).populate('products');
    if (merchants) {
        response.json(merchants);
    } else {
        response.status(404).end();
    }
});

merchantsRouter.get('/:id', async (request, response) => {
    const merchant = await Merchant.findById(request.params.id);
    if (merchant) {
        response.json(merchant);
    } else {
        response.status(404).end();
    }
});

module.exports = merchantsRouter;
