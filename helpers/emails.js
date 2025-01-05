import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const { email, nombre, token } = datos;
    const port = process.env.PORT || 3000;
    
    await transport.sendMail({
      from: '"BienesRaices" <no-reply@bienesraices.com>',
      to: email,
      subject: 'Confirma tu cuenta en BienesRaices.com',
      text: 'Confirma tu cuenta en BienesRaices.com',
      html: `
        <p>Hola ${nombre}, confirma tu cuenta en BienesRaices.com</p>   
        <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${port}/auth/confirmar/${token}">Confirmar tu Cuenta</a></p> 
        <p>Si no creaste esta cuenta, puedes ignorar el mensaje.</p>
      `
    });
  } catch (error) {
    console.error('Error enviando correo de registro:', error);
  }
};

const emailOlvidePassword = async (datos) => {
  try {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const { email, nombre, token } = datos;
    const port = process.env.PORT || 3000;

    await transport.sendMail({
      from: '"BienesRaices" <no-reply@bienesraices.com>',
      to: email,
      subject: 'Restablece tu password en BienesRaices.com',
      text: 'Restablece tu password en BienesRaices.com',
      html: `
        <p>Hola ${nombre}, has solicitado restablecer tu password en BienesRaices.com</p>   
        <p>Sigue el siguiente enlace para generar un nuevo password: <a href="${process.env.BACKEND_URL}:${port}/auth/olvide-password/${token}">Restablecer Password</a></p> 
        <p>Si no solicitaste el cambio de password, puedes ignorar el mensaje.</p>
      `
    });
  } catch (error) {
    console.error('Error enviando correo de olvido de password:', error);
  }
};

export {
  emailRegistro,
  emailOlvidePassword
};
