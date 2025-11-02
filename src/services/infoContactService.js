// services/contactService.js
import { InfoContact } from '../models/InfoModel.js';
import { ValidationError } from 'sequelize';

class InfoContactService {
    async createInfoContact(data) {
        try {
            const infoContact = await InfoContact.create({
                nombre: data.nombre,
                email: data.email,
                telefono: data.telefono || null,
                asignatura: data.asignatura
            });

            return {
                success: true,
                data: infoContact,
                message: 'Mensaje enviado exitosamente'
            };
        } catch (error) {
            if (error instanceof ValidationError) {
                const errors = error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }));

                return {
                    success: false,
                    errors,
                    message: 'Error de validación'
                };
            }

            throw error;
        }
    }

    async getAllInfoContacts(filters = {}) {
        const { leido, limit = 50, offset = 0 } = filters;

        const where = {};
        if (typeof leido !== 'undefined') {
            where.leido = leido;
        }

        const infoContacts = await InfoContact.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return {
            success: true,
            data: infoContacts.rows,
            total: infoContacts.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };
    }

    async getInfoContactById(id) {
        const infoContact = await InfoContact.findByPk(id);

        if (!contact) {
            return {
                success: false,
                message: 'Contacto no encontrado'
            };
        }

        return {
            success: true,
            data: infoContact
        };
    }



    async deleteInfoContact(id) {
        const infoContact = await InfoContact.findByPk(id);

        if (!contact) {
            return {
                success: false,
                message: 'Contacto no encontrado'
            };
        }

        await infoContact.destroy();

        return {
            success: true,
            message: 'Contacto eliminado exitosamente'
        };
    }
}

export default new InfoContactService();