const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// Завдання 7: Створення моделі Order
const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    }
    // user_id буде додано автоматично через зв'язок
}, {
    tableName: 'orders',
    timestamps: true // Додасть createdAt і updatedAt для замовлень
});

module.exports = Order;
