// config/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configuration pour le service de test d'e-mails de Mailtrap
export const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false, // Laisser sur 'false' car on utilise STARTTLS
  auth: {
    // Le nom d'utilisateur fourni par Mailtrap pour votre bac à sable (sandbox)
    user: "48b528f9a2ca13",
    // Le jeton (token) de mot de passe à stocker dans votre fichier .env
    pass: process.env.MAILTRAP_PASSWORD,
  },
  // STARTTLS est un protocole de chiffrement
  requireTLS: true,
});
