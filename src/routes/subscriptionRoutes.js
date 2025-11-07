// routes/subscriptionRoutes.js
import express, { Router } from 'express';
import subscriptionController from '../controllers/subscriptionController.js';


const router = Router();

// Middleware para raw body en webhook (IMPORTANTE)
const rawBodyMiddleware = express.raw({ type: 'application/json' });

// Rutas públicas de productos
router.get('/products', subscriptionController.getProducts);
router.get('/products/:productId/prices', subscriptionController.getPrices);

// Rutas de gestión de suscripciones (proteger con autenticación)
router.post('/checkout', subscriptionController.createCheckoutSession);
router.post('/portal', subscriptionController.createCustomerPortal);
router.get('/user/:userId', subscriptionController.getSubscription);
router.post('/user/:userId/cancel', subscriptionController.cancelSubscription);
router.post('/user/:userId/resume', subscriptionController.resumeSubscription);

// Rutas administrativas (proteger con autenticación y roles)
router.get('/', subscriptionController.getAllSubscriptions);

// Webhook de Stripe (DEBE estar antes del middleware de JSON)
// IMPORTANTE: Esta ruta NO debe usar express.json() middleware
router.post('/webhook', rawBodyMiddleware, subscriptionController.handleWebhook);

export default router;