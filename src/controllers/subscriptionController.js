import { subscriptionService } from '../services/subscriptionService.js';
import userService from '../services/usersService.js'
import { enviarEmailBienvenida } from '../../utils/email_services.js';
import { logger } from '../../utils/logger.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
            const existingUser = await userService.getUserByEmail(email);

            if (existingUser.success) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya se encuentra en uso'
                });
            }

            // Solo crear la sesión de checkout, el usuario se creará en el webhook
            const result = await subscriptionService.createSubscription(priceId, email);

            if (!result.success) {
                return res.status(400).json(result);
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

    async handleWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            logger.error('Error al verificar webhook:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object;
                    
                    // Solo proceder si el pago fue exitoso
                    if (session.payment_status === 'paid') {
                        const email = session.customer_details?.email;
                        
                        if (email) {
                            // Verificar que el usuario no exista ya
                            const existingUser = await userService.getUserByEmail(email);
                            
                            if (!existingUser.success) {
                                // Crear usuario
                                const username = email.split('@')[0];
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

                                logger.info(`Usuario creado exitosamente después del pago: ${email}`);
                            } else {
                                logger.info(`Usuario ya existe para email: ${email}`);
                            }
                        }
                    }
                    break;

                case 'invoice.payment_succeeded':
                    const invoice = event.data.object;
                    logger.info(`Pago exitoso para suscripción: ${invoice.subscription}`);
                    break;

                default:
                    logger.info(`Evento no manejado: ${event.type}`);
            }

            res.json({ received: true });
        } catch (error) {
            logger.error('Error al procesar webhook:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
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