import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { markSpam, SpamSchemas } from '../controllers/spam.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post('/:phone', authRequired, validate(SpamSchemas.spamSchema), markSpam);

export default router;
