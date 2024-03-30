import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
// import { userWithoutPassword } from '../helpers/userWithoutPassword';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { jwtConstants } from './constants';

const saltOrRounds = parseInt(process.env.CRYPT_SALT);

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signUp(signUpDto: CreateUserDto) {
    const { login, password, name } = signUpDto;
    const isLoginExist = await this.prisma.user.findFirst({ where: { login } });
    if (isLoginExist) {
      throw new ConflictException('Conflict. Login already exists');
    } else {
      const hash = await bcrypt.hash(password, saltOrRounds);
      const user = {
        id: uuidv4(),
        version: 1,
        login,
        name,
        password: hash,
      };
      await this.prisma.user.create({ data: user });
      return { statusCode: 200, message: 'User created' };
    }
  }

  async signIn(signInDto: SignInUserDto) {
    const { login, password } = signInDto;
    const isLoginExist = await this.prisma.user.findFirst({ where: { login } });
    if (
      isLoginExist &&
      (await this.checkPassword(password, isLoginExist.password))
    ) {
      const tokens = await this.getTokens(isLoginExist.id, isLoginExist.name);
      return tokens;
    } else {
      throw new ForbiddenException('Incorrect login or password');
    }
  }

  async checkPassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: jwtConstants.secret,
          expiresIn: jwtConstants.expireTokenTime,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: jwtConstants.refreshSecret,
          expiresIn: jwtConstants.expireRefreshTokenTime,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  async refreshTokens(id: string, refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing or invalid');
    }
    const isLoginExist = await this.prisma.user.findFirst({ where: { id } });
    if (isLoginExist) {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
      if (!payload) {
        throw new UnauthorizedException('Refresh token is missing or invalid');
      }
      const tokens = await this.getTokens(isLoginExist.id, isLoginExist.name);
      return tokens;
    }
  }
  async getUser(id: string) {
    const user = await this.prisma.cart.findFirst({
      where: {
        userId: id,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            login: true,
            name: true,
          },
        },
      },
    });
    return user;
  }
}
