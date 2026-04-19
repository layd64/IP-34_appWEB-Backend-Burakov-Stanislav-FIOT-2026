const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateTokens } = require('../controllers/authController');

const { register, login, logout, refreshToken, confirmEmail, forgotPassword, resetPassword, renderResetPasswordPage } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validators');
const { loginLimiter } = require('../middlewares/rateLimiter');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/register', validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);
router.post('/logout', authenticateToken, logout);
router.post('/refresh', refreshToken);

router.get('/confirm/:token', confirmEmail);
router.post('/forgot-password', forgotPassword);
router.get('/reset/:token', renderResetPasswordPage);
router.post('/reset-password/:token', resetPassword);

// маршрути oauth google
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
