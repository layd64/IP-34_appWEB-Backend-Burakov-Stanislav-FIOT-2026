const nodemailer = require('nodemailer');

// налаштування пошти (підтримує і gmail, і ethereal)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true для 465, false для 587
    auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER, // пріоритет на вашу реальну пошту
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
    }
});

async function sendMail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: '"Bookstore API" <no-reply@bookstore.com>',
            to,
            subject,
            html
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Помилка відправки листа:', error);
        throw error;
    }
}

module.exports = { sendMail };
