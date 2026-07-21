const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 10000;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'moktarul@gmail.com';
const WEB_BUILD = path.join(__dirname, '..', 'web-build');

const app = express();
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, notify: NOTIFY_EMAIL });
});

app.post('/api/register', async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim();
    const phone = String(req.body?.phone || '').trim();
    const language = String(req.body?.language || 'English').trim();
    const message = String(req.body?.message || '').trim();

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Name, email and phone are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    await sendRegistrationEmail({ name, email, phone, language, message });

    return res.json({
      success: true,
      message: 'Registration successful! We will contact you shortly.',
    });
  } catch (err) {
    console.error('register failed', err);
    return res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.',
    });
  }
});

app.use(express.static(WEB_BUILD));

// SPA fallback (Express 5 — no bare "*")
app.use((req, res) => {
  res.sendFile(path.join(WEB_BUILD, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('App build missing. Run yarn build:web first.');
    }
  });
});

async function sendRegistrationEmail({ name, email, phone, language, message }) {
  const subject = `Mok Kannada — New Live Session Registration: ${name}`;
  const text = [
    'New 1-1 Live Session registration',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Language: ${language}`,
    `Message: ${message || '(none)'}`,
    `Time: ${new Date().toISOString()}`,
  ].join('\n');

  // 1) Resend (preferred if configured)
  if (process.env.RESEND_API_KEY) {
    const from = process.env.RESEND_FROM || 'Mok Kannada <onboarding@resend.dev>';
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [NOTIFY_EMAIL],
        reply_to: email,
        subject,
        text,
      }),
    });
    if (!r.ok) {
      const body = await r.text();
      throw new Error(`Resend failed: ${r.status} ${body}`);
    }
    return;
  }

  // 2) SMTP via nodemailer (optional)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // eslint-disable-next-line global-require
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject,
      text,
    });
    return;
  }

  // 3) Zero-config fallback — FormSubmit (recipient must confirm first mail once)
  const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(NOTIFY_EMAIL)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      language,
      message: message || '(none)',
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
    }),
  });
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`FormSubmit failed: ${r.status} ${body}`);
  }
}

app.listen(PORT, () => {
  console.log(`Mok Kannada listening on :${PORT}`);
  console.log(`Notify email: ${NOTIFY_EMAIL}`);
});
