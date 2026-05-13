const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUpload');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Завантаження файлів на сервер
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Завантажити один файл
 *     tags: [Upload]
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
 *         description: Файл успішно завантажено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 file:
 *                   type: object
 *       400:
 *         description: Файл не завантажено або недопустимий тип/розмір
 */
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Файл не завантажено або недопустимий тип/розмір' });
    }
    res.json({ message: 'Файл успішно завантажено', file: req.file });
});

/**
 * @swagger
 * /upload-multiple:
 *   post:
 *     summary: Завантажити декілька файлів (до 10)
 *     tags: [Upload]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 files:
 *                   type: array
 *       400:
 *         description: Файли не завантажено або недопустимий тип/розмір
 */
router.post('/upload-multiple', upload.array('files', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Файли не завантажено або недопустимий тип/розмір' });
    }
    res.json({ message: 'Файли успішно завантажено', files: req.files });
});

module.exports = router;

