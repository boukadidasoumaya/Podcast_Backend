/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Admin } from './entities/admin.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { EmailService } from '../email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin, Payment, Podcast])],
  controllers: [UserController],
  providers: [UserService,EmailService],
  exports: [UserService],
})
export class UserModule {}
