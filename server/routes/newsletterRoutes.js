const express = require('express');
const router = express.Router();
const { Subscriber } = require('../models');
const { sendMail } = require('../services/mailService');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Newsletter
 *   description: Управління підписками на розсилку
 */

/**
 * @swagger
 * /api/newsletter/subscribe:
 *   post:
 *     summary: Підписатися на розсилку
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               interests:
 *                 type: string
 *               notifications:
 *                 type: boolean
 *               promotions:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Успішно підписано
 *       400:
 *         description: Помилка або вже підписано
 */
router.post('/subscribe', async (req, res) => {
    try {
        const { name, email, interests, notifications, promotions } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Ім\'я та email обов\'язкові' });
        }

        const existing = await Subscriber.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Цей email вже підписаний на розсилку' });
        }

        const subscriber = await Subscriber.create({
            name,
            email,
            interests,
            notifications: notifications || false,
            promotions: promotions || false
        });

        // Надсилаємо привітальний лист
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #F7A823; text-align: center;">BookStore Pro</h2>
                <h3>Привіт, ${name}!</h3>
                <p>Дякуємо за підписку на нашу розсилку!</p>
                <p>Відтепер ви будете першими дізнаватися про наші новинки, акції та спеціальні пропозиції у світі книг.</p>
                ${interests && interests !== 'Всі жанри' ? `<p>Ми звернули увагу, що вас цікавить: <strong>${interests}</strong>. Ми намагатимемося надсилати вам більше цікавого саме з цієї категорії!</p>` : ''}
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #777; text-align: center;">Ви отримали цей лист, оскільки підписалися на розсилку на сайті BookStore Pro.</p>
            </div>
        `;

        await sendMail(email, 'Ласкаво просимо до розсилки BookStore Pro!', html);

        res.json({ message: 'Ви успішно підписалися на розсилку!' });
    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        res.status(500).json({ error: 'Помилка сервера при підписці' });
    }
});

/**
 * @swagger
 * /api/newsletter/send:
 *   post:
 *     summary: Надіслати лист усім підписникам (тільки адмін)
 *     tags: [Newsletter]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               messageHtml:
 *                 type: string
 *     responses:
 *       200:
 *         description: Листи успішно надіслано
 */
router.post('/send', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const { subject, messageHtml } = req.body;

        if (!subject || !messageHtml) {
            return res.status(400).json({ error: 'Тема та повідомлення обов\'язкові' });
        }

        const subscribers = await Subscriber.findAll();
        
        if (subscribers.length === 0) {
            return res.status(400).json({ error: 'Немає підписників для розсилки' });
        }

        // Відправляємо листи паралельно (в реальному проекті краще використовувати черги типу Bull)
        const sendPromises = subscribers.map(sub => {
            const personalizedHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <p>Привіт, ${sub.name}!</p>
                    ${messageHtml}
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777; text-align: center;">Ви отримали цей лист, оскільки підписалися на розсилку на сайті BookStore Pro.</p>
                </div>
            `;
            return sendMail(sub.email, subject, personalizedHtml);
        });

        await Promise.allSettled(sendPromises);

        res.json({ message: `Розсилку успішно надіслано ${subscribers.length} підписникам!` });
    } catch (error) {
        console.error('Newsletter send error:', error);
        res.status(500).json({ error: 'Помилка сервера при розсилці' });
    }
});

module.exports = router;
