import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../shared/Decorators/user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: User,
  ) {
    return this.paymentService.createPayment(user, createPaymentDto);
  }

  @Get()
  async findAll() {
    return this.paymentService.getAllPayments();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.paymentService.getPaymentById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.updatePayment(id, updatePaymentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.paymentService.deletePayment(id);
    return { message: 'Payment successfully deleted' };
  }
}
