const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// завдання 7: створення моделі user
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true // null для oauth
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user' // 'user' або 'admin'
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isEmailConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    confirmationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    googleId: {
       type: DataTypes.STRING,
       allowNull: true,
       unique: true
    }
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User;
