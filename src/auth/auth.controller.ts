import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { Public } from 'src/decorators/publicPath';
import { RefreshTokenGuard } from './refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @Post('signup')
  signUp(@Body() signUpDto: CreateUserDto) {
    try {
      return this.authService.signUp(signUpDto);
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @HttpCode(200)
  @Post('signin')
  signIn(@Body() signInDto: SignInUserDto) {
    try {
      return this.authService.signIn(signInDto);
    } catch (err) {
      throw err;
    }
  }

  // @UseGuards(RefreshTokenGuard)
  // @Public()
  // @Get('refresh')
  // refreshTokens(@Req() req: Request) {
  //   const userId = req.user['sub'];
  //   console.log(userId);
  //   // try {
  //   //   const [type, refreshToken] = req.headers.authorization?.split(' ') ?? [];
  //   //   return type === 'Bearer'
  //   //     ? this.authService.refreshTokens(userId, refreshToken)
  //   //     : this.authService.refreshTokens(userId, undefined);
  //   // } catch (err) {
  //   //   throw err;
  //   // }
  // }

  @Public()
  @HttpCode(200)
  @Get(':id')
  getUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return this.authService.getUser(id);
    } catch (err) {
      throw err;
    }
  }
}
