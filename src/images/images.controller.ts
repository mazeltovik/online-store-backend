import { Controller, Get, Param, Header } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Public } from 'src/decorators/publicPath';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Public()
  @Get(':id')
  @Header('Content-Type', 'image/jpeg')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }
}
