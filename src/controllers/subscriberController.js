import subscriberService from '../services/subscriberService.js';
import { logger } from '../../utils/logger.js';

export const subscribe = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y Email son necesarios'
            });
        }

        const subscriber = await subscriberService.subscribe(name, email);

        res.status(201).json({
            success: true,
            message: 'Suscrito exitosamente al boletín informativo',
            data: {
                id: subscriber.id,
                name: subscriber.name,
                email: subscriber.email
            }
        });
    } catch (error) {
        logger.error('Error al procesar la suscripción:', error);
        // Error de validación de Sequelize
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }

        // Error de duplicado
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'Este Email ya se encuentra suscrito'
            });
        }

        // Otros errores
        res.status(500).json({
            success: false,
            message: error.message || 'Error al procesar la suscripción'
        });
    }
};

export const unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        await subscriberService.unsubscribe(email);

        res.json({
            success: true,
            message: 'Email eliminado de la lista de suscriptores'
        });
    } catch (error) {
        logger.error('Error al procesar la desuscripción:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllSuscribers = async (req, res) => {
    try {
        const subscribers = await subscriberService.getAllSubscribers();

        res.json({
            success: true,
            count: subscribers.length,
            data: subscribers
        });
    } catch (error) {
        logger.error('Error al obtener los suscriptores:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los suscriptores'
        });
    }
};

export const getCount = async (req, res) => {
    try {
        const count = await subscriberService.getSubscriberCount();

        res.json({
            success: true,
            count
        });
    } catch (error) {
        logger.error('Error al obtener el conteo de suscriptores:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el conteo de suscriptores'
        });
    }
};