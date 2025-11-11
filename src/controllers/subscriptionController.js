import { subscriptionService } from '../services/subscriptionService.js';

class SubscriptionController {
    async create(req, res) {
        try {
            const { priceId } = req.body;

            if (!priceId) {
                return res.status(400).json({
                    success: false,
                    message: 'priceId es requerido'
                });
            }

            const result = await subscriptionService.createSubscription(priceId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al crear suscripción:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }
}

export default new SubscriptionController();