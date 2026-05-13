const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Системні маршрути сервера
 */

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Статус сервера (uptime, пам'ять)
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Поточний стан сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: number
 *                   description: Час роботи сервера в секундах
 *                 memoryUsage:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/status', (req, res) => {
    res.json({
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

/**
 * @swagger
 * /error-test:
 *   get:
 *     summary: Тестовий маршрут для перевірки обробки помилок
 *     tags: [System]
 *     responses:
 *       500:
 *         description: Навмисна помилка для тестування middleware логування
 */
router.get('/error-test', (req, res, next) => {
    const error = new Error();
    next(error);
});


module.exports = router;

