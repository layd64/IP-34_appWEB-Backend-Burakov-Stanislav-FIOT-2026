const fs = require('fs');
const path = require('path');

function errorLogger(err, req, res, next) {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${err.stack || err.message}\n`;
    const logDir = path.join(__dirname, '../logs');
    const logPath = path.join(logDir, 'error.log');
    
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    
    fs.appendFile(logPath, logMessage, (fsErr) => {
        if (fsErr) console.error('Помилка запису в лог-файл:', fsErr);
    });

    res.status(err.status || 500).json({ error: err.message || 'Внутрішня помилка сервера' });
}

module.exports = errorLogger;
