// controllers/userController.js
import userService from '../services/usersService.js';

class UserController {
    async create(req, res) {
        try {
            const userData = req.body;


            if (!userData.password || !userData.email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email y password son campos requeridos'
                });
            }

            const result = await userService.createUser(userData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json(result);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async getAll(req, res) {
        try {
            const { active, suspended, search, limit, offset } = req.query;

            const result = await userService.getAllUsers({
                active: active === 'true' ? true : active === 'false' ? false : undefined,
                suspended: suspended === 'true' ? true : suspended === 'false' ? false : undefined,
                search,
                limit,
                offset
            });

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
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

            const result = await userService.getUserById(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async getByUsername(req, res) {
        try {
            const { username } = req.params;

            const result = await userService.getUserByUsername(username);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;

            const result = await userService.updateUser(id, userData);

            if (!result.success) {
                return res.status(result.message === 'Usuario no encontrado' ? 404 : 400).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
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

            const result = await userService.deleteUser(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async suspend(req, res) {
        try {
            const { id } = req.params;

            const result = await userService.suspendUser(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al suspender usuario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async activate(req, res) {
        try {
            const { id } = req.params;

            const result = await userService.activateUser(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error al activar usuario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username y password son requeridos'
                });
            }

            const result = await userService.validateCredentials(username, password);

            if (!result.success) {
                return res.status(401).json(result);
            }

            // Aquí puedes generar un token JWT si lo necesitas
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error en login:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

export default new UserController();