import { Controller, Get, Param, Header } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':id')
  @Header('Content-Type', 'image/jpeg')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }
}
