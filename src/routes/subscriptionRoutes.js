// routes/userRoutes.js
import { Router } from 'express';
import subscriptionController from '../controllers/subscriptionController.js';

export const router = Router();

router.post('/stripe-checkout', subscriptionController.create);
