// routes/contactRoutes.js
import express from 'express';
import infoContactController from '../controllers/infoContactController.js';

const router = express.Router();

// Ruta pública para enviar mensajes desde el formulario web
router.post('/',//#swagger.tags = ['InfoContact']
    // #swagger.description = 'Guardar los datos del formulario de Consultas.'
    infoContactController.create);

// Rutas administrativas (deberías protegerlas con middleware de autenticación)
router.get('/',//#swagger.tags = ['InfoContact']
    // #swagger.description = 'Obtemer los datos del formulario de Consultas.'
    infoContactController.getAll);
router.get('/:id',//#swagger.tags = ['InfoContact']
    // #swagger.description = 'Obtener datos del formulario de Consultas por ID.'
    infoContactController.getById);
router.delete('/:id',//#swagger.tags = ['InfoContact']
    // #swagger.description = 'Eliminar datos del formulario de Consultas.'
    infoContactController.delete);

export default router;