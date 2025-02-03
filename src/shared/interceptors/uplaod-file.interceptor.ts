import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileTypeInterceptor implements NestInterceptor {
  private readonly fileTypes = {
    image: /image\/(png|jpeg|jpg|svg\+xml)$/,
    video: /(audio\/mpeg|video\/mp4)$/,
  };

  constructor(private readonly type: 'image' | 'video') {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (!file) {
      throw new BadRequestException('Aucun fichier fourni.');
    }

    const allowedTypes = this.fileTypes[this.type];

    if (!allowedTypes.test(file.mimetype)) {
      throw new BadRequestException(
        this.type === 'image'
          ? 'Seules les images (PNG, JPEG, JPG, SVG) sont autorisées.'
          : 'Seuls les fichiers audio/vidéo (MP3, MP4) sont autorisés.',
      );
    }

    return next.handle();
  }
}

export const createFileTypeInterceptor = (type: 'image' | 'video') =>
  new FileTypeInterceptor(type);
