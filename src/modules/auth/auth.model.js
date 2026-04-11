const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 


const User = sequelize.define('User', {
    name: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('learner', 'instructor', 'admin'),
        defaultValue: 'learner'
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    tableName: 'users'
});

module.exports = User;