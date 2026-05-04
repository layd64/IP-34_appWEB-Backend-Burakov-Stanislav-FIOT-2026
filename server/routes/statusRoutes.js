const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
    res.json({
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

router.get('/error-test', (req, res, next) => {
    const error = new Error();
    next(error);
});


module.exports = router;
