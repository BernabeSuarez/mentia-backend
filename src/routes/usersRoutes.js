// routes/userRoutes.js
import { Router } from 'express';
import userController from '../controllers/usersController.js';

export const router = Router();

// Ruta de autenticación
router.post('/login', userController.login);

// Rutas CRUD de usuarios (proteger con middleware de autenticación en producción)
router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.get('/username/:username', userController.getByUsername);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

// Rutas de gestión de estado
router.patch('/:id/suspend', userController.suspend);
router.patch('/:id/activate', userController.activate);

