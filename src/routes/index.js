import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import searchRoutes from './search.routes.js';
import spamRoutes from './spam.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/search', searchRoutes);
router.use('/spam', spamRoutes);

export default router;
