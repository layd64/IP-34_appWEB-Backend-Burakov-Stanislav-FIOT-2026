const express = require('express');
const router = express.Router();
const { getReviewsByBookId, addReview, deleteReview } = require('../controllers/reviewController');
const authenticateToken = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Керування відгуками до книг
 */

/**
 * @swagger
 * /api/reviews/book/{bookId}:
 *   get:
 *     summary: Отримати відгуки для певної книги
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список відгуків
 */
router.get('/book/:bookId', getReviewsByBookId);

/**
 * @swagger
 * /api/reviews/book/{bookId}:
 *   post:
 *     summary: Додати відгук до книги
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, text]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Відгук додано
 *       400:
 *         description: Ви вже залишили відгук
 *       401:
 *         description: Не авторизовано
 */
router.post('/book/:bookId', authenticateToken, addReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Видалити відгук
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Відгук видалено
 *       403:
 *         description: Ви можете видаляти тільки свої відгуки
 */
router.delete('/:id', authenticateToken, deleteReview);

module.exports = router;
