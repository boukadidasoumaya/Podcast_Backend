import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBookmarkDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  episodeId: number;
}
