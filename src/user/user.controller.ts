import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { QueryKeys } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('cart/:id')
  @HttpCode(200)
  getUserCart(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() query: QueryKeys,
  ) {
    try {
      return this.userService.getUserCart(id, query);
    } catch (err) {
      throw err;
    }
  }

  @Post('cart/:id')
  @HttpCode(200)
  addItemToCart(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: AddItemToCartDto,
  ) {
    try {
      return this.userService.addToCart(id, body);
    } catch (err) {
      throw err;
    }
  }

  @Put('cart/:id')
  @HttpCode(200)
  removeFromCart(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() removingItems: RemoveFromCartDto,
  ) {
    try {
      return this.userService.removeFromCart(id, removingItems);
    } catch (err) {
      throw err;
    }
  }
}
