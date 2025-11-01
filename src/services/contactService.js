// services/contactService.js
import { Contact } from '../models/Contact.js';
import { ValidationError } from 'sequelize';

class ContactService {
    async createContact(data) {
        try {
            const contact = await Contact.create({
                nombre: data.nombre,
                email: data.email,
                telefono: data.telefono || null,
                mensaje: data.mensaje
            });

            return {
                success: true,
                data: contact,
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

    async getAllContacts(filters = {}) {
        const { leido, limit = 50, offset = 0 } = filters;

        const where = {};
        if (typeof leido !== 'undefined') {
            where.leido = leido;
        }

        const contacts = await Contact.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return {
            success: true,
            data: contacts.rows,
            total: contacts.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };
    }

    async getContactById(id) {
        const contact = await Contact.findByPk(id);

        if (!contact) {
            return {
                success: false,
                message: 'Contacto no encontrado'
            };
        }

        return {
            success: true,
            data: contact
        };
    }



    async deleteContact(id) {
        const contact = await Contact.findByPk(id);

        if (!contact) {
            return {
                success: false,
                message: 'Contacto no encontrado'
            };
        }

        await contact.destroy();

        return {
            success: true,
            message: 'Contacto eliminado exitosamente'
        };
    }
}

export default new ContactService();