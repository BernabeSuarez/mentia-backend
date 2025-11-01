// controllers/contactController.js
import contactService from '../services/contactService.js';

class ContactController {
    async create(req, res) {
        try {
            const { nombre, email, telefono, mensaje } = req.body;

            // Validación básica
            if (!nombre || !email || !mensaje) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, email y mensaje son campos requeridos'
                });
            }

            const result = await contactService.createContact({
                nombre,
                email,
                telefono,
                mensaje
            });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json(result);
        } catch (error) {
            console.error('Error al crear contacto:', error);
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

            const result = await contactService.getAllContacts({
                leido: leido === 'true' ? true : leido === 'false' ? false : undefined,
                limit,
                offset
            });

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al obtener contactos:', error);
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

            const result = await contactService.getContactById(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al obtener contacto:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async markAsRead(req, res) {
        try {
            const { id } = req.params;

            const result = await contactService.markAsRead(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al marcar contacto como leído:', error);
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

            const result = await contactService.deleteContact(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al eliminar contacto:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

export default new ContactController();