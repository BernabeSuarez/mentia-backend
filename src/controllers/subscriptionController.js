import { subscriptionService } from '../services/subscriptionService.js';

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

            const result = await subscriptionService.createSubscription(priceId, email);

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
            console.error('Error al obtener suscripciones por email:', error);
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
            console.error('Error al obtener detalles de suscripción:', error);
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
            console.error('Error al cancelar suscripción:', error);
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
            console.error('Error al obtener listado de clientes:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}

export default new SubscriptionController();