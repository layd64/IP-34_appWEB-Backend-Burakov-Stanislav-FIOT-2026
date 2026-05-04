const logger = require('../utils/logger');

function errorLogger(err, req, res, next) {
    logger.error({
        message: err.message || 'Внутрішня помилка сервера',
        stack: err.stack,
        method: req.method,
        url: req.url,
        status: err.status || 500
    });

    res.status(err.status || 500).json({ error: err.message || 'Внутрішня помилка сервера', code: err.status || 500 });
}

module.exports = errorLogger;
