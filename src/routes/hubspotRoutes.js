import express from 'express';
import hubspotController from '../controllers/hubspotController.js';


const router = express.Router();

// Ruta pública para enviar mensajes desde el formulario web
router.post('/',//#swagger.tags = ['HubSpot']
    // #swagger.description = 'crear el contacto en HubSpot.'
    hubspotController.create);


export default router;