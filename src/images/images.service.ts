import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'node:path';

@Injectable()
export class ImagesService {
  findOne(id: string) {
    const path = join(process.cwd(), '/src', 'static', id);
    const file = createReadStream(path);
    return new StreamableFile(file);
  }
}
