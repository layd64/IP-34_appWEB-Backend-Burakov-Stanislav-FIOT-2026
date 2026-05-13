const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateTokens } = require('../controllers/authController');

const { register, login, logout, refreshToken, confirmEmail, forgotPassword, resetPassword, renderResetPasswordPage } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validators');
const { loginLimiter } = require('../middlewares/rateLimiter');
const authenticateToken = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Автентифікація та авторизація користувачів
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, confirmPassword]
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: TestUser
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               confirmPassword:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Користувача успішно зареєстровано
 *       400:
 *         description: Помилка валідації (короткий пароль, паролі не співпадають тощо)
 *       409:
 *         description: Користувач з таким email вже існує
 */
router.post('/register', validateRegister, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вхід користувача (JWT)
 *     tags: [Auth]
 *     description: Повертає accessToken і refreshToken. Rate limit — 5 спроб за 15 хвилин.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@admin.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Успішний вхід
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Помилка валідації
 *       401:
 *         description: Невірний email або пароль
 *       429:
 *         description: Забагато спроб входу (rate limit)
 */
router.post('/login', loginLimiter, validateLogin, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Вихід із системи (інвалідація refreshToken)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успішний вихід
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authenticateToken, logout);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Оновити accessToken через refreshToken
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *                 description: Refresh token
 *     responses:
 *       200:
 *         description: Новий accessToken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token відсутній або невалідний
 *       403:
 *         description: Refresh token прострочений
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /api/auth/confirm/{token}:
 *   get:
 *     summary: Підтвердження email після реєстрації
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Токен підтвердження з листа
 *     responses:
 *       200:
 *         description: Email підтверджено
 *       400:
 *         description: Недійсний або прострочений токен
 */
router.get('/confirm/:token', confirmEmail);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Запит на відновлення пароля (відправка листа)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Лист для відновлення пароля надіслано
 *       404:
 *         description: Користувача з таким email не знайдено
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Встановити новий пароль за токеном відновлення
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Пароль успішно змінено
 *       400:
 *         description: Недійсний або прострочений токен
 */
router.get('/reset/:token', renderResetPasswordPage);
router.post('/reset-password/:token', resetPassword);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Вхід через Google OAuth2
 *     tags: [Auth]
 *     description: Перенаправляє на сторінку авторизації Google. Використовується через браузер, не через Swagger.
 *     responses:
 *       302:
 *         description: Перенаправлення на Google
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), async (req, res) => {
    try {
        const user = req.user;
        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();
        
        // відправляємо токен на фронтенд через повідомлення у вікно-попап
        res.send(`
            <script>
                if (window.opener) {
                    window.opener.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS', token: '${tokens.accessToken}' }, '*');
                    window.close();
                } else {
                    document.write('Успішний вхід. Будь ласка, закрийте це вікно.');
                }
            </script>
        `);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
