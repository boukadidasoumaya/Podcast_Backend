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
import { v4 as uuidv4 } from 'uuid';

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
            uuidv4()+'.'+file.mimetype.substring(6)
          );
        },
      }),
      fileFilter: (req, file, cb: multer.FileFilterCallback) => {
        if (!file.originalname.match(this.options.allowedFileTypes)) {
          return cb(
            new HttpException(
              'Seules les images PNG, JPEG, JPG et SVG sont autorisées',
              HttpStatus.BAD_REQUEST,
            ),
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
