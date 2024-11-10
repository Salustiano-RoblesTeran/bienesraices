import express from "express";
import { body } from 'express-validator'

import { admin, crear, guardar, agregarImagen } from "../controllers/propiedadCtrl.js";

import protgerRuta from "../middleware/protegerRuta.js";

const router = express.Router();


router.get('/mis-propiedades', protgerRuta, admin)
router.get('/propiedades/crear', protgerRuta, crear)
router.post('/propiedades/crear',
    protgerRuta,
    body('titulo').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio.'),
    body('descripcion').notEmpty().withMessage('La Descripcion No Puede Ir Vacia.').isLength({max: 200}).withMessage('La Descripcion es muy Larga'),
    body('categoria').isNumeric().withMessage('Selecciona una Categoria.'),
    body('precio').isNumeric().withMessage('Selecciona un Rango de Precio.'),
    body('habitaciones').isNumeric().withMessage('Selecciona la Cantidad de Habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la Cantidad de Estacionamientos.'),
    body('wc').isNumeric().withMessage('Selecciona la Cantidad de Baños.'),
    body('lat').isNumeric().withMessage('Ubique la propiedad en el Mapa.'),
    guardar)


router.get('/propiedades/agregar-imagen/:id', 
    protgerRuta,
    agregarImagen)


export default router;