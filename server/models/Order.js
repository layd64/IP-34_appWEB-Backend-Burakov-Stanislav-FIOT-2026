const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// завдання 7: створення моделі order
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
    timestamps: true // додасть createdat і updatedat для замовлень
});

module.exports = Order;
