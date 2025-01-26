import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { Subscriber } from 'rxjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  controllers: [SubscribeController],
  providers: [SubscribeService,EmailService],
})
export class SubscribeModule {}
