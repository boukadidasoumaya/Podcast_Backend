import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'example@test.com' })
  email: string;
  @IsNotEmpty()
  @ApiProperty({ example: 'Salah' })
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Foulen' })
  lastName: string;
  @IsNotEmpty()
  @ApiProperty({ example: 12345678 })
  phone: number;

  @IsNotEmpty()
  @ApiProperty({ example: 12345678 })

  password: string;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Photo of the user',
    required: false,
  })
  photo: string;
}
