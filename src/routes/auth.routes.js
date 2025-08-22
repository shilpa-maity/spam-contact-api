import { Router } from 'express';
import { register, login, AuthSchemas } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post('/register', validate(AuthSchemas.registerSchema), register);
router.post('/login', validate(AuthSchemas.loginSchema), login);

export default router;
