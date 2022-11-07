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

// add new order
ordersRouter.post('/', async (request, response, next) => {
    const { body } = request;

    const order = new Order({
        user: body.user,
        orderDate: body.orderDate,
        orderStatus: body.orderStatus,
        products: body.products,
        deliveryDate: body.deliveryDate,
    });
    try {
        const savedOrder = await order.save();
        logger.info(`added order ${order.id} to reviews`);
        response.status(201).json(savedOrder);
    } catch (exception) {
        next(exception);
    }
});

module.exports = ordersRouter;
