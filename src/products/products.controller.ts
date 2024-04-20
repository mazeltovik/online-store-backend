import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryKeys } from './entities/queryTypes';
import { RatingDto } from './dto/rating-user.dto';
import { Public } from 'src/decorators/publicPath';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryKeys) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.productsService.findOne(id);
    } catch (err) {
      throw err;
    }
  }

  @Get('rating/:id')
  getRating(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.productsService.getRating(id);
    } catch (err) {
      throw err;
    }
  }
  @Put('rating/:id')
  updateRating(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateRating: RatingDto,
  ) {
    try {
      return this.productsService.updateRating(id, updateRating);
    } catch (err) {
      throw err;
    }
  }
}
