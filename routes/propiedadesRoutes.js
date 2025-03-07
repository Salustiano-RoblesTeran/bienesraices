import express from "express";
import { body } from 'express-validator'

import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes } from "../controllers/propiedadCtrl.js";

import protegerRuta from "../middleware/protegerRuta.js";

import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router();


router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear',
    protegerRuta,
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
    protegerRuta,
    agregarImagen)

router.post('/propiedades/agregar-imagen/:id', 
    protegerRuta, 
    upload.single('imagen'), 
    almacenarImagen)


router.get('/propiedades/editar/:id',
    protegerRuta,
    editar
)

router.post('/propiedades/editar/:id',
    protegerRuta,
    body('titulo').notEmpty().withMessage('El Titulo del Anuncio es Obligatorio.'),
    body('descripcion').notEmpty().withMessage('La Descripcion No Puede Ir Vacia.').isLength({max: 200}).withMessage('La Descripcion es muy Larga'),
    body('categoria').isNumeric().withMessage('Selecciona una Categoria.'),
    body('precio').isNumeric().withMessage('Selecciona un Rango de Precio.'),
    body('habitaciones').isNumeric().withMessage('Selecciona la Cantidad de Habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la Cantidad de Estacionamientos.'),
    body('wc').isNumeric().withMessage('Selecciona la Cantidad de Baños.'),
    body('lat').isNumeric().withMessage('Ubique la propiedad en el Mapa.'),
    guardarCambios)

router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminar
)

router.put('/propiedades/:id',
    protegerRuta,
    cambiarEstado
)

// Area publica
router.get('/propiedad/:id', 
    identificarUsuario,
    mostrarPropiedad
)


// Almacenar los mensajes
router.post('/propiedad/:id', 
    identificarUsuario,
    body('mensaje').isLength({min: 10}).withMessage('El mensaje no puede ir vacio o es muy corto'),
    enviarMensaje
)

router.get('/mensajes/:id',
    protegerRuta,
    verMensajes
)


export default router;