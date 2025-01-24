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

  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
      const owner = this.ownerRepository.create(createOwnerDto);
      return this.ownerRepository.save(owner);
    }

    async getOwnersWithInterests(): Promise<{ name: string; photo: string; interests: string[] }[]> {
      // Use the User entity directly to ensure the query picks up the 'username' field
      const owners = await this.ownerRepository.find({
        relations: ['interests'], // If you want to ensure the interests relation is fetched
        select: ['id', 'username', 'photo', 'interests'],  // Select 'username' from the 'User' fields
      });
    
      console.log(owners);
    
      return owners.map(owner => ({
        name: owner.username, // Accessing 'username' from the User entity
        photo: owner.photo,
        interests: Array.isArray(owner.interests)
          ? owner.interests.map(interest => interest.toString())
          : [], // Safeguard if 'interests' is not an array
      }));
    
    
  
}}
