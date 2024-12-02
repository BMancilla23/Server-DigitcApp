import nodemailer from "nodemailer";

// Función para enviar correo con Nodemailer
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ID as string,
      pass: process.env.MP as string,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_ID,
    to,
    subject,
    text,
    html,
  });
};
