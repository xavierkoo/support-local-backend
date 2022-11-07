const ordersRouter = require('express').Router();
const Order = require('../models/order');
const logger = require('../utils/logger');

// retrieve all order
ordersRouter.get('/', async (request, response) => {
    const orders = await Order
        .find({}).populate('user').populate('products');
    if (orders) {
        response.json(orders);
    } else {
        response.status(404).end();
    }
});

// retrieve specific order
ordersRouter.get('/:id', async (request, response) => {
    const order = await Order.findById(request.params.id);
    if (order) {
        response.json(order);
    } else {
        response.status(404).end();
    }
});

module.exports = ordersRouter;
