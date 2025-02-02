import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { LikeEpisode } from './entities/like-episode.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from '../episode/entities/episode.entity';
import { User } from '../user/entities/user.entity';
import { CreateLikeEpisodeDto } from './dto/create-like-episode.dto';
import { DeleteLikeEpisodeDto } from './dto/delete-like-episode.dto';
import { EpisodeService } from '../episode/episode.service';
import { UserService } from '../user/user.service';

@Injectable()
export class LikeEpisodeService {
  constructor(
    @InjectRepository(LikeEpisode)
    private likeEpisodeRepository: Repository<LikeEpisode>,
    private readonly userService: UserService,
    private readonly episodeService: EpisodeService,
  ) {}

  async likeEpisode(
    createLikeEpisodeDto: CreateLikeEpisodeDto,
  ): Promise<LikeEpisode> {
    const { user, episode } = createLikeEpisodeDto;
    console.log(episode);
    console.log(typeof user);
    // Vérification si l'utilisateur existe
    const existingUser = await this.userService.findOne(user.id);
    console.log(existingUser);
    if (!existingUser) {
      throw new NotFoundException("User doesn't exist.");
    }

    // Vérification si l'épisode existe
    const existingEpisode = await this.episodeService.findOne(episode.id);
    if (!existingEpisode) {
      throw new NotFoundException("Episode doesn't exist.");
    }

    // Vérification si le like existe déjà pour cet utilisateur et cet épisode
    const existingLike = await this.likeEpisodeRepository.findOne({
      where: {
        user: { id: user.id },
        episode: { id: episode.id },
      },
    });

    if (existingLike) {
      throw new BadRequestException('You have already liked this episode');
    }
    const like = this.likeEpisodeRepository.create({
      user: user,
      episode: episode,
    });
    return await this.likeEpisodeRepository.save(like);
  }
  async unlikeEpisode(
    deleteLikeEpisodeDto: DeleteLikeEpisodeDto,
  ): Promise<void> {
    const { user, episode } = deleteLikeEpisodeDto;

    // Vérification si le like existe pour cet utilisateur et cet épisode
    const existingLike = await this.likeEpisodeRepository.findOne({
      where: {
        user: { id: user.id }, // Utilisation de user.id
        episode: { id: episode.id }, // Utilisation de episode.id
      },
    });

    if (!existingLike) {
      throw new NotFoundException("Vous n'avez pas liké cet épisode.");
    }

    // Suppression du like
    await this.likeEpisodeRepository.delete(existingLike.id);
  }

  async getEpisodeLikesCount(): Promise<any> {
    const episodes = await this.episodeService.findAll();

    const episodeIds = episodes.map((episode) => episode.id);
    const likes = await this.likeEpisodeRepository
      .createQueryBuilder('like_episode')
      .select(
        'like_episode.episodeId, COUNT(like_episode.id) as like_count, like_episode.userId',
      )
      .where('like_episode.episodeId IN (:...episodeIds)', { episodeIds })
      .groupBy('like_episode.episodeId, like_episode.userId')
      .getRawMany();

    const episodeLikesMap = new Map<
      number,
      { likeCount: number; users: number[] }
    >();

    likes.forEach((like) => {
      if (!episodeLikesMap.has(like.episodeId)) {
        episodeLikesMap.set(like.episodeId, { likeCount: 0, users: [] });
      }
      episodeLikesMap.get(like.episodeId)!.likeCount += Number(like.like_count);
      episodeLikesMap.get(like.episodeId)!.users.push(like.userId);
    });

    return episodes.map((episode) => ({
      episode: episode.id,
      numberOfLikes: episodeLikesMap.get(episode.id)?.likeCount || 0,
      users:
        episodeLikesMap.get(episode.id)?.users.map((user) => ({ user })) || [],
    }));
  }
  async findLikedEpisodesByUser(user: User): Promise<Episode[]> {
    console.log(user);
    const likedEpisodes = await this.likeEpisodeRepository.find({
      where: { user: { id: user.id } },
      relations: ['episode'],
    });
    return likedEpisodes.map((like) => like.episode);
  }

}
