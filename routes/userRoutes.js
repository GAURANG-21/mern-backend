import express from 'express';
import { registerValidation } from '../middlewares/users_validation.js';
import { register } from '../controllers/userController.js';

const router = express.Router();

router.route('/register').post(registerValidation, register);

export default router;