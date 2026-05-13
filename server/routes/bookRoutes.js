const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getBooks, getBookById, createBook, updateBook, deleteBook, seedBooks } = require('../controllers/bookController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

const bookValidation = [
    body('title').notEmpty().withMessage('Назва книги обовʼязкова').isLength({ min: 2 }),
    body('author').notEmpty().withMessage('Автор обовʼязковий'),
    body('genre').notEmpty().withMessage('Жанр обовʼязковий'),
    body('price').isNumeric().withMessage('Ціна має бути числом').isFloat({ min: 0 }),
];

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API для управління книгами книжкового магазину
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Отримати список книг (з Redis-кешуванням)
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Фільтр за жанром
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Пошук за назвою або автором
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Список книг
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source:
 *                   type: string
 *                   example: cache
 *                 data:
 *                   type: object
 */
router.get('/', getBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Отримати книгу за ID (з Redis-кешуванням)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Книга знайдена
 *       404:
 *         description: Книгу не знайдено
 */
router.get('/:id', getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Додати нову книгу (тільки адмін)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, author, genre, price]
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               price:
 *                 type: number
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Книгу створено
 *       400:
 *         description: Помилка валідації
 *       403:
 *         description: Доступ заборонено
 */
router.post('/', authenticateToken, authorizeRole('admin'), bookValidation, createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Оновити книгу (тільки адмін)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Книгу оновлено
 *       404:
 *         description: Книгу не знайдено
 */
router.put('/:id', authenticateToken, authorizeRole('admin'), updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Видалити книгу (тільки адмін)
 *     tags: [Books]
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
 *         description: Книгу видалено
 *       404:
 *         description: Книгу не знайдено
 */
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteBook);

/**
 * @swagger
 * /api/books/seed:
 *   post:
 *     summary: Заповнити БД тестовими книгами (тільки адмін)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Книги додано
 *       200:
 *         description: Seed вже виконувався
 */
router.post('/seed', authenticateToken, authorizeRole('admin'), seedBooks);

module.exports = router;
