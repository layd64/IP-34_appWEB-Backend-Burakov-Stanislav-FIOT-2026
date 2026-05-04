const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
    res.json({
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
