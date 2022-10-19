// import required modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');

const app = express();

// import controllers
const merchantsRouter = require('./controllers/merchants');
const usersRouter = require('./controllers/users');
const reviewsRouter = require('./controllers/reviews');
// const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

logger.info('connecting to', config.MONGODB_URI);

// connect to mongodb
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message);
    });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

// use routers
app.use('/api/users', usersRouter);
app.use('/api/merchants', merchantsRouter);
app.use('/api/reviews', reviewsRouter);
// app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
