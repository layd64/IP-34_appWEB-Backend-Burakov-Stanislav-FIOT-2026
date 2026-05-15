const { Sequelize } = require('sequelize');

// підключення до бд через змінні середовища
const sequelize = process.env.DB_URI 
    ? new Sequelize(process.env.DB_URI, {
        dialect: 'mysql',
        logging: false,
        dialectOptions: process.env.DB_URI.includes('aivencloud') ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {}
    })
    : new Sequelize(
        process.env.DB_NAME || 'web_backend_lab',
        process.env.DB_USER || 'root',
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
            dialect: 'mysql',
            logging: false,
            dialectOptions: process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud') ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {}
        }
    );

module.exports = sequelize;
