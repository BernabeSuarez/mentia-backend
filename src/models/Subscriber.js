// src/models/Subscriber.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/databaseConnection.js';


export const Subscriber = sequelize.define('Subscriber', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre es obligatorio'
            },
            len: {
                args: [2, 100],
                msg: 'El nombre debe tener entre 2 y 100 caracteres'
            }
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
            msg: 'Este Email ya se encuentra suscrito'
        },
        validate: {
            isEmail: {
                msg: 'Debe ser un email válido'
            },
            notEmpty: {
                msg: 'El email es obligatorio'
            }
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'subscribers',
    timestamps: true, // createdAt, updatedAt
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

