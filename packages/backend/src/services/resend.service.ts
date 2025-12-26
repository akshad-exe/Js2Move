import fs from 'fs';
import path from 'path';

export async function sendWaitlistConfirmation(email: string) {
  const templatePath = path.join(__dirname, '..', 'templates', 'waitlist-confirmation.html');
  let html = '<p>Thanks for joining</p>';
  try {
    html = fs.readFileSync(templatePath, 'utf8');
  } catch (err) {
    console.warn('Email template missing, using fallback');
  }

  // TODO: wire up real provider (Resend, SES, Sendgrid)
  console.log(`Sending email to ${email}`);
  return { email, html };
}
