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
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendTicketCreatedEmail(clientEmail: string, ticketTitle: string) {
  const subject = 'Ticket Created - HelpDeskPro';
  const text = `Hello,\n\nYour ticket "${ticketTitle}" has been successfully created.\n\nThank you for contacting us.\n\nHelpDeskPro Team`;
  await sendEmail(clientEmail, subject, text);
}

export async function sendTicketResponseEmail(clientEmail: string, ticketTitle: string) {
  const subject = 'New Response on Your Ticket - HelpDeskPro';
  const text = `Hello,\n\nThere is a new response on your ticket "${ticketTitle}".\n\nHelpDeskPro Team`;
  await sendEmail(clientEmail, subject, text);
}

export async function sendTicketClosedEmail(clientEmail: string, ticketTitle: string) {
  const subject = 'Ticket Closed - HelpDeskPro';
  const text = `Hello,\n\nYour ticket "${ticketTitle}" has been closed.\n\nThank you for using HelpDeskPro.\n\nHelpDeskPro Team`;
  await sendEmail(clientEmail, subject, text);
}
