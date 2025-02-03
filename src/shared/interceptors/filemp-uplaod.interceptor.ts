import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { concatMap, Observable } from 'rxjs';
import { diskStorage } from 'multer';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  constructor(
    private readonly options: {
      fieldName: string;
      destination: string;
      allowedFileTypes: RegExp;
      fileSizeLimit: number;
      defaultPhotoPath?: string;
    },
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const upload = multer({
      storage: diskStorage({
        destination: './uploads/' + this.options.destination,
        filename: (req, file, cb) => {
          cb(
            null,
            `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`,
          );
        },
      }),
      fileFilter: (req, file, cb: any) => {
        if (!file.originalname.match(this.options.allowedFileTypes)) {
          return cb(
            new HttpException(
              'Only MP4 and MP3 files are allowed',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: this.options.fileSizeLimit },
    }).single(this.options.fieldName);

    return new Observable((observer) => {
      upload(request, response, (err) => {
        if (err)
          observer.error(
            new HttpException(err.message, HttpStatus.BAD_REQUEST),
          );
        else if (request.file)
          request.body[this.options.fieldName] = request.file.path.replace(
            'uploads\\',
            '',
          );
        else if (this.options.defaultPhotoPath)
          request.body[this.options.fieldName] = this.options.defaultPhotoPath;

        observer.next(true);
        observer.complete();
      });
    }).pipe(concatMap(() => next.handle()));
  }
}

export const createFileUploadInterceptor = (options: {
  fieldName: string;
  destination: string;
  allowedFileTypes: RegExp;
  fileSizeLimit: number;
  defaultPhotoPath?: string;
}) => new FileUploadInterceptor(options);

// Example usage of the interceptor for MP4 and MP3 files
const mp4Mp3Interceptor = createFileUploadInterceptor({
  fieldName: 'file',
  destination: 'media',
  allowedFileTypes: /\.(mp4|mp3)$/i, // Allowed file types for MP4 and MP3
  fileSizeLimit: 50 * 1024 * 1024, // Limit size to 50 MB (adjust as needed)
});
