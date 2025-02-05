import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';



export class subscriptionPodcast {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsString()
  @IsOptional()
  name: string;
}