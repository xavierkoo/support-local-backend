const Order = require('../models/order');

const initialOrders = [
    {
        _id: '636a934c6f2e2619dcfbd419',
        user: '6366b3bea4f920b75c825f36',
        orderDate: '09/11/2022',
        orderStatus: 'Item Received!',
        deliveryDate: '16/11/2022',
        products: [],
    },

    {
        _id: '636a934c6f2e2619dcfbd419',
        user: '6366b3bea4f920b75c825f36',
        orderDate: '29/11/2022',
        orderStatus: 'Item Received!',
        deliveryDate: '11/11/2022',
        products: [],
    },
];

const ordersInDb = async () => {
    const orders = await Order.find({});
    return orders.map((order) => order.toJSON());
};

module.exports = {
    initialOrders, ordersInDb,
};
