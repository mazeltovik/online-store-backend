import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import randomInt from 'src/helpers/randomInt';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  findAll({ limit, random }) {
    if (limit) {
      if (random && random == 'true') {
        const skipValue = randomInt(1, 18);
        return this.prisma.products.findMany({
          skip: skipValue,
          take: 3,
        });
      } else {
        return this.prisma.products.findMany({
          take: Number(limit),
        });
      }
    }
    return this.prisma.products.findMany({});
  }
  async findOne(id: string) {
    const product = await this.prisma.products.findFirst({ where: { id } });
    if (product) {
      return product;
    } else {
      throw new NotFoundException('Product was not found.');
    }
  }
}
