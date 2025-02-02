import { Controller, Get, UseGuards } from '@nestjs/common';
import { LikeEpisodeService } from './like-episode.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../shared/Decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Episode } from '../episode/entities/episode.entity';

@Controller('like-episode')
export class LikeEpisodeController {
  constructor(private readonly likeEpisodeService: LikeEpisodeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async getLikedEpisodesByUser(@CurrentUser() user: User): Promise<Episode[]> {
    console.log(user);
    return this.likeEpisodeService.findLikedEpisodesByUser(user);
  }
}