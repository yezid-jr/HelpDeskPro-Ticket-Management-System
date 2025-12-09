import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('Email enviado correctamente');
  } catch (error) {
    console.error('Error enviando email:', error);
  }
}

export async function sendTicketCreatedEmail(clientEmail: string, ticketTitle: string) {
  const subject = 'Ticket creado - HelpDeskPro';
  const text = `Hola,\n\nTu ticket "${ticketTitle}" ha sido creado exitosamente.\n\nGracias por contactarnos.\n\nEquipo HelpDeskPro`;
  await sendEmail(clientEmail, subject, text);
}

export async function sendTicketResponseEmail(clientEmail: string, ticketTitle: string) {
  const subject = 'Nueva respuesta en tu ticket - HelpDeskPro';
  const text = `Hola,\n\nHay una nueva respuesta en tu ticket "${ticketTitle}".\n\nEquipo HelpDeskPro`;
  await sendEmail(clientEmail, subject, text);
}

export async function sendTicketClosedEmail(clientEmail: string, ticketTitle: string) {
  const subject = 'Ticket cerrado - HelpDeskPro';
  const text = `Hola,\n\nTu ticket "${ticketTitle}" ha sido cerrado.\n\nGracias por usar HelpDeskPro.\n\nEquipo HelpDeskPro`;
  await sendEmail(clientEmail, subject, text);
}