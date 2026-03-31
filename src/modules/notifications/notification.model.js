const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Your shared DB config

const Notification = sequelize.define('Notification', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // This will link to Toria's User ID later
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    type: {
        type: DataTypes.ENUM('assignment', 'enrollment', 'system', 'auth'),
        defaultValue: 'system'
    }
}, {
    timestamps: true
});

module.exports = Notification;