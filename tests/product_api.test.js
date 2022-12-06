const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./product_test_helper');
const app = require('../app');

const api = supertest(app);

const Product = require('../models/product');

beforeEach(async () => {
    await Product.deleteMany({});

    const productObjects = helper.initialProducts
        .map((product) => new Product(product));

    const promiseArray = productObjects.map((product) => product.save());

    await Promise.all(promiseArray);
});

describe('initial products in database', () => {
    test('products are returned as json', async () => {
        await api
            .get('/api/products')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    }, 100000);

    test('all products are returned', async () => {
        const response = await api
            .get('/api/products');

        expect(response.body).toHaveLength(helper.initialProducts.length);
    });

    test('a specific product is within the returned products', async () => {
        const response = await api
            .get('/api/products');

        const names = response.body.map((n) => n.name);
        expect(names).toContain(
            'Bread',
        );
    });

    test('a specific product can be viewed', async () => {
        const productsAtStart = await helper.productsInDb();

        const productToView =productsAtStart[0];

        const resultProduct = await api
            .get(`/api/products/${productToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const processedProductToView = JSON.parse(JSON.stringify(productToView));

        expect(resultProduct.body).toEqual(processedProductToView);
    });

    test('unique identifier by default is _id', async () => {
        const productsAtStart = await helper.productsInDb();
        expect(productsAtStart[0].id).toBeDefined();
    });
});

describe('adding a product', () => {
    test('a valid product can be added', async () => {
        const newProduct = {
            id: '615abd38b01737e327fb4a38',
            name: 'Noodles',
            price: 50,
            specialPrice: 80,
            category: 'Food',
            rating: 3,
            imgUrl: 'assets/img/products/noodles.avif',
            numberSold: 10,
            productDesc: 'Delicious Bread',
            productSpec: 'Wholemeal',
            merchant: '635abc7fb01737e727fb4b36',
            reviews: [],
        };

        await api
            .post('/api/products')
            .send(newProduct)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const productsAtEnd = await helper.productsInDb();
        expect(productsAtEnd).toHaveLength(helper.initialProducts.length + 1);

        const names = productsAtEnd.map((n) => n.name);
        expect(names).toContain(
            'Noodles',
        );
    });

    test('product without content is not added', async () => {
        const newProduct = {
            numberSold: 10,
            productDesc: 'Delicious Bread',
        };

        await api
            .post('/api/products')
            .send(newProduct)
            .expect(400);

        const productsAtEnd = await helper.productsInDb();

        expect(productsAtEnd).toHaveLength(helper.initialProducts.length);
    });
});

describe('updating a product', () => {
    test('updating product fields', async () => {
        const productsAtStart = await helper.productsInDb();
        const productToUpdate = productsAtStart[productsAtStart.length - 1];
        const updatedProduct = {
            rating: 2,
        };
        await api
            .patch(`/api/product/${productToUpdate.id}`)
            .send(updatedProduct)
            .expect(204);

        const productsAtEnd = await helper.productsInDb();
        const aProductAtEnd = productsAtEnd.find((b) => b.id === productToUpdate.id);
        expect(aProductAtEnd.products).toBe(2);
    });

    test('updating product reviews', async () => {
        const productsAtStart = await helper.productsInDb();
        const productToUpdate = productsAtStart[productsAtStart.length - 1];
        const updatedProduct = {
            reviews: ['615abd38b01737e327fb4a38'],
        };
        await api
            .patch(`/api/product/${productToUpdate.id}`)
            .send(updatedProduct)
            .expect(204);

        const productsAtEnd = await helper.productsInDb();
        const aProductAtEnd = productsAtEnd.find((b) => b.id === productToUpdate.id);
        expect(aProductAtEnd.products).toHaveSize(0);
    });
});

describe('deleting a product', () => {
    test('a product can be deleted', async () => {
        const productsAtStart = await helper.productsInDb();
        const productToDelete = productsAtStart[productsAtStart.length - 1];
        await api
            .delete(`/api/products/${productToDelete.id}`)
            .expect(204);

        const productsAtEnd = await helper.productsInDb();

        expect(productsAtEnd).toHaveLength(
            productsAtStart.length - 1,
        );

        const names = productsAtEnd.map((n) => n.name);

        expect(names).not.toContain(productToDelete.name);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
