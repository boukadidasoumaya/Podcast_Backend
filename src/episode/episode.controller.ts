import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';

@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Post()
  create(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodeService.create(createEpisodeDto);
  }

  @Get()
  findAll() {
    return this.episodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.episodeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    return this.episodeService.update(id, updateEpisodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.episodeService.remove(id);
  }
}
