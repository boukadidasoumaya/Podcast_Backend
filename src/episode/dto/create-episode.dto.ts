import { IsString, IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Name of the episode

  @IsNumber()
  @IsNotEmpty()
  number: number; // Episode number

  @IsBoolean()
  @IsNotEmpty()
  premium: boolean; // Whether the episode is premium

  @IsNumber()
  @IsNotEmpty()
  duration: number; // Duration of the episode in seconds

  @IsString()
  @IsNotEmpty()
  filepath: string; // Filepath to the episode file
}
