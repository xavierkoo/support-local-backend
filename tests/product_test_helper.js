const Product = require('../models/product');

const initialProducts = [
    {
        id: '635abd38b01737e727fb4b38',
        name: 'Bread',
        price: 50,
        specialPrice: 80,
        category: 'Food',
        rating: 3,
        imgUrl: 'assets/img/products/bread.avif',
        numberSold: 10,
        productDesc: 'Delicious Bread',
        productSpec: 'Wholemeal',
        merchant: '635abc7fb01737e727fb4b36',
        reviews: [],
    },

    {
        id: '635abd38b01737e727fb4b38',
        name: 'Egg',
        price: 50,
        specialPrice: 80,
        category: 'Food',
        rating: 3,
        imgUrl: 'assets/img/products/egg.avif',
        numberSold: 10,
        productDesc: 'Delicious Egg',
        productSpec: 'Farm Fresh',
        merchant: '635abc7fb01737e727fb4b36',
        reviews: [],
    },
];

const productsInDb = async () => {
    const products = await Product.find({});
    return products.map((product) => product.toJSON());
};

module.exports = {
    initialProducts, productsInDb,
};
