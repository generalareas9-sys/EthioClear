// utils/mailer.js
// Minimal mailer wrapper — sends mail via SMTP if configuration is
// present in environment. If not, throws so callers can fall back.

const nodemailer = require('nodemailer');
const config = require('../config/env.config');

let transporter;

function ensureTransporter() {
  if (transporter) return transporter;
  // Read SMTP config from env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error('SMTP not configured');
  }

  transporter = nodemailer.createTransport({
    host,
    port: parseInt(port, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
  return transporter;
}

async function sendPasswordResetEmail(to, { fullName, resetUrl }) {
  const t = ensureTransporter();
  const subject = 'EthioClear password reset';
  const html = `
    <p>Hi ${fullName || ''},</p>
    <p>You recently requested to reset your EthioClear password. Click the link below to set a new password. This link will expire in 1 hour.</p>
    <p><a href="${resetUrl}">Reset your password</a></p>
    <p>If you did not request this, you can safely ignore this message.</p>
  `;
  await t.sendMail({ from: process.env.SMTP_FROM || 'no-reply@example.com', to, subject, html });
}

module.exports = { sendPasswordResetEmail };