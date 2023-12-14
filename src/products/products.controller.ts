import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryKeys } from './entities/queryTypes';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  async findAll(@Query() query: QueryKeys) {
    return this.productsService.findAll(query);
  }
}
