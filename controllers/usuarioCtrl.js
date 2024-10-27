import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt'

import Usuario from "../models/Usuario.js"

import { generarJWT, generarId } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'


const formularioLogin = (req, res) =>{
        res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken()
        })
}

const autenticar = async (req, res) => {
    // Validacion en autenticar
    await check('email').isEmail().withMessage("El email es obligatorio.").run(req);
    await check('password').notEmpty().withMessage("El password es obligatorio.").run(req);  

        // Recoger resultados de validación
        let resultado = validationResult(req);

        // Verificar si hay errores en los campos individuales
        if (!resultado.isEmpty()) {
            return res.render('auth/login', {
                pagina: 'Iniciar Sesion',
                csrfToken: req.csrfToken(),
                errores: resultado.array(),
            });
        }

        const { email, password } = req.body;

        // Comprobar el usuario existe.
        const usuario = await Usuario.findOne({where: {email}})
        if (!usuario) {
            return res.render('auth/login', {
                pagina: 'Iniciar Sesion',
                csrfToken: req.csrfToken(),
                errores: [{
                    msg: "El usuario no existe."
                }]
            });
        }

        // Comprobar si el usuario esta confirmado
        if (!usuario.confirmado) {
            return res.render('auth/login', {
                pagina: 'Iniciar Sesion',
                csrfToken: req.csrfToken(),
                errores: [{
                    msg: "Tu cuenta no a sido confirmada."
                }]
            });
        }

        if(!usuario.verificarPassword(password)) {
            return res.render('auth/login', {
                pagina: 'Iniciar Sesion',
                csrfToken: req.csrfToken(),
                errores: [{
                    msg: "El password es incorrecto."
                }]
            });
        }

        // Autenticar usuario
        const token = generarJWT({ id: usuario.id, nombre: usuario.nombre})

        // Almacenar en un cookie
        return res.cookie('_token', token, {
            httpOnly: true,
            // secure: true,
            // sameSite: true
        }).redirect('./mis-propiedades')
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
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: req.csrfToken(),
    })
}

const resetPassword  = async (req, res) => {
        // Validación
        await check('email').isEmail().withMessage("Debes ingresar un email válido.").run(req);
    
        // Recoger resultados de validación
        let resultado = validationResult(req);
    
        // Verificar si hay errores en los campos individuales
        if (!resultado.isEmpty()) {
            return res.render('auth/olvide-password', {
                pagina: 'Recupera tu acceso a Bienes Raices',
                csrfToken: req.csrfToken(),
                errores: resultado.array()
            });
        }

        // Buscar el usuario

        const { email } = req.body

        const usuario = await Usuario.findOne({ where: {email}})

        if (!usuario) {
            return res.render('auth/olvide-password', {
                pagina: 'Recupera tu acceso a Bienes Raices',
                csrfToken: req.csrfToken(),
                errores: [{msg: "El email no pertenece a ningun usuario."}]
            });
        }

        // Generar un token y enviar el email
        usuario.token = generarId();
        await usuario.save();

        // Enviamos un email
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        // Renderizar un mensaje 

        res.render('templates/mensaje', {
            pagina: 'Restablece tu password',
            mensaje: 'Hemos Enviado un Mail con las Instrucciones.'
        });
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({where: {token}}) 

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu password',
            mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo.',
            error: true
        })
    }

    // Mostrar un formulario para modificar password
    res.render('auth/reset-password', {
        pagina: 'Restablece Tu Password',
        csrfToken: req.csrfToken(),
  
    })
}

const nuevopassword = async (req, res) => {
    // Validar el password
    await check('password').isLength({ min: 6 }).withMessage("La contraseña debe ser de al menos 6 caracteres.").run(req);

    // Recoger resultados de validación
    let resultado = validationResult(req);

    // Verificar si hay errores en los campos individuales
    if (!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            pagina: 'Restablece Tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        });
    }

    const { token } = req.params;
    const { password } = req.body;

    // Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}})

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password Restablecido',
        mensaje: 'El Password se Guardo Correctamente.'
    })
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    formularioOlvidePassword,
    resetPassword,
    registrar,
    confirmar,
    comprobarToken,
    nuevopassword
}