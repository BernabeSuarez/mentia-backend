// models/User.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/databaseConnection.js';

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            msg: 'El nombre de usuario ya está en uso'
        },
        validate: {
            notEmpty: {
                msg: 'El nombre de usuario es requerido'
            },
            len: {
                args: [3, 100],
                msg: 'El nombre de usuario debe tener entre 3 y 100 caracteres'
            },
            isAlphanumeric: {
                msg: 'El nombre de usuario solo puede contener letras y números'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña es requerida'
            },
            len: {
                args: [6, 255],
                msg: 'La contraseña debe tener al menos 6 caracteres'
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            msg: 'El email ya está registrado'
        },
        validate: {
            notEmpty: {
                msg: 'El email es requerido'
            },
            isEmail: {
                msg: 'Debe ser un email válido'
            }
        }
    },
    firstname: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            notEmpty: {
                msg: 'El nombre es requerido'
            }
        }
    },
    lastname: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            notEmpty: {
                msg: 'El apellido es requerido'
            }
        }
    },
    city: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(2),
        allowNull: true,
        defaultValue: 'ES',
        validate: {
            len: {
                args: [2, 2],
                msg: 'El código de país debe tener 2 caracteres'
            }
        }
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: {
                args: /^[0-9+\-() ]*$/,
                msg: 'El teléfono solo puede contener números y los caracteres + - ( )'
            }
        }
    },
    institution: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    department: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    lang: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'es'
    },
    timezone: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'Europe/Madrid'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    suspended: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {
    tableName: 'usuarios_externos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

// Método para nombre completo
User.prototype.getFullName = function () {
    return `${this.firstname} ${this.lastname}`;
};

// Excluir password en JSON
User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
};

User.associate = function (models) {
    User.hasOne(models.Subscription, {
        foreignKey: 'user_id',
        as: 'subscription'
    });
};
