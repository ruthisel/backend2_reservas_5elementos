import nodemailer from 'nodemailer';

class MailService {
    getTransporter() {
        return nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT) || 587,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    }

    async sendTicketCancellation(toEmail, { reservationCode, eventTitle }) {
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return;

        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: toEmail,
            subject: `Cancelación de Reserva - Código: ${reservationCode}`,
            html: `<p>Tu reserva con código <strong>${reservationCode}</strong> para el evento <strong>${eventTitle}</strong> ha sido cancelada exitosamente.</p>`
        };

        return await this.getTransporter().sendMail(mailOptions);
    }
}

export const mailService = new MailService();