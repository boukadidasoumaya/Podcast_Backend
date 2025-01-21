import { IsString, IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  Title: string; // Name of the episode

  @IsNumber()
  @IsNotEmpty()
  number: number; // Episode number

  @IsNumber()
  @IsNotEmpty()
  duration: number; // Duration of the episode in seconds

  @IsString()
  @IsNotEmpty()
  filepath: string; // Filepath to the episode file
}
