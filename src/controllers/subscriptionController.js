import { subscriptionService } from '../services/subscriptionService.js';
import userService from '../services/usersService.js'
import { enviarEmailBienvenida } from '../../utils/email_services.js';
import { logger } from '../../utils/logger.js';

class SubscriptionController {
    async create(req, res) {
        try {
            const { priceId, email } = req.body;

            if (!priceId) {
                return res.status(400).json({
                    success: false,
                    message: 'priceId es requerido'
                });
            }

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'email es requerido'
                });
            }

            // Verificar si el email ya está registrado ANTES de procesar el pago
            try {
                const existingUser = await userService.getUserByEmail(email);

                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'El email ya se encuentra en uso'
                    });
                }
            } catch (error) {
                // Si el error es que no se encontró el usuario, continuamos
                // Si es otro tipo de error, lo manejamos
                if (error.message !== 'Usuario no encontrado') {
                    logger.error('Error al verificar email:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error al verificar el email'
                    });
                }
            }

            // Proceder con la creación de la suscripción solo si el email no existe
            const result = await subscriptionService.createSubscription(priceId, email);

            if (!result.success) {
                return res.status(400).json(result);
            }

            // Crear usuario después de confirmación exitosa del pago
            try {
                // Extraer nombre del email (parte antes del @)
                const username = email.split('@')[0];

                // Datos del nuevo usuario
                const userData = {
                    username: username,
                    email: email,
                    password: 'Mentia2025'
                };

                await userService.createUser(userData);
                await enviarEmailBienvenida({
                    nombre: username,
                    email: email,
                    password: 'Mentia2025'
                });

                logger.info(`Usuario creado exitosamente: ${email}`);
            } catch (userError) {
                logger.error('Error al crear usuario:', userError);
                // El pago se procesó correctamente, pero falló la creación del usuario
                // Considera implementar un rollback del pago aquí si es necesario
            }

            return res.status(200).json(result);
        } catch (error) {
            logger.error('Error al crear suscripción:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }

    async getByEmail(req, res) {
        try {
            const { email } = req.query;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'email es requerido como query parameter'
                });
            }

            const result = await subscriptionService.getSubscriptionByEmail(email);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            logger.error('Error al obtener suscripciones por email:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }

    async getDetails(req, res) {
        try {
            const { subscriptionId } = req.params;

            if (!subscriptionId) {
                return res.status(400).json({
                    success: false,
                    message: 'subscriptionId es requerido'
                });
            }

            const result = await subscriptionService.getSubscriptionDetails(subscriptionId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            logger.error('Error al obtener detalles de suscripción:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }

    async cancelSubscription(req, res) {
        try {
            const { subscriptionId } = req.body;

            if (!subscriptionId) {
                return res.status(400).json({
                    success: false,
                    message: 'subscriptionId es requerido'
                });
            }

            const result = await subscriptionService.cancelSubscription(subscriptionId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: `Suscripción ${subscriptionId} cancelada exitosamente`
            });
        } catch (error) {
            logger.error('Error al cancelar suscripción:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    async getClientsList(req, res) {
        try {
            const listado = await subscriptionService.getClientData();
            return res.status(200).json(listado);
        } catch (error) {
            logger.error('Error al obtener listado de clientes:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}

export default new SubscriptionController();