import nodemailer from 'nodemailer';
import { config } from './config.js';

export const transport = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass
  }
});

export type AlertEmailParams = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail(p: AlertEmailParams): Promise<void> {
  await transport.sendMail({
    from: config.smtp.from,
    to: p.to,
    subject: p.subject,
    text: p.text
  });
}
