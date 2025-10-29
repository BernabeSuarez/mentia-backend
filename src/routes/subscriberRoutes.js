import { Router } from 'express';
import { subscribe, unsubscribe, getAllSuscribers, getCount } from '../controllers/subscriberController.js';


const router = Router();

// POST /api/subscribers - Suscribirse
router.post('/', subscribe);

// POST /api/subscribers/unsubscribe - Desuscribirse
router.post('/unsubscribe', unsubscribe);

// GET /api/subscribers - Obtener todos (para admin)
router.get('/', getAllSuscribers);

// GET /api/subscribers/count - Obtener cantidad
router.get('/count', getCount);

export default router;