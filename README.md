# Purvi Roadlines — Contact form backend

This repository contains a minimal Node.js server which accepts the contact form submission from `index.html` and sends the data to a configured email address using SMTP (Nodemailer).

Why: your original form used `mailto:` which opens the user's email client. This server sends the email directly so submissions arrive to your mailbox automatically without relying on the visitor's mail app.

Quick start (Windows / PowerShell):

1. Copy `.env.example` to `.env` and fill in SMTP credentials and `TO_EMAIL`.

2. Install dependencies:

```powershell
npm install
```

3. Start the server:

```powershell
npm run start
# or for development with auto-reload (requires nodemon):
npm run dev
```

4. Open your site in a browser:

Point your browser to http://localhost:3000/ (or the port you set in `.env`). Submit the contact form — it will POST to `/send-email` and the server will deliver the message to `TO_EMAIL`.

Security & production notes:

- Do not keep SMTP credentials or `.env` in public source control. Use environment variables in your hosting provider (e.g., Vercel/Heroku/Azure) or a secrets manager.
- Consider adding rate-limiting and CAPTCHA to prevent spam.
- Use TLS (SMTP_SECURE=true with appropriate port) where supported.
- For high-volume or deliverability, use a transactional email provider (SendGrid, Mailgun, Amazon SES) and their SMTP/API.

If you'd like, I can also:

- Add rate-limiting and basic request validation.
- Add a small test to verify the endpoint.
- Show how to deploy this as a serverless function (Vercel, Netlify) or to Heroku/Azure.
