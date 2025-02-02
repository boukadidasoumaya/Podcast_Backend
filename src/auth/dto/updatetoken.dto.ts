import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTokenDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'soumaya.boukadida@insat.ucar.tn' })
  email: string;
}