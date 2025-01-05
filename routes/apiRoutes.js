import express from 'express';
import { propiedades } from '../controllers/apiCtrl.js';

const router = express.Router();

router.get('/propiedades', propiedades)

export default router;