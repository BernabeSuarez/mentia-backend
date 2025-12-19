import { Router } from 'express';
import subscriptionController from '../controllers/subscriptionController.js';

export const router = Router();

// Crear una nueva suscripción
router.post('/stripe-checkout',//#swagger.tags = ['Subscription']
    // #swagger.description = 'Crear una subscripcion con stripe.'
    subscriptionController.create);

// Obtener suscripciones por email (query parameter)
router.get('/by-email',//#swagger.tags = ['Subscription']
    // #swagger.description = 'Obtener una subscripcion por su email.'
    subscriptionController.getByEmail);

// Obtener detalles de una suscripción específica
router.get('/:subscriptionId', //#swagger.tags = ['Subscription']
    // #swagger.description = 'Obtener una subscripcion por su Id.'
    subscriptionController.getDetails);

// Cancelar una suscripción
router.post('/cancel', //#swagger.tags = ['Subscription']
    // #swagger.description = 'Cancelar una subscripcion.'
    subscriptionController.cancelSubscription);

// Obtener listado de todos los clientes
router.get('/clients/list',//#swagger.tags = ['Subscription']
    // #swagger.description = 'Obtener el listado de clientes.'
    subscriptionController.getClientsList);

// Webhook de Stripe
router.post('/webhook',//#swagger.tags = ['Subscription']
    // #swagger.description = 'Webhook para procesar eventos de Stripe.'
    subscriptionController.handleWebhook);