import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { getProfile, updateProfile, UserSchemas } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/profile', authRequired, getProfile);
router.put('/profile', authRequired, validate(UserSchemas.updateSchema), updateProfile);

export default router;
