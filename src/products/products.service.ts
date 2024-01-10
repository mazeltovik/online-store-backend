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
          include: { colors: true },
        });
      } else {
        return this.prisma.products.findMany({
          skip: 0,
          take: Number(limit),
          include: { colors: true },
        });
      }
    }
    return this.prisma.products.findMany({ include: { colors: true } });
  }
  async findOne(id: string) {
    const product = await this.prisma.products.findFirst({
      where: { id },
      include: {
        colors: {
          select: {
            clr_000: true,
            clr_0000ff: true,
            clr_00ff00: true,
            clr_ff0000: true,
            clr_ffb900: true,
          },
        },
      },
    });
    if (product) {
      return product;
    } else {
      throw new NotFoundException('Product was not found.');
    }
  }
}
