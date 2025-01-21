import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async create(user: User) {
  

    // Check if the user has already liked this podcast
    const existingLike = await this.likeRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (existingLike) {
      throw new ForbiddenException("Vous avez déjà aimé ce podcast");
    }

    const newLike = this.likeRepository.create({
      user,
      //podcastId, 
    });

    await this.likeRepository.save(newLike);

    return 'Podcast aimé avec succès';
  }

  async findAll(user: User): Promise<Like[]> {
    return await this.likeRepository.find({
      where: { user: { id: user.id } },
      // We will leave relations empty for now
    });
  }

  async remove(id: number, user: User) {
    const likeToRemove = await this.likeRepository.findOne({
      where: { id },
    });

    if (!likeToRemove) {
      throw new NotFoundException(`Like avec l'ID ${id} non trouvé`);
    }

    if (likeToRemove.user.id === user.id) {
      return await this.likeRepository.remove(likeToRemove);
    } else {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à supprimer ce like");
    }
  }
}
