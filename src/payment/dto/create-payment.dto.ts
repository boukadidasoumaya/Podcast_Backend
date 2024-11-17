import { IsNotEmpty, IsNumber, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 10 })
  amount: number;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({ example: '2024-12-01T00:00:00Z' })
  expirationDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true })
  isPremium: boolean;

}
