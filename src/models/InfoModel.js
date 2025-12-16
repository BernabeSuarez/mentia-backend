// models/Contact.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/databaseConnection.js';

export const InfoContact = sequelize.define('Contact', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre es requerido'
            },
            len: {
                args: [2, 100],
                msg: 'El nombre debe tener entre 2 y 100 caracteres'
            }
        }
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El email es requerido'
            },
            isEmail: {
                msg: 'Debe ser un email válido'
            }
        }
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: {
                args: /^[0-9+\-() ]*$/,
                msg: 'El teléfono solo puede contener números y los caracteres + - ( )'
            }
        }
    },
    asignatura: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La asignatura es requerida'
            },
            len: {
                args: [2, 50],
                msg: 'El asignatura debe tener entre 2 y 50 caracteres'
            }
        }
    },
}, {
    tableName: 'infoContact',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

