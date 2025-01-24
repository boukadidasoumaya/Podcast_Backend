import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeAll } from 'src/subscribe/entities/subscribe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailService {
  constructor( @InjectRepository(SubscribeAll)
  private readonly subscribeRepository: Repository<SubscribeAll>,
  private readonly mailerService: MailerService) {}

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
    const subscribers = await this.subscribeRepository.find();
    if (!subscribers.length) {
      throw new Error('No subscribers found in the SubscribeAll table.');
    }
    for (const subscriber of subscribers) {
      const { email } = subscriber;
      const subject = `You're In! Discover What's New on Podcast-eha`;
  
      try {
        await this.mailerService.sendMail({
          to: email,
          subject,
          template: 'subscribe-all', 
          context: {
            email, 
          },
        });
        console.log(`Email successfully sent to: ${email}`);
      } catch (error) {
        console.error(`Failed to send email to: ${email}`, error);
      }
    }
  }
}
