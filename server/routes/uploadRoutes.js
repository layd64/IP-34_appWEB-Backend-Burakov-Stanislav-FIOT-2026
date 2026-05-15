const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUpload');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Завантаження файлів на сервер
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Завантажити один файл (тільки адмін)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Файл успішно завантажено, повертає url
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 url:
 *                   type: string
 *                   example: /uploads/1716000000000-cover.jpg
 *       400:
 *         description: Файл не завантажено або недопустимий тип/розмір
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — тільки для адміна
 */
router.post('/upload', authenticateToken, authorizeRole('admin'), upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Файл не завантажено або недопустимий тип/розмір' });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ message: 'Файл успішно завантажено', url, filename: req.file.filename });
});

/**
 * @swagger
 * /api/upload-multiple:
 *   post:
 *     summary: Завантажити декілька файлів (до 10, тільки адмін)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Файли успішно завантажено
 *       400:
 *         description: Файли не завантажено або недопустимий тип/розмір
 */
router.post('/upload-multiple', authenticateToken, authorizeRole('admin'), upload.array('files', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Файли не завантажено або недопустимий тип/розмір' });
    }
    const files = req.files.map(f => ({ url: `/uploads/${f.filename}`, filename: f.filename }));
    res.json({ message: 'Файли успішно завантажено', files });
});

module.exports = router;
