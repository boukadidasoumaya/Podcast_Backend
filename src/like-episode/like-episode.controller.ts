import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { LikeEpisodeService } from './like-episode.service';
import { LikeEpisode } from './entities/like-episode.entity';
import { CreateLikeEpisodeDto } from './dto/create-like-episode.dto'; // DTO for validation
import { UpdateLikeEpisodeDto } from './dto/update-like-episode.dto'; // DTO for update

@Controller('like-episode')
export class LikeEpisodeController {
  constructor(private readonly likeEpisodeService: LikeEpisodeService) {}

  @Post()
  create(@Body() createLikeEpisodeDto: CreateLikeEpisodeDto): Promise<LikeEpisode> {
    return this.likeEpisodeService.create(createLikeEpisodeDto);
  }

  @Get()
  findAll(): Promise<LikeEpisode[]> {
    return this.likeEpisodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<LikeEpisode> {
    return this.likeEpisodeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateLikeEpisodeDto: UpdateLikeEpisodeDto,
  ): Promise<LikeEpisode> {
    return this.likeEpisodeService.update(id, updateLikeEpisodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.likeEpisodeService.remove(id);
  }
}
