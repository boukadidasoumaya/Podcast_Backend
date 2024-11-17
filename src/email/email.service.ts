import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

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
}
