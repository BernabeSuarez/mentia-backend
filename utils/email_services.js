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
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f1f5f9;
      padding: 20px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      padding: 48px 32px;
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .header p {
      font-size: 16px;
      opacity: 0.95;
      font-weight: 400;
    }
    .content {
      padding: 40px 32px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 16px;
    }
    .intro-text {
      font-size: 15px;
      color: #475569;
      margin-bottom: 28px;
      line-height: 1.7;
    }
    .credentials-card {
      background: linear-gradient(to right, #eff6ff, #f0f9ff);
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 24px;
      margin: 28px 0;
      border-left: 4px solid #2563eb;
    }
    .credentials-card h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 16px;
    }
    .credential-item {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #e0f2fe;
    }
    .credential-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .credential-label {
      font-weight: 600;
      color: #334155;
      min-width: 140px;
      font-size: 14px;
    }
    .credential-value {
      color: #0f172a;
      font-size: 14px;
      word-break: break-word;
    }
    .alert-box {
      background-color: #fef3c7;
      border: 1px solid #fde047;
      border-radius: 10px;
      padding: 16px 20px;
      margin: 24px 0;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .alert-icon {
      font-size: 20px;
      flex-shrink: 0;
    }
    .alert-text {
      font-size: 14px;
      color: #78350f;
      line-height: 1.6;
    }
    .alert-text strong {
      font-weight: 600;
    }
    .button-container {
      text-align: center;
      margin: 32px 0 24px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
    }
    .help-text {
      font-size: 14px;
      color: #64748b;
      text-align: center;
      margin-top: 24px;
      line-height: 1.6;
    }
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e2e8f0, transparent);
      margin: 32px 0;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 13px;
      color: #64748b;
      line-height: 1.6;
    }
    .footer-brand {
      margin-top: 12px;
      font-weight: 600;
      color: #2563eb;
      font-size: 14px;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 10px;
      }
      .header {
        padding: 32px 24px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 28px 24px;
      }
      .credentials-card {
        padding: 20px;
      }
      .credential-item {
        flex-direction: column;
        gap: 4px;
      }
      .credential-label {
        min-width: auto;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Bienvenido a Mentia Academy!</h1>
      <p>Estamos emocionados de tenerte con nosotros</p>
    </div>
    
    <div class="content">
      <div class="greeting">Hola ${nombre} 👋</div>
      
      <p class="intro-text">
        Tu cuenta ha sido creada exitosamente. Estás a un paso de comenzar tu viaje de aprendizaje. 
        A continuación encontrarás tus credenciales de acceso a la plataforma:
      </p>
      
      <div class="credentials-card">
        <h3>📋 Tus credenciales de acceso</h3>
        <div class="credential-item">
          <span class="credential-label">Usuario:</span>
          <span class="credential-value">${nombre}</span>
        </div>
        <div class="credential-item">
          <span class="credential-label">Email:</span>
          <span class="credential-value">${email}</span>
        </div>
        <div class="credential-item">
          <span class="credential-label">Contraseña temporal:</span>
          <span class="credential-value">${password}</span>
        </div>
      </div>
      
      <div class="alert-box">
        <span class="alert-icon">⚠️</span>
        <div class="alert-text">
          <strong>Importante:</strong> Por tu seguridad, te recomendamos cambiar tu contraseña 
          al iniciar sesión por primera vez.
        </div>
      </div>
      
      <div class="button-container">
        <a href="https://campus.mentiaacademy.es" class="button" target="_blank" rel="noopener">
          Acceder a la plataforma →
        </a>
      </div>
      
      <div class="divider"></div>
      
      <p class="help-text">
        ¿Necesitas ayuda? No dudes en contactarnos. Estamos aquí para apoyarte en cada paso.
      </p>
    </div>
    
    <div class="footer">
      <p>
        Este es un correo automático, por favor no respondas a este mensaje.<br>
        Si no solicitaste esta cuenta, puedes ignorar este correo de forma segura.
      </p>
      <p class="footer-brand">Mentia Academy</p>
    </div>
  </div>
</body>
</html>
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

// Función para enviar email al administrador sobre nueva matrícula
export async function enviarEmailMatriculaAdmin(datosMatricula) {
  const { fullName, email, phone, courseName, sessionId } = datosMatricula;

  const mailOptions = {
    from: `"Mentia Academy" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Email del administrador
    subject: `🎓 Nueva Matrícula - ${courseName}`,
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f1f5f9;
      padding: 20px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .content {
      padding: 32px 24px;
    }
    .alert-card {
      background: linear-gradient(to right, #f0fdf4, #dcfce7);
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      border-left: 4px solid #22c55e;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 20px 0;
    }
    .info-item {
      padding: 16px;
      background-color: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .info-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      font-weight: 600;
    }
    .info-value {
      font-size: 14px;
      color: #1e293b;
      font-weight: 500;
      word-break: break-word;
    }
    .actions {
      background-color: #fff7ed;
      border: 1px solid #fed7aa;
      border-radius: 10px;
      padding: 20px;
      margin: 24px 0;
    }
    .actions h3 {
      color: #ea580c;
      margin-bottom: 12px;
      font-size: 16px;
    }
    .actions ul {
      margin-left: 20px;
      color: #9a3412;
      font-size: 14px;
      line-height: 1.6;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 24px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 12px;
      color: #64748b;
    }
    @media only screen and (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
      .content {
        padding: 24px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Nueva Matrícula Confirmada</h1>
    </div>
    
    <div class="content">
      <div class="alert-card">
        <h3>✅ ¡Buenas noticias!</h3>
        <p>Un nuevo usuario se ha matriculado exitosamente en uno de los cursos.</p>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Nombre Completo</div>
          <div class="info-value">${fullName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Email</div>
          <div class="info-value">${email}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Teléfono</div>
          <div class="info-value">${phone || 'No proporcionado'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Curso</div>
          <div class="info-value">${courseName}</div>
        </div>
        <div class="info-item" style="grid-column: span 2;">
          <div class="info-label">ID de Sesión</div>
          <div class="info-value">${sessionId}</div>
        </div>
      </div>
      
      <div class="actions">
        <h3>⚠️ Acciones Requeridas</h3>
        <ul>
          <li>Dar de alta al usuario en la plataforma del curso: <strong>${courseName}</strong></li>
          <li>Verificar que el pago ha sido procesado correctamente</li>
          <li>Enviar credenciales de acceso si es necesario</li>
        </ul>
      </div>
    </div>
    
    <div class="footer">
      <p>Este es un correo automático del sistema de Mentia Academy</p>
    </div>
  </div>
</body>
</html>
`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Email de matrícula enviado al administrador:', info.messageId);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    logger.error('Error al enviar email de matrícula:', error);
    throw error;
  }
}
