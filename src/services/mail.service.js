import nodemailer from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT) || 587,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    }

    async sendTicketConfirmation(toEmail, { reservationCode, eventTitle, quantity, eventDate }) {
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            console.warn('[MailService] Credenciales de correo no configuradas. Email omitido.');
            return;
        }

        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: toEmail,
            subject: `Confirmación de Inscripción - Código: ${reservationCode}`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>¡Inscripción Confirmada!</h2>
          <p>Tu lugar para el evento <strong>${eventTitle}</strong> ha sido reservado con éxito.</p>
          <ul>
            <li><strong>Código de Reserva:</strong> ${reservationCode}</li>
            <li><strong>Cantidad de Entradas:</strong> ${quantity}</li>
            <li><strong>Fecha del Evento:</strong> ${new Date(eventDate).toLocaleString()}</li>
          </ul>
          <p>Gracias por participar en nuestra plataforma.</p>
        </div>
      `
        };

        return await this.transporter.sendMail(mailOptions);
    }
}

export const mailService = new MailService();