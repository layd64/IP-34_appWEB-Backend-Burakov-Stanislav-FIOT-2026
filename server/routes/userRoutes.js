const express = require('express');
const router = express.Router();

const { getProfile, updateProfile, changePassword, deleteAccount, getAllUsers, deleteUserByAdmin, createUser, createOrder } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');
const { validatePasswordChange } = require('../middlewares/validators');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управління профілями користувачів
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Отримати профіль поточного користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профіль користувача
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [user, admin]
 *       401:
 *         description: Unauthorized — токен відсутній або недійсний
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Оновити профіль поточного користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: NewName
 *               phone:
 *                 type: string
 *                 example: "+380501234567"
 *               address:
 *                 type: string
 *                 example: Kyiv, Ukraine
 *     responses:
 *       200:
 *         description: Профіль оновлено
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authenticateToken, updateProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Змінити пароль поточного користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: password123
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: newpassword456
 *     responses:
 *       200:
 *         description: Пароль успішно змінено
 *       400:
 *         description: Невірний старий пароль або помилка валідації
 *       401:
 *         description: Unauthorized
 */
router.post('/change-password', authenticateToken, validatePasswordChange, changePassword);

/**
 * @swagger
 * /api/users/profile:
 *   delete:
 *     summary: Видалити власний акаунт
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Акаунт видалено
 *       401:
 *         description: Unauthorized
 */
router.delete('/profile', authenticateToken, deleteAccount);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Отримати список усіх користувачів (тільки адмін)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список користувачів
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — доступ тільки для адміна
 */
router.get('/', authenticateToken, authorizeRole('admin'), getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Видалити користувача за ID (тільки адмін)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID користувача
 *     responses:
 *       200:
 *         description: Користувача видалено
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Користувача не знайдено
 */
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteUserByAdmin);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Створити нового користувача (без авторизації)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Користувача створено
 */
router.post('/', createUser);

/**
 * @swagger
 * /api/users/{userId}/orders:
 *   post:
 *     summary: Створити замовлення для користувача
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Замовлення створено
 *       404:
 *         description: Користувача не знайдено
 */
router.post('/:userId/orders', createOrder);

module.exports = router;

