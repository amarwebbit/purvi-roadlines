// Minimal Express server to receive form submissions and deliver them via SMTP
require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend (index.html and assets) from project root
app.use(express.static(path.join(__dirname)));

// Validate that required env vars are present
function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = (process.env.SMTP_SECURE === 'true');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || !process.env.TO_EMAIL) {
    throw new Error('Missing SMTP configuration. See .env.example');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

app.post('/send-email', async (req, res) => {
  const { name, email, phone, userType, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email or message.' });
  }

  let transporter;
  try {
    transporter = getTransport();
  } catch (err) {
    console.error('SMTP configuration error:', err.message);
    return res.status(500).json({ error: 'Server email configuration error.' });
  }

  const to = process.env.TO_EMAIL;
  const subject = `Website Inquiry: ${userType || 'User'} - ${name}`;

  const text = `New contact request:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nType: ${userType || 'N/A'}\n\nMessage:\n${message}`;

  const html = `
    <h2>New contact request from website</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    <p><strong>Type:</strong> ${userType || 'N/A'}</p>
    <h3>Message</h3>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      text,
      html
    });

    return res.json({ ok: true });
  } catch (err) {
    // Log the full error on the server and return the message in the response
    console.error('Error sending mail:', err);
    const msg = err && err.message ? String(err.message) : 'Unknown error';
    return res.status(500).json({ error: 'Failed to send email.', details: msg });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
