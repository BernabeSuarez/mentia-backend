import nodemailer from 'nodemailer';
import { logger } from './logger.js';

// Configuración del transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para enviar email de bienvenida
export async function enviarEmailBienvenida(datosUsuario) {
  const { nombre, email, password } = datosUsuario;

  const mailOptions = {
    from: `"Mi Aplicación" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '¡Bienvenido! Tu cuenta ha sido creada',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .credentials {
            background-color: #f0f0f0;
            padding: 15px;
            border-left: 4px solid #4CAF50;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a nuestra plataforma!</h1>
          </div>
          <div class="content">
            <h2>Hola ${nombre},</h2>
            <p>Tu cuenta ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso:</p>
            
            <div class="credentials">
              <p><strong>Usuario:</strong> ${nombre}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Contraseña temporal:</strong> ${password}</p>
            </div>
            
            <p><strong>⚠️ Por tu seguridad, te recomendamos cambiar tu contraseña al iniciar sesión por primera vez.</strong></p>
            
            <a href="${process.env.APP_URL || 'https://servermentia.es'}/login" class="button">Iniciar Sesión</a>
            
            <p>Si no solicitaste esta cuenta, por favor ignora este correo.</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hola ${nombre},
      
      Tu cuenta ha sido creada exitosamente.
      
      Credenciales de acceso:
      Usuario: ${nombre}
      Email: ${email}
      Contraseña temporal: ${password}
      
      Por tu seguridad, te recomendamos cambiar tu contraseña al iniciar sesión por primera vez.
      
      Si no solicitaste esta cuenta, por favor ignora este correo.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Email enviado exitosamente:', info.messageId);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    logger.error('Error al enviar email:', error);
    throw error;
  }
}
