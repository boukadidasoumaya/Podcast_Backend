import { Injectable } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner.entity';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner) 
    private readonly ownerRepository: Repository<Owner>,
  ) {}
  async getOwnersWithInterests(): Promise<{ name: string; interests: string[] }[]> {
    const owners = await this.ownerRepository.find();
  
    return owners.map(owner => ({
      name: owner.username, 
      interests: owner.interests.map(interest => interest.toString()), 
    }));
  }
  
}
