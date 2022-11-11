const logger = require('./logger');

// logger middleware
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);
    logger.info('---');
    next();
};

// unknown endpoint respond with error code 404
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

// error handling
const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token',
        });
    } if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired',
        });
    }

    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    // tokenExtractor,
    // userExtractor,
    errorHandler,
};
