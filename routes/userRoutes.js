import express from 'express';
import { registerValidation, loginValidation } from '../middlewares/users_validation.js';
import { login, register, logout } from '../controllers/userController.js';

const router = express.Router();

router.route('/register').post(registerValidation, register);
router.route('/login').post(loginValidation, login);
router.route('/logout').post(logout)

export default router;