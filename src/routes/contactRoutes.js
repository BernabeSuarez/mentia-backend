// routes/contactRoutes.js
import express from 'express';
import contactController from '../controllers/contactController.js';

const router = express.Router();

// Ruta pública para enviar mensajes desde el formulario web
router.post('/', contactController.create);

// Rutas administrativas (deberías protegerlas con middleware de autenticación)
router.get('/', contactController.getAll);
router.get('/:id', contactController.getById);
router.delete('/:id', contactController.delete);

export default router;