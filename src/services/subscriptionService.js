import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class SubscriptionService {
    async createSubscription(priceId, customerEmail, curso, fullName, phone) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'subscription',
                customer_email: customerEmail, // Asociar email al checkout
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: "https://mentia-academy.vercel.app/stripe-success?session_id={CHECKOUT_SESSION_ID}",
                cancel_url: "https://mentia-academy.vercel.app/stripe-cancel",
                metadata: {
                    course_name: curso, // Guardar nombre del curso en metadata
                    full_name: fullName, // Guardar nombre completo
                    phone: phone || '' // Guardar teléfono
                }
            });

            return {
                success: true,
                url: session.url,
                message: 'Suscripción creada exitosamente'
            };
        } catch (error) {
            console.error('Error al crear suscripción:', error);
            return {
                success: false,
                message: 'Error al crear la suscripción'
            };
        }
    }

    async getSubscriptionByEmail(email) {
        try {
            // 1. Buscar el customer por email
            const customers = await stripe.customers.list({
                email: email,
                limit: 1
            });

            if (customers.data.length === 0) {
                return {
                    success: false,
                    message: 'No se encontró un cliente con ese email'
                };
            }

            const customer = customers.data[0];

            // 2. Buscar suscripciones activas del customer
            const subscriptions = await stripe.subscriptions.list({
                customer: customer.id,
                status: 'all', // Incluye todas las suscripciones (activas, canceladas, etc.)
                limit: 10
            });

            if (subscriptions.data.length === 0) {
                return {
                    success: true,
                    data: {
                        customer: {
                            id: customer.id,
                            email: customer.email,
                            name: customer.name
                        },
                        subscriptions: []
                    },
                    message: 'Cliente encontrado pero sin suscripciones'
                };
            }

            // 3. Formatear la respuesta con datos relevantes
            const formattedSubscriptions = subscriptions.data.map(sub => ({
                id: sub.id,
                status: sub.status,
                current_period_start: new Date(sub.current_period_start * 1000),
                current_period_end: new Date(sub.current_period_end * 1000),
                cancel_at_period_end: sub.cancel_at_period_end,
                canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
                plan: {
                    id: sub.items.data[0].price.id,
                    amount: sub.items.data[0].price.unit_amount / 100,
                    currency: sub.items.data[0].price.currency,
                    interval: sub.items.data[0].price.recurring.interval
                }
            }));

            return {
                success: true,
                data: {
                    customer: {
                        id: customer.id,
                        email: customer.email,
                        name: customer.name
                    },
                    subscriptions: formattedSubscriptions
                },
                message: 'Suscripciones obtenidas exitosamente'
            };
        } catch (error) {
            console.error('Error al obtener suscripciones por email:', error);
            return {
                success: false,
                message: 'Error al obtener las suscripciones'
            };
        }
    }

    async getSubscriptionDetails(subscriptionId) {
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            return {
                success: true,
                data: subscription,
                message: 'Detalles de suscripción obtenidos exitosamente'
            };
        } catch (error) {
            console.error('Error al obtener detalles de suscripción:', error);
            return {
                success: false,
                message: 'Error al obtener los detalles de la suscripción'
            };
        }
    }

    async cancelSubscription(subscriptionId) {
        try {
            const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);

            return {
                success: true,
                data: deletedSubscription,
                message: 'Suscripción cancelada exitosamente'
            };
        } catch (error) {
            console.error('Error al cancelar suscripción:', error);
            return {
                success: false,
                message: 'Error al cancelar la suscripción'
            };
        }
    }

    async getClientData() {
        try {
            const clientList = await stripe.customers.list({
                limit: 100
            });
            return {
                success: true,
                data: clientList,
                message: "Listado de clientes"
            };
        } catch (error) {
            console.error('Error al obtener listado de clientes:', error);
            return {
                success: false,
                message: 'Error al obtener el listado de clientes'
            };
        }
    }
}

export const subscriptionService = new SubscriptionService();