// routes/contactRoutes.js
import express from 'express';
import infoContactController from '../controllers/infoContactController.js';

const router = express.Router();

// Ruta pública para enviar mensajes desde el formulario web
router.post('/', infoContactController.create);

// Rutas administrativas (deberías protegerlas con middleware de autenticación)
router.get('/', infoContactController.getAll);
router.get('/:id', infoContactController.getById);
router.delete('/:id', infoContactController.delete);

export default router;