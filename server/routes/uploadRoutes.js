const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUpload');

// Task 5: Single file upload
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Файл не завантажено або недопустимий тип/розмір' });
    }
    res.json({ message: 'Файл успішно завантажено', file: req.file });
});

// Task 6: Multiple files upload
router.post('/upload-multiple', upload.array('files', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Файли не завантажено або недопустимий тип/розмір' });
    }
    res.json({ message: 'Файли успішно завантажено', files: req.files });
});

module.exports = router;
