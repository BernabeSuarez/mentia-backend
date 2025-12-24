import { subscriptionService } from '../services/subscriptionService.js';
import userService from '../services/usersService.js'
import { enviarEmailBienvenida, enviarEmailMatriculaAdmin } from '../../utils/email_services.js';
import { logger } from '../../utils/logger.js';
import Stripe from 'stripe';
import bcrypt from 'bcrypt';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class SubscriptionController {
    async create(req, res) {
        try {
            const { priceId, email, fullName, phone, curso } = req.body;

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

            if (!fullName) {
                return res.status(400).json({
                    success: false,
                    message: 'fullName es requerido'
                });
            }

            if (!curso) {
                return res.status(400).json({
                    success: false,
                    message: 'curso es requerido'
                });
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'email no tiene un formato válido'
                });
            }

            // Validar teléfono si se proporciona
            if (phone && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'phone no tiene un formato válido'
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
            const result = await subscriptionService.createSubscription(priceId, email, curso, fullName, phone);

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
                        const courseName = session.metadata?.course_name;
                        const fullName = session.metadata?.full_name;
                        const phone = session.metadata?.phone;
                        
                        if (email && courseName) {
                            // Verificar que el usuario no exista ya
                            const existingUser = await userService.getUserByEmail(email);
                            
                            if (!existingUser.success) {
                                // Crear usuario con contraseña segura y hasheada
                                const username = email.split('@')[0];
                                const tempPassword = Math.random().toString(36).slice(-8); // Generar contraseña temporal segura
                                const hashedPassword = await bcrypt.hash(tempPassword, 10);
                                
                                const userData = {
                                    username: username,
                                    email: email,
                                    password: hashedPassword
                                };

                                await userService.createUser(userData);
                                await enviarEmailBienvenida({
                                    nombre: username,
                                    email: email,
                                    password: tempPassword
                                });

                                logger.info(`Usuario creado exitosamente después del pago: ${email}`);
                            } else {
                                logger.info(`Usuario ya existe para email: ${email}`);
                            }

                            // Usar transacción para garantizar consistencia de datos
                            const { Subscriber } = await import('../models/Subscriber.js');
                            
                            try {
                                await sequelize.transaction(async (t) => {
                                    // Guardar suscripción con datos completos en la base de datos
                                    await Subscriber.create({
                                        fullName: fullName || email.split('@')[0],
                                        email: email,
                                        phone: phone || '',
                                        courseName: courseName
                                    }, { transaction: t });
                                    
                                    logger.info(`Suscripción guardada en base de datos: ${email} - ${courseName}`);
                                    
                                    // Enviar email al administrador (fuera de la transacción de BD)
                                    try {
                                        await enviarEmailMatriculaAdmin({
                                            fullName: fullName || email.split('@')[0],
                                            email: email,
                                            phone: phone || '',
                                            courseName: courseName,
                                            sessionId: session.id
                                        });
                                        logger.info(`Email de matrícula enviado al administrador para: ${email}`);
                                    } catch (emailError) {
                                        logger.error('Error al enviar email al administrador:', emailError);
                                        // No hacer rollback por error de email, el usuario ya está pagado
                                    }
                                });
                            } catch (dbError) {
                                logger.error('Error crítico al guardar suscripción en base de datos:', dbError);
                                // Aquí podrías implementar un sistema de reintentos o notificación manual
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