// controllers/contactController.js
import infoContactService from '../services/infoContactService.js';
import { logger } from '../../utils/logger.js';

class InfoContactController {
    async create(req, res) {
        try {
            const { nombre, email, telefono, asignatura } = req.body;

            // Validación básica
            if (!nombre || !email || !asignatura) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, email y asignatura son campos requeridos'
                });
            }

            const result = await infoContactService.createInfoContact({
                nombre,
                email,
                telefono,
                asignatura
            });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json(result);
        } catch (error) {
            logger.error('Error al crear contacto:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async getAll(req, res) {
        try {
            const { leido, limit, offset } = req.query;

            const result = await infoContactService.getAllInfoContacts({
                leido: leido === 'true' ? true : leido === 'false' ? false : undefined,
                limit,
                offset
            });

            return res.status(200).json(result);
        } catch (error) {
            logger.error('Error al obtener contactos:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const result = await infoContactService.getInfoContactById(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            logger.error('Error al obtener contacto:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }


    async delete(req, res) {
        try {
            const { id } = req.params;

            const result = await infoContactService.deleteInfoContact(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            logger.error('Error al eliminar contacto:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

export default new InfoContactController();