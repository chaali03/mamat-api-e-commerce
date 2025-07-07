import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import { logger } from './logger.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Adashoop <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject, data = {}) {
    try {
      // 1) Render HTML based on a pug template
      const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject,
        ...data
      });

      // 2) Define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: convert(html)
      };

      // 3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
    } catch (err) {
      logger.error(`Failed to send email: ${err}`);
      throw err;
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Adashoop Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }

  async sendOTP(otp) {
    await this.send(
      'forgotPasswordOtp',
      'Your Password Reset OTP (valid for only 10 minutes)',
      { otp, expiryMinutes: 10 }
    );
  }

  async sendOrderConfirmation(order) {
    await this.send(
      'orderConfirmation',
      'Your Order Confirmation',
      { order }
    );
  }
}

export const sendOrderConfirmationEmail = async (user, order) => {
  const email = new Email(user, '');
  await email.sendOrderConfirmation(order);
};