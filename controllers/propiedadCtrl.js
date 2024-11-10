import { validationResult } from 'express-validator'

import {Precio, Categoria, Propiedad} from '../models/index.js'



const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
    })
}

// Formulario para crear una nueva propiedad propiedad
const crear = async (req, res) => {
    // Modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req, res) => {
    // Validación
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        // Modelo de precios y categorías
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        });
    }

    // Crear un registro
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body;
    const { id: usuarioId } = req.usuario; 

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,  // Corrige aquí si estaba mal escrito
            habitaciones,
            estacionamiento, 
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen: ''
        });

        const { id } = propiedadGuardada;
        res.redirect(`/propiedades/agregar-imagen/${id}`);
    } catch (error) {
        console.log(error);
    }
};


const agregarImagen = async (req, res) => {

    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }


    // Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    // Valdat que la propiedad pertenece a quien visita esta pagina
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/agregar-imagen', {
        pagina: 'Agregar Imagen'
    })
}


export {
    admin,
    crear,
    guardar,
    agregarImagen
}