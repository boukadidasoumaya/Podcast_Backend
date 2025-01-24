import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}
  @Post()
  async create(@Body() createOwnerDto: CreateOwnerDto) {
      const owner = await this.ownerService.create(createOwnerDto);
      return owner;
    }

  @Get()
  async getAllOwners() {
    return this.ownerService.getOwnersWithInterests();
  }

}
