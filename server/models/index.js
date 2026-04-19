const sequelize = require('../db');
const User = require('./User');
const Order = require('./Order');

// завдання 8: реалізація зв'язку one-to-many
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
