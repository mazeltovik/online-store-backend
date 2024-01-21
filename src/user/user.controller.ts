import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { QueryKeys } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
