// services/stripeService.js
import { User } from '../models/User.js';
import { Subscription } from '../models/Subscription.js';
import { Op } from 'sequelize';
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
    // Crear cliente en Stripe
    async createCustomer(userId, email, name, metadata = {}) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return { success: false, message: 'Usuario no encontrado' };
            }

            // Verificar si ya existe un cliente
            const existingSubscription = await Subscription.findOne({
                where: { user_id: userId }
            });

            if (existingSubscription) {
                return {
                    success: true,
                    data: { customer_id: existingSubscription.stripe_customer_id },
                    message: 'Cliente ya existe'
                };
            }

            // Crear cliente en Stripe
            const customer = await stripe.customers.create({
                email: email || user.email,
                name: name || user.getFullName(),
                metadata: {
                    user_id: userId,
                    ...metadata
                }
            });

            // Guardar en la base de datos
            const subscription = await Subscription.create({
                user_id: userId,
                stripe_customer_id: customer.id,
                status: 'incomplete'
            });

            return {
                success: true,
                data: { customer_id: customer.id, subscription },
                message: 'Cliente creado exitosamente'
            };
        } catch (error) {
            console.error('Error al crear cliente:', error);
            throw error;
        }
    }

    // Crear sesión de checkout
    async createCheckoutSession(userId, priceId, successUrl, cancelUrl, trialDays = null) {
        try {
            // Obtener o crear cliente
            let subscription = await Subscription.findOne({
                where: { user_id: userId }
            });

            let customerId;
            if (!subscription) {
                const user = await User.findByPk(userId);
                const customerResult = await this.createCustomer(userId, user.email, user.getFullName());
                customerId = customerResult.data.customer_id;
            } else {
                customerId = subscription.stripe_customer_id;
            }

            // Configurar sesión
            const sessionConfig = {
                customer: customerId,
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1
                    }
                ],
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    user_id: userId
                }
            };

            // Agregar período de prueba si se especifica
            if (trialDays) {
                sessionConfig.subscription_data = {
                    trial_period_days: trialDays
                };
            }

            const session = await stripe.checkout.sessions.create(sessionConfig);

            return {
                success: true,
                data: {
                    session_id: session.id,
                    url: session.url
                },
                message: 'Sesión de checkout creada'
            };
        } catch (error) {
            console.error('Error al crear sesión de checkout:', error);
            throw error;
        }
    }

    // Crear portal de cliente
    async createCustomerPortal(userId, returnUrl) {
        try {
            const subscription = await Subscription.findOne({
                where: { user_id: userId }
            });

            if (!subscription) {
                return { success: false, message: 'No se encontró suscripción' };
            }

            const session = await stripe.billingPortal.sessions.create({
                customer: subscription.stripe_customer_id,
                return_url: returnUrl
            });

            return {
                success: true,
                data: { url: session.url },
                message: 'Portal de cliente creado'
            };
        } catch (error) {
            console.error('Error al crear portal:', error);
            throw error;
        }
    }

    // Obtener suscripción
    async getSubscription(userId) {
        try {
            const subscription = await Subscription.findOne({
                where: { user_id: userId },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email', 'firstname', 'lastname']
                    }
                ]
            });

            if (!subscription) {
                return { success: false, message: 'Suscripción no encontrada' };
            }

            return {
                success: true,
                data: subscription
            };
        } catch (error) {
            console.error('Error al obtener suscripción:', error);
            throw error;
        }
    }

    // Cancelar suscripción al final del período
    async cancelSubscription(userId, immediately = false) {
        try {
            const subscription = await Subscription.findOne({
                where: { user_id: userId }
            });

            if (!subscription || !subscription.stripe_subscription_id) {
                return { success: false, message: 'Suscripción no encontrada' };
            }

            const canceledSubscription = await stripe.subscriptions.update(
                subscription.stripe_subscription_id,
                {
                    cancel_at_period_end: !immediately
                }
            );

            if (immediately) {
                await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
            }

            // Actualizar en base de datos
            await subscription.update({
                cancel_at_period_end: !immediately,
                canceled_at: immediately ? new Date() : null,
                status: immediately ? 'canceled' : subscription.status
            });

            return {
                success: true,
                data: subscription,
                message: immediately
                    ? 'Suscripción cancelada inmediatamente'
                    : 'Suscripción se cancelará al final del período'
            };
        } catch (error) {
            console.error('Error al cancelar suscripción:', error);
            throw error;
        }
    }

    // Reanudar suscripción
    async resumeSubscription(userId) {
        try {
            const subscription = await Subscription.findOne({
                where: { user_id: userId }
            });

            if (!subscription || !subscription.stripe_subscription_id) {
                return { success: false, message: 'Suscripción no encontrada' };
            }

            const updatedSubscription = await stripe.subscriptions.update(
                subscription.stripe_subscription_id,
                {
                    cancel_at_period_end: false
                }
            );

            await subscription.update({
                cancel_at_period_end: false,
                canceled_at: null
            });

            return {
                success: true,
                data: subscription,
                message: 'Suscripción reanudada exitosamente'
            };
        } catch (error) {
            console.error('Error al reanudar suscripción:', error);
            throw error;
        }
    }

    // Webhook handler - actualizar suscripción desde eventos de Stripe
    async handleWebhook(event) {
        try {
            switch (event.type) {
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                    await this.updateSubscriptionFromStripe(event.data.object);
                    break;

                case 'customer.subscription.deleted':
                    await this.handleSubscriptionDeleted(event.data.object);
                    break;

                case 'invoice.payment_succeeded':
                    await this.handlePaymentSucceeded(event.data.object);
                    break;

                case 'invoice.payment_failed':
                    await this.handlePaymentFailed(event.data.object);
                    break;

                default:
                    console.log(`Evento no manejado: ${event.type}`);
            }

            return { success: true, message: 'Webhook procesado' };
        } catch (error) {
            console.error('Error al procesar webhook:', error);
            throw error;
        }
    }

    // Actualizar suscripción desde datos de Stripe
    async updateSubscriptionFromStripe(stripeSubscription) {
        const subscription = await Subscription.findOne({
            where: { stripe_customer_id: stripeSubscription.customer }
        });

        if (!subscription) {
            console.error('Suscripción no encontrada para customer:', stripeSubscription.customer);
            return;
        }

        const price = stripeSubscription.items.data[0].price;

        await subscription.update({
            stripe_subscription_id: stripeSubscription.id,
            stripe_price_id: price.id,
            stripe_product_id: price.product,
            status: stripeSubscription.status,
            plan_amount: price.unit_amount / 100,
            plan_currency: price.currency,
            plan_interval: price.recurring.interval,
            current_period_start: new Date(stripeSubscription.current_period_start * 1000),
            current_period_end: new Date(stripeSubscription.current_period_end * 1000),
            trial_start: stripeSubscription.trial_start
                ? new Date(stripeSubscription.trial_start * 1000)
                : null,
            trial_end: stripeSubscription.trial_end
                ? new Date(stripeSubscription.trial_end * 1000)
                : null,
            cancel_at_period_end: stripeSubscription.cancel_at_period_end,
            canceled_at: stripeSubscription.canceled_at
                ? new Date(stripeSubscription.canceled_at * 1000)
                : null
        });
    }

    async handleSubscriptionDeleted(stripeSubscription) {
        const subscription = await Subscription.findOne({
            where: { stripe_subscription_id: stripeSubscription.id }
        });

        if (subscription) {
            await subscription.update({
                status: 'canceled',
                ended_at: new Date()
            });
        }
    }

    async handlePaymentSucceeded(invoice) {
        console.log('Pago exitoso para:', invoice.customer);
        // Aquí puedes agregar lógica adicional como enviar emails
    }

    async handlePaymentFailed(invoice) {
        console.log('Pago fallido para:', invoice.customer);
        // Aquí puedes agregar lógica adicional como enviar notificaciones
    }

    // Listar todas las suscripciones
    async getAllSubscriptions(filters = {}) {
        const { status, limit = 50, offset = 0 } = filters;

        const where = {};
        if (status) {
            where.status = status;
        }

        const subscriptions = await Subscription.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'email', 'firstname', 'lastname']
                }
            ]
        });

        return {
            success: true,
            data: subscriptions.rows,
            total: subscriptions.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };
    }
}

export default new StripeService();