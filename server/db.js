const { Sequelize } = require('sequelize');

// підключення до бд через змінні середовища
const sequelize = new Sequelize(
    process.env.DB_NAME || 'web_backend_lab',
    process.env.DB_USER || 'root',
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false, // вимкнути логування sql-запитів у консоль
        dialectOptions: process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud') ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {}
    }
);

module.exports = sequelize;
