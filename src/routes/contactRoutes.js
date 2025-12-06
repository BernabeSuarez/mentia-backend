// routes/contactRoutes.js
import express from 'express';
import contactController from '../controllers/contactController.js';

const router = express.Router();

// Ruta pública para enviar mensajes desde el formulario web
router.post('/',//#swagger.tags = ['Contact']
    // #swagger.description = 'Guardar los datos del formulario de contacto.'
    contactController.create);

// Rutas administrativas (deberías protegerlas con middleware de autenticación)
router.get('/', //#swagger.tags = ['Contact']
    // #swagger.description = 'Obtener los datos del formulario de contacto.'
    contactController.getAll);
router.get('/:id',//#swagger.tags = ['Contact']
    // #swagger.description = 'Obtener datos por Id.'
    contactController.getById);
router.delete('/:id', //#swagger.tags = ['Contact']
    // #swagger.description = 'Eliminar los datos del formulario de contacto.'
    contactController.delete);

export default router;