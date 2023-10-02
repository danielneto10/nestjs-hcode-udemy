import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileValidatorPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    const file = value;

    console.log(file.size);

    // Validation file exists
    if (!file) {
      throw new BadRequestException('File not found');
    }

    // Validation file size max 3MB
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File too large');
    }

    // Validation file type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed: jpg, png, gif',
      );
    }

    return value;
  }
}
