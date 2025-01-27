import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeComment } from './entities/like-comment.entity';
import { CrudService } from '../common/common.service';  // Assurez-vous que le chemin d'importation est correct

@Injectable()
export class LikeCommentService extends CrudService<LikeComment> {
  constructor(
    @InjectRepository(LikeComment)
    private readonly likeCommentRepository: Repository<LikeComment>,
  ) {
    super(likeCommentRepository); // On passe le repository à la classe parente
  }
}
