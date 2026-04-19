const { Sequelize } = require('sequelize');

// підключення до бд через змінні середовища
const sequelize = new Sequelize(
    process.env.DB_NAME || 'web_backend_lab',
    process.env.DB_USER || 'root',
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false, // вимкнути логування sql-запитів у консоль
    }
);

module.exports = sequelize;
