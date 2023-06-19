import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: Express.Multer.File | Express.Multer.File[],
    _metadata: ArgumentMetadata,
  ): Express.Multer.File | Express.Multer.File[] {
    return files;
  }
}
