import { check, validationResult } from 'express-validator';

import Usuario from "../models/Usuario.js"

import { generarId } from '../helpers/tokens.js'
import { emailRegistro } from '../helpers/emails.js'

const formularioLogin = (req, res) =>{
        res.render('auth/login', {
            pagina: 'Iniciar Sesion'
        })
}

const formularioRegistro = (req, res) =>{
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {
    // Validación
    await check('nombre').notEmpty().withMessage("El nombre no puede ir vacío.").run(req);
    await check('email').isEmail().withMessage("Debes ingresar un email válido.").run(req);
    await check('password').isLength({ min: 6 }).withMessage("La contraseña debe ser de al menos 6 caracteres.").run(req);
    await check('repetir_password').notEmpty().withMessage("Debes repetir tu contraseña.").run(req);
    await check('password').equals('repetir_password')

    // Recoger resultados de validación
    let resultado = validationResult(req);

    // Verificar si hay errores en los campos individuales
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        });
    }

    // Extraer los datos 
    const {nombre, email,  password, repetir_password } = req.body;

    // Comparar contraseñas
    if (password !== repetir_password) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: "Las contraseñas no coinciden." }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        });
    }

    
    // Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({where : {email}})

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{msg: "el usuario ya esta registrado."}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        });
    }


    // Almacenar usuario
const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    // Envia de email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    // Mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Mail de Confirmacion, Presiona en el enlace.'
    });
};

// Funcion que comprueba una cuenta
const confirmar = async (req, res) => {
    
    const { token } = req.params;

    // Verificar si el token es valido

    const usuario = await Usuario.findOne({where: {token}})
    
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }

    // Confirmar la cuenta

    usuario.token = null;
    usuario.confirmado = true;
    
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta fue confirmada con exito!',
    })
    
}



const formularioOlvidePassword = (req, res) =>{
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar
}