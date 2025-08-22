import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { searchByName, searchByPhone, getRegisteredDetails, getContactDetails, SearchSchemas } from '../controllers/search.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/name', authRequired, validate(SearchSchemas.nameSearchSchema), searchByName);
router.get('/phone/:number', authRequired, validate(SearchSchemas.phoneSearchSchema), searchByPhone);
router.get('/person/registered/:userId', authRequired, getRegisteredDetails);
router.get('/person/contact/:contactId', authRequired, getContactDetails);

export default router;
