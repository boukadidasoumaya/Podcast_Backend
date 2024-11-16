import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EventPayloads } from '../shared/interface/event-types.interface';
import { OnEvent } from '@nestjs/event-emitter';


@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService) {}

  private readonly BATCH_EMAIL_SIZE = 30;

  @OnEvent('admin.create')
  async sendRegistrationEmail(data: EventPayloads['admin.create']) {
    const { name, email, password } = data;
    const subject = `Bienvenue dans Junior Entreprise INSAT`;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'create-admin',
      context: {
        name,
        email,
        password,
      },
    });
  }
  @OnEvent('forgot.password')
  async sendReinitialisationEmail(data: EventPayloads['forgot.password']) {
    const { resetcode, email, name } = data;
    const subject = `Code de réinitialisation du mot de passe`;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: 'forgot-password-admin',
      context: {
        name,
        resetcode,
      },
    });
  }
}
