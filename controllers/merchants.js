const merchantsRouter = require('express').Router();
const Merchant = require('../models/merchant');
const logger = require('../utils/logger');

merchantsRouter.get('/', async (request, response) => {
    const merchants = await Merchant;
    if (merchants) {
        response.json(merchants);
    } else {
        response.status(404).end();
    }
});

module.exports = merchantsRouter;
