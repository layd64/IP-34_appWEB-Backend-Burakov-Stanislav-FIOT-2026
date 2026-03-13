const { Sequelize } = require('sequelize');

// підключення до бд
const sequelize = new Sequelize('web_backend_lab', 'root', '84758475', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // вимкнути логування SQL-запитів у консоль
});

module.exports = sequelize;
