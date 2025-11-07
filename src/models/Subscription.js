// models/Subscription.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/databaseConnection.js';
import { User } from './User.js';

export const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,   // <--- directo el modelo
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    stripe_customer_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'ID del cliente en Stripe'
    },
    stripe_subscription_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        comment: 'ID de la suscripción en Stripe'
    },
    stripe_price_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'ID del precio/plan en Stripe'
    },
    stripe_product_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'ID del producto en Stripe'
    },
    status: {
        type: DataTypes.ENUM(
            'incomplete',
            'incomplete_expired',
            'trialing',
            'active',
            'past_due',
            'canceled',
            'unpaid'
        ),
        allowNull: false,
        defaultValue: 'incomplete',
        comment: 'Estado de la suscripción en Stripe'
    },
    plan_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Nombre del plan (Basic, Pro, Enterprise, etc.)'
    },
    plan_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Monto del plan'
    },
    plan_currency: {
        type: DataTypes.STRING(3),
        allowNull: true,
        defaultValue: 'usd',
        comment: 'Moneda del plan'
    },
    plan_interval: {
        type: DataTypes.ENUM('day', 'week', 'month', 'year'),
        allowNull: true,
        comment: 'Intervalo de cobro'
    },
    current_period_start: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Inicio del período actual'
    },
    current_period_end: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fin del período actual'
    },
    trial_start: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Inicio del período de prueba'
    },
    trial_end: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fin del período de prueba'
    },
    canceled_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha de cancelación'
    },
    ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha de finalización'
    },
    cancel_at_period_end: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Si se cancelará al final del período'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Metadata adicional'
    }
}, {
    tableName: 'subscriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Método para verificar si la suscripción está activa
Subscription.prototype.isActive = function () {
    return ['active', 'trialing'].includes(this.status);
};

// Método para verificar si está en período de prueba
Subscription.prototype.isTrialing = function () {
    return this.status === 'trialing';
};

// Método para verificar si se cancelará al final del período
Subscription.prototype.willCancelAtPeriodEnd = function () {
    return this.cancel_at_period_end === true;
};

Subscription.associate = function (models) {
    Subscription.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};