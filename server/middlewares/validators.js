const { body, validationResult } = require('express-validator');

const validateRegister = [
    body('username').notEmpty().withMessage('Ім\'я користувача обов\'язкове').isLength({ min: 3 }).withMessage('Мінімум 3 символи'),
    body('email').isEmail().withMessage('Некоректний формат email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль має містити щонайменше 6 символів'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Паролі не співпадають');
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

const validateLogin = [
    body('email').isEmail().withMessage('Некоректний формат email'),
    body('password').notEmpty().withMessage('Пароль обов\'язковий'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

const validatePasswordChange = [
    body('oldPassword').notEmpty().withMessage('Старий пароль обов\'язковий'),
    body('newPassword').isLength({ min: 6 }).withMessage('Новий пароль має містити щонайменше 6 символів'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

module.exports = { validateRegister, validateLogin, validatePasswordChange };
