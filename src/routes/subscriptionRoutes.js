// routes/userRoutes.js
import { Router } from 'express';
import subscriptionController from '../controllers/subscriptionController.js';

export const router = Router();

router.post('/stripe-checkout', subscriptionController.create);
router.get('/:subscriptionId', subscriptionController.getDetails);
router.post('/cancel', subscriptionController.cancelSubscription);
