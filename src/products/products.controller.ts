import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryKeys } from './entities/queryTypes';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
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
}
