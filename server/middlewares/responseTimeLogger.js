const logger = require('../utils/logger');

function responseTimeLogger(req, res, next) {
    const start = process.hrtime();

    res.on('finish', () => {
        const diff = process.hrtime(start);
        const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
        
        logger.info({
            message: 'Request processed',
            method: req.method,
            url: req.url,
            responseTimeMs: timeInMs,
            status: res.statusCode
        });
    });

    next();
}

module.exports = responseTimeLogger;
