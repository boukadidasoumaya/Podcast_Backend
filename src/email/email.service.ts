import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRegistrationEmail(data) {
    const { name, email, password } = data;
    const subject = `Welcome to Potcast-eha`;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'create-admin', // Référence au fichier templates/create-admin.ejs
      context: {
        name,
        email,
        password,
      },
    });
  }

  async sendReinitialisationEmail(data) {
    const { resetcode, email, name } = data;
    const subject = `Code de réinitialisation du mot de passe`;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'forgot-password-admin', // Référence au fichier templates/forgot-password-admin.ejs
      context: {
        name,
        resetcode,
      },
    });
  }
  async sendSubscribeAllEmail(data) {
    const { email, name } = data;
    const subject = `You're In! Discover What's New on Podcast-eha`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'subscribe-all',
      context: {
        name,
        email,
      },
    });
  }

  async sendSubscriptionEmail(data) {
    const { name, email, podcast } = data;
    const subject = `Potcast-eha Subscription`;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'subscription',
      context: {
        name,
        email,
        podcast,
      },
    });
  }
  async newepisode(data) {
    const { name, email, podcast } = data;
    const subject = `Potcast-eha notification`;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'notification',
      context: {
        name,
        email,
        podcast,
      },
    });
  }
  async sendContactUsEmail(data) {
    const { email, subject, message } = data;
    const emailSubject = `New Message: ${subject}`;

    await this.mailerService.sendMail({
      to: process.env.EMAIL,
      from: email,
      subject: emailSubject,
      template: 'contact-us',
      context: {
        message,
      },
    });
  }
}
