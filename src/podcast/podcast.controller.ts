import { Injectable } from '@nestjs/common';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Podcast } from './entities/podcast.entity';

@Injectable()
export class PodcastService {
  private podcasts: Podcast[] = [];
  private idCounter = 1;

  create(createPodcastDto: CreatePodcastDto): Podcast {
    const newPodcast: Podcast = { id: this.idCounter++, ...createPodcastDto };
    this.podcasts.push(newPodcast);
    return newPodcast;
  }

  findAll(): Podcast[] {
    return this.podcasts;
  }

  findOne(id: number): Podcast {
    return this.podcasts.find(podcast => podcast.id === id);
  }

  update(id: number, updatePodcastDto: UpdatePodcastDto): Podcast {
    const podcastIndex = this.podcasts.findIndex(podcast => podcast.id === id);
    if (podcastIndex === -1) {
      throw new Error('Podcast not found');
    }
    this.podcasts[podcastIndex] = { ...this.podcasts[podcastIndex], ...updatePodcastDto };
    return this.podcasts[podcastIndex];
  }

  remove(id: number): void {
    this.podcasts = this.podcasts.filter(podcast => podcast.id !== id);
  }
}
