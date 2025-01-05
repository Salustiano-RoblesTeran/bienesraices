import express from 'express';
import { formularioLogin, formularioRegistro, registrar, formularioOlvidePassword, confirmar, resetPassword, comprobarToken, nuevopassword, autenticar, cerrarSesion } from '../controllers/usuarioCtrl.js'


const router = express.Router();

router.get('/login', formularioLogin);
router.post('/login', autenticar);

// Cerrar sesion
router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token', confirmar)

router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', resetPassword)

// Almacenar el nuevo password
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevopassword)





export default router;