const cartsRouter = require('express').Router();
const Cart = require('../models/cart');
const logger = require('../utils/logger')

cartsRouter.get('/', async (request, response) => {
    const carts = await Cart
        .find({}).populate('user');
    if (carts) {
        response.json(carts);
    } else {
        response.status(404).end();
    }
});

cartsRouter.get('/:id', async (request, response) => {
    const cart = await Cart.findById(request.params.id);
    if (cart) {
        response.json(cart);
    } else {
        response.status(404).end();
    }
});

cartsRouter.post('/', async (request, response, next) => {
    const {
        productId, quantity, name, price,
    } = request.body;
    const userId = '635ac046b01737e727fb4b42'; // TODO: Not hardcode the userId when log in works

    try {
        const cart = await Cart.findOne({ userId });

        if (cart) {
            // cart exists for user
            const itemIndex = cart.products.findIndex(p => p.productId == productId);

            if (itemIndex > -1) {
            // product exists in the cart, update the quantity
            let productItem = cart.products[itemIndex];
            productItem.quantity = quantity;
            cart.products[itemIndex] = productItem;
            } else {
            // product does not exists in cart, add new item
            cart.products.push({ productId, quantity, name, price });
            }
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            // no cart for user, create new cart
            const newCart = await Cart.create({
            userId,
            products: [{ productId, quantity, name, price }]
            });

            return res.status(201).send(newCart);
        }
        } catch (exception) {
        next(exception)
        }
});