import { Router } from 'express';
import { subscribe, unsubscribe, getAllSuscribers, getCount } from '../controllers/subscriberController.js';


const router = Router();

// POST /api/subscribers - Suscribirse
router.post('/',//#swagger.tags = ['Subscriber']
    // #swagger.description = 'Suscribirse al newsletter.'
    subscribe);

// POST /api/subscribers/unsubscribe - Desuscribirse
router.post('/unsubscribe', //#swagger.tags = ['Subscriber']
    // #swagger.description = 'Desuscribirse del newsletter.'
    unsubscribe);

// GET /api/subscribers - Obtener todos (para admin)
router.get('/',//#swagger.tags = ['Subscriber']
    // #swagger.description = 'Obterner todas las subscripciones.'
    getAllSuscribers);

// GET /api/subscribers/count - Obtener cantidad
router.get('/count',//#swagger.tags = ['Subscriber']
    // #swagger.description = 'Obtener la cantidad de subscripciones.'
    getCount);

export default router;