const sequelize = require('../db');
const User = require('./User');
const Order = require('./Order');

// Завдання 8: Реалізація зв'язку One-to-Many
User.hasMany(Order, {
    foreignKey: 'user_id',
    as: 'orders',
    onDelete: 'CASCADE'
});

Order.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

module.exports = {
    sequelize,
    User,
    Order
};
