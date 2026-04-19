const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 5, // обмеження: 5 спроб
    message: { error: 'Забагато спроб входу. Спробуйте пізніше.' },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = { loginLimiter };
