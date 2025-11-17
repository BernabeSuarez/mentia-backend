import { Router } from 'express';
import subscriptionController from '../controllers/subscriptionController.js';

export const router = Router();

// Crear una nueva suscripción
router.post('/stripe-checkout', subscriptionController.create);

// Obtener suscripciones por email (query parameter)
router.get('/by-email', subscriptionController.getByEmail);

// Obtener detalles de una suscripción específica
router.get('/:subscriptionId', subscriptionController.getDetails);

// Cancelar una suscripción
router.post('/cancel', subscriptionController.cancelSubscription);

// Obtener listado de todos los clientes
router.get('/clients/list', subscriptionController.getClientsList);