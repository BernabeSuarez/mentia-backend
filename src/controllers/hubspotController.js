import hubspotService from '../services/hubspotService.js';
import { logger } from '../../utils/logger.js';

class HubspotController {
    async create(req, res) {
        try {
            const { nombre, email, telefono, asignatura, mensaje } = req.body;

            // Validación básica
            if (!nombre || !email || !telefono) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, email y telefono son campos requeridos'
                });
            }

            // Validar que al menos uno de los campos opcionales esté presente
            if (!asignatura && !mensaje) {
                return res.status(400).json({
                    success: false,
                    message: 'Debe proporcionar al menos una asignatura o un mensaje'
                });
            }

            const result = await hubspotService.createContact({
                nombre,
                email,
                telefono,
                asignatura,
                mensaje
            });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json(result);
        } catch (error) {
            logger.error('Error al crear contacto con HubSpot:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

export default new HubspotController()