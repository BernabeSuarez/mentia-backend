import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class SubscriptionService {
    async createSubscription(priceId) {
        try {
            // ⚠️ FALTABA ASIGNAR EL RESULTADO A 'session'
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'subscription',
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: "http://localhost:5173/stripe-succes?session_id={CHECKOUT_SESSION_ID}",
                cancel_url: "http://localhost:5173/stripe-cancel",
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
}

export const subscriptionService = new SubscriptionService();