import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User])], // Assurez-vous que Payment et User sont correctement ajoutés ici
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
