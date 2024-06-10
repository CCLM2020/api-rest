import { Router } from 'express';
import { createLinks, getLink, getLinks, removeLink } from '../controllers/link.controller.js';
import { requireToken } from '../middlewares/requireToken.js';
import { bodyLinkValidator, paramsLinkValidator } from '../middlewares/validatorManager.js';

const router = Router();

router.get('/', requireToken, getLinks);
router.get('/:id', requireToken, getLink)
router.post('/', requireToken, bodyLinkValidator, createLinks);
router.delete('/:id', requireToken, paramsLinkValidator, removeLink);

export default router;