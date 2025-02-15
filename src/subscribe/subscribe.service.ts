import { Injectable } from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { UpdateSubscribeDto } from './dto/update-subscribe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscribeAll } from './entities/subscribe.entity';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(SubscribeAll)
    private subscriberRepository: Repository<SubscribeAll>,
  ) {}

  async create(createSubscribeDto: CreateSubscribeDto) {
    const { email } = createSubscribeDto;
    console.log(email)
        const existingSubscriber = await this.subscriberRepository.findOne({
      where: { email },
    });
    if (existingSubscriber) {
      throw new Error('Subscriber with this email already exists');
    }

    const subscriber = this.subscriberRepository.create({
      email,
    });
   

    return await this.subscriberRepository.save(subscriber);
  }


  async findAll() {
    return await this.subscriberRepository.find();
  
  }
  

  findOne(id: number) {
    return `This action returns a #${id} subscribe`;
  }

  update(id: number, updateSubscribeDto: UpdateSubscribeDto) {
    return `This action updates a #${id} subscribe`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscribe`;
  }
}
