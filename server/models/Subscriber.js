const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Subscriber = sequelize.define('Subscriber', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    interests: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    notifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    promotions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'Subscribers',
    timestamps: true,
});

module.exports = Subscriber;
