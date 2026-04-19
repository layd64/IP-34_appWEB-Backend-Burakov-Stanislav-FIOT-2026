const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMail } = require('../services/mailService');

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Користувач з таким email вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const confirmationToken = crypto.randomBytes(32).toString('hex');

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            confirmationToken,
            isEmailConfirmed: false // тепер потрібне реальне підтвердження
        });

        // відправляємо email (перехоплюємо помилки, щоб не переривати реєстрацію)
        const confirmUrl = `http://localhost:3000/api/auth/confirm/${confirmationToken}`;
        try {
            await sendMail(email, 'Підтвердження Email', `<p>Для підтвердження пошти перейдіть за посиланням: <a href="${confirmUrl}">${confirmUrl}</a></p>`);
            console.log('Лист з підтвердженням відправлено на:', email);
        } catch (mailErr) {
            console.log('\n=======================================');
            console.error('Помилка відправки листа! Лінк для локального підтвердження:', confirmUrl);
            console.log('=======================================\n');
        }

        res.status(201).json({ message: 'Реєстрація успішна!' });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Невірний email або пароль' });
        }

        if (!user.password) {
            return res.status(400).json({ error: 'Увійдіть через Google' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Невірний email або пароль' });
        }

        if (!user.isEmailConfirmed) {
            return res.status(403).json({ error: 'Будь ласка, підтвердіть ваш email перед входом' });
        }

        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json(tokens);
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.json({ message: 'Успішний вихід' });
    } catch (err) {
        next(err);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ error: 'Refresh Token обовʼязковий' });

        jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh_secret_key', async (err, decoded) => {
            if (err) return res.status(403).json({ error: 'Недійсний Refresh Token' });

            const user = await User.findByPk(decoded.id);
            if (!user || user.refreshToken !== token) {
                return res.status(403).json({ error: 'Недійсний Refresh Token' });
            }

            const tokens = generateTokens(user);
            user.refreshToken = tokens.refreshToken;
            await user.save();

            res.json(tokens);
        });
    } catch (err) {
        next(err);
    }
};

const confirmEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ where: { confirmationToken: token } });

        if (!user) {
            return res.status(400).json({ error: 'Недійсний токен' });
        }

        user.isEmailConfirmed = true;
        user.confirmationToken = null;
        await user.save();

        res.send(`
            <!DOCTYPE html>
            <html lang="uk">
            <head>
                <meta charset="UTF-8">
                <title>Email підтверджено</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; border-radius: 0 !important; }
                    html { font-size: 16px; height: 100%; }
                    body { font-family: 'Inter', sans-serif; background-color: #FFF6E8; color: #000000; line-height: 1.6; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
                    .card { background: white; padding: 2.5rem; box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1); text-align: center; width: 100%; max-width: 40rem; }
                    .icon { font-size: 3.75rem; margin-bottom: 1.25rem; }
                    h1 { color: #000000; font-size: 2.25rem; font-weight: bold; margin-bottom: 0.625rem; }
                    p { color: #000000; font-size: 1.125rem; line-height: 1.6; margin-bottom: 0.625rem; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="icon">✅</div>
                    <h1>Email підтверджено!</h1>
                    <p>Дякуємо, вашу електронну пошту успішно перевірено.</p>
                    <p>Ви можете закрити цю вкладку та повернутися до магазину, щоб увійти у свій обліковий запис.</p>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        next(err);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'Користувача не знайдено' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 година
        await user.save();

        const resetUrl = `http://localhost:3000/api/auth/reset/${resetToken}`;
        try {
            await sendMail(email, 'Відновлення пароля', `<p>Для відновлення перейдіть за посиланням (діє 1 годину): <a href="${resetUrl}">${resetUrl}</a></p>`);
        } catch (mailErr) {
            console.log('Лінк для відновлення (оскільки email не працює):', resetUrl);
        }

        res.json({ message: 'Якщо email існує, ви отримаєте лист. (Див. консоль для лінку)' });
    } catch (err) {
        next(err);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({ where: { resetPasswordToken: token } });

        if (!user || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ error: 'Токен недійсний або його час минув' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: 'Пароль успішно змінено' });
    } catch (err) {
        next(err);
    }
};

const renderResetPasswordPage = async (req, res, next) => {
    try {
        const { token } = req.params;
        res.send(`
            <!DOCTYPE html>
            <html lang="uk">
            <head>
                <meta charset="UTF-8">
                <title>Відновлення пароля</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; border-radius: 0 !important; }
                    html { font-size: 16px; height: 100%; }
                    body { font-family: 'Inter', sans-serif; background-color: #FFF6E8; color: #000000; line-height: 1.6; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
                    .card { background: white; padding: 2.5rem; box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1); width: 100%; max-width: 30rem; text-align: center; }
                    input { width: 100%; padding: 0.75rem; margin-top: 0.9375rem; margin-bottom: 1.25rem; border: 0.0625rem solid #4b4b4bff; font-size: 1rem; background-color: white; color: #000000; }
                    input::placeholder { color: #4b4b4bff; }
                    button { width: 100%; display: inline-block; background-color: #F7A823; color: white; padding: 0.9375rem 1.875rem; border: none; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background-color 0.3s ease; position: relative; z-index: 2; }
                    button:hover { background-color: #e6951f; }
                    h1 { color: #000000; font-size: 2.25rem; font-weight: bold; margin-top: 0; margin-bottom: 0.625rem; }
                    p { color: #000000; font-size: 1.125rem; margin-bottom: 0; line-height: 1.6; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>Новий пароль</h1>
                    <p>Введіть новий пароль для вашого акаунту</p>
                    <input type="password" id="newPassword" placeholder="Мінімум 6 символів" required minlength="6">
                    <button onclick="submitNewPassword()">Зберегти новий пароль</button>
                    <p id="msg" style="margin-top:1.25rem; font-weight:bold; color:#000000; font-size: 1.125rem;"></p>
                </div>
                <script>
                    async function submitNewPassword() {
                        const pwd = document.getElementById('newPassword').value;
                        if(pwd.length < 6) return alert('Пароль має бути не коротше 6 символів');
                        try {
                            const res = await fetch('/api/auth/reset-password/${token}', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ newPassword: pwd })
                            });
                            const data = await res.json();
                            if(res.ok) {
                                document.getElementById('msg').innerText = data.message + '. Тепер вкладку можна закрити!';
                            } else {
                                document.getElementById('msg').innerText = 'Помилка: ' + data.error;
                            }
                        } catch(e) {
                            alert('Помилка з\\'єднання з сервером');
                        }
                    }
                </script>
            </body>
            </html>
        `);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    logout,
    refreshToken,
    confirmEmail,
    forgotPassword,
    resetPassword,
    renderResetPasswordPage,
    generateTokens
};
