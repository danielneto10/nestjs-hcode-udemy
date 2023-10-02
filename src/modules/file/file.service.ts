import { BadRequestException, Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File, path: string) {
    if (!file) {
      throw new BadRequestException('File not found');
    }

    return writeFile(path, file.buffer);
  }
}
