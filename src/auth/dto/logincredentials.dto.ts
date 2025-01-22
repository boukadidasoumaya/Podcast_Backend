import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'soumaya.boukadida@insat.ucar.tn' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: '12345678' })
  password: string;
}
