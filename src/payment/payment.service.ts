import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { User } from '../user/entities/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Create Payment
  async createPayment(user: User, paymentDto: CreatePaymentDto) {
    if (!user) {
      throw new Error('User not found');
    }

    const payment = new Payment();
    payment.amount = paymentDto.amount;
    payment.date = new Date();
    payment.isPremium = paymentDto.isPremium;
    payment.expirationDate = paymentDto.expirationDate;
    payment.user = user;

    // Sauvegarde le paiement sans retourner l'utilisateur
    await this.paymentRepository.save(payment);

    // Retourne uniquement l'objet payment, sans l'entité user
    const { user: _, ...paymentWithoutUser } = payment;
    return paymentWithoutUser;
  }

  // Get All Payments
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.find({ relations: ['user'] });
  }

  // Get Payment by ID
  async getPaymentById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  // Update Payment
  async updatePayment(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.amount = updatePaymentDto.amount ?? payment.amount;
    payment.isPremium = updatePaymentDto.isPremium ?? payment.isPremium;
    payment.expirationDate =
      updatePaymentDto.expirationDate ?? payment.expirationDate;

    return this.paymentRepository.save(payment);
  }

  // Delete Payment
  async deletePayment(id: number): Promise<void> {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new Error('Payment not found');
    }

    await this.paymentRepository.remove(payment);
  }
}
