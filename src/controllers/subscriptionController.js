// controllers/subscriptionController.js
import stripeService from '../services/stripeService.js';
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class SubscriptionController {
    // Crear sesión de checkout
    async createCheckoutSession(req, res) {
        try {
            const { userId, priceId, successUrl, cancelUrl, trialDays } = req.body;

            if (!userId || !priceId || !successUrl || !cancelUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'userId, priceId, successUrl y cancelUrl son requeridos'
                });
            }

            const result = await stripeService.createCheckoutSession(
                userId,
                priceId,
                successUrl,
                cancelUrl,
                trialDays
            );

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al crear sesión de checkout:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al crear sesión de checkout',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Crear portal de cliente
    async createCustomerPortal(req, res) {
        try {
            const { userId, returnUrl } = req.body;

            if (!userId || !returnUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'userId y returnUrl son requeridos'
                });
            }

            const result = await stripeService.createCustomerPortal(userId, returnUrl);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al crear portal:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al crear portal de cliente',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Obtener suscripción de un usuario
    async getSubscription(req, res) {
        try {
            const { userId } = req.params;

            const result = await stripeService.getSubscription(userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al obtener suscripción:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener suscripción',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Obtener todas las suscripciones (admin)
    async getAllSubscriptions(req, res) {
        try {
            const { status, limit, offset } = req.query;

            const result = await stripeService.getAllSubscriptions({
                status,
                limit,
                offset
            });

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al obtener suscripciones:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener suscripciones',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Cancelar suscripción
    async cancelSubscription(req, res) {
        try {
            const { userId } = req.params;
            const { immediately } = req.body;

            const result = await stripeService.cancelSubscription(
                userId,
                immediately === true
            );

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al cancelar suscripción:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al cancelar suscripción',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Reanudar suscripción
    async resumeSubscription(req, res) {
        try {
            const { userId } = req.params;

            const result = await stripeService.resumeSubscription(userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al reanudar suscripción:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al reanudar suscripción',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Webhook de Stripe
    async handleWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;

        try {
            // Verificar la firma del webhook
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                webhookSecret
            );
        } catch (err) {
            console.error('Error al verificar webhook:', err.message);
            return res.status(400).json({
                success: false,
                message: `Webhook signature verification failed: ${err.message}`
            });
        }

        try {
            // Procesar el evento
            await stripeService.handleWebhook(event);

            return res.status(200).json({
                success: true,
                message: 'Webhook recibido'
            });
        } catch (error) {
            console.error('Error al procesar webhook:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al procesar webhook',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Obtener productos/planes disponibles
    async getProducts(req, res) {
        try {
            const products = await stripe.products.list({
                active: true,
                expand: ['data.default_price']
            });

            const formattedProducts = products.data.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                images: product.images,
                metadata: product.metadata,
                price: product.default_price ? {
                    id: product.default_price.id,
                    amount: product.default_price.unit_amount / 100,
                    currency: product.default_price.currency,
                    interval: product.default_price.recurring?.interval,
                    interval_count: product.default_price.recurring?.interval_count
                } : null
            }));

            return res.status(200).json({
                success: true,
                data: formattedProducts
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener productos',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Obtener precios de un producto
    async getPrices(req, res) {
        try {
            const { productId } = req.params;

            const prices = await stripe.prices.list({
                product: productId,
                active: true
            });

            const formattedPrices = prices.data.map(price => ({
                id: price.id,
                amount: price.unit_amount / 100,
                currency: price.currency,
                interval: price.recurring?.interval,
                interval_count: price.recurring?.interval_count,
                trial_period_days: price.recurring?.trial_period_days,
                metadata: price.metadata
            }));

            return res.status(200).json({
                success: true,
                data: formattedPrices
            });
        } catch (error) {
            console.error('Error al obtener precios:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener precios',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

export default new SubscriptionController();