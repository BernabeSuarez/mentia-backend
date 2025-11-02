// services/userService.js
import { User } from '../models/User.js';
import { ValidationError, UniqueConstraintError, Op } from 'sequelize';

class UserService {
    async createUser(data) {
        try {
            const user = await User.create({
                username: data.username,
                password: data.password,
                email: data.email,
                firstname: data.firstname,
                lastname: data.lastname,
                city: data.city || null,
                country: data.country || 'ES',
                phone: data.phone || null,
                institution: data.institution || null,
                department: data.department || null,
                address: data.address || null,
                lang: data.lang || 'es',
                timezone: data.timezone || 'Europe/Madrid',
                description: data.description || null,
                active: data.active !== undefined ? data.active : true,
                suspended: data.suspended !== undefined ? data.suspended : false
            });

            return {
                success: true,
                data: user,
                message: 'Usuario creado exitosamente'
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

            if (error instanceof UniqueConstraintError) {
                return {
                    success: false,
                    message: 'El username o email ya están registrados'
                };
            }

            throw error;
        }
    }

    async getAllUsers(filters = {}) {
        const {
            active,
            suspended,
            search,
            limit = 50,
            offset = 0
        } = filters;

        const where = {};

        if (typeof active !== 'undefined') {
            where.active = active;
        }

        if (typeof suspended !== 'undefined') {
            where.suspended = suspended;
        }

        if (search) {
            where[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { firstname: { [Op.like]: `%${search}%` } },
                { lastname: { [Op.like]: `%${search}%` } }
            ];
        }

        const users = await User.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']],
            attributes: { exclude: ['password'] }
        });

        return {
            success: true,
            data: users.rows,
            total: users.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };
    }

    async getUserById(id) {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return {
                success: false,
                message: 'Usuario no encontrado'
            };
        }

        return {
            success: true,
            data: user
        };
    }

    async getUserByUsername(username) {
        const user = await User.findOne({
            where: { username },
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return {
                success: false,
                message: 'Usuario no encontrado'
            };
        }

        return {
            success: true,
            data: user
        };
    }

    async updateUser(id, data) {
        try {
            const user = await User.findByPk(id);

            if (!user) {
                return {
                    success: false,
                    message: 'Usuario no encontrado'
                };
            }

            // Actualizar solo los campos proporcionados
            await user.update({
                username: data.username || user.username,
                email: data.email || user.email,
                firstname: data.firstname || user.firstname,
                lastname: data.lastname || user.lastname,
                city: data.city !== undefined ? data.city : user.city,
                country: data.country || user.country,
                phone: data.phone !== undefined ? data.phone : user.phone,
                institution: data.institution !== undefined ? data.institution : user.institution,
                department: data.department !== undefined ? data.department : user.department,
                address: data.address !== undefined ? data.address : user.address,
                lang: data.lang || user.lang,
                timezone: data.timezone || user.timezone,
                description: data.description !== undefined ? data.description : user.description,
                active: data.active !== undefined ? data.active : user.active,
                suspended: data.suspended !== undefined ? data.suspended : user.suspended,
                ...(data.password && { password: data.password })
            });

            return {
                success: true,
                data: user,
                message: 'Usuario actualizado exitosamente'
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

            if (error instanceof UniqueConstraintError) {
                return {
                    success: false,
                    message: 'El username o email ya están en uso'
                };
            }

            throw error;
        }
    }

    async deleteUser(id) {
        const user = await User.findByPk(id);

        if (!user) {
            return {
                success: false,
                message: 'Usuario no encontrado'
            };
        }

        await user.destroy();

        return {
            success: true,
            message: 'Usuario eliminado exitosamente'
        };
    }

    async suspendUser(id) {
        const user = await User.findByPk(id);

        if (!user) {
            return {
                success: false,
                message: 'Usuario no encontrado'
            };
        }

        user.suspended = true;
        await user.save();

        return {
            success: true,
            data: user,
            message: 'Usuario suspendido exitosamente'
        };
    }

    async activateUser(id) {
        const user = await User.findByPk(id);

        if (!user) {
            return {
                success: false,
                message: 'Usuario no encontrado'
            };
        }

        user.active = true;
        user.suspended = false;
        await user.save();

        return {
            success: true,
            data: user,
            message: 'Usuario activado exitosamente'
        };
    }

    async validateCredentials(username, password) {
        const user = await User.findOne({
            where: { username }
        });

        if (!user) {
            return {
                success: false,
                message: 'Credenciales inválidas'
            };
        }

        const isValid = await user.validatePassword(password);

        if (!isValid) {
            return {
                success: false,
                message: 'Credenciales inválidas'
            };
        }

        if (user.suspended) {
            return {
                success: false,
                message: 'Usuario suspendido'
            };
        }

        if (!user.active) {
            return {
                success: false,
                message: 'Usuario inactivo'
            };
        }

        return {
            success: true,
            data: user,
            message: 'Autenticación exitosa'
        };
    }
}

export default new UserService();