import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import randomInt from 'src/helpers/randomInt';
import { Color } from 'src/helpers/reader';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private prisma: PrismaService) {}
  @Cron('0 00 12 * * 1')
  async handleCron() {
    await this.updateProducts();
    this.logger.debug('Database updated at 12am');
  }
  async updateProducts() {
    const products = await this.prisma.products.findMany({
      select: { id: true, availableColors: true, colors: true },
    });
    if (products) {
      for await (const product of products) {
        const { id, availableColors, colors } = product;
        const [currentColors] = colors;
        const {
          currentColors: updatedCurrentColors,
          availableColors: updatedAvailableColors,
        } = await this.updateExistingProduct(currentColors, availableColors);
        await this.prisma.color.update({
          where: { productId: id },
          data: updatedCurrentColors,
        });
        await this.prisma.products.update({
          where: { id },
          data: { availableColors: updatedAvailableColors },
        });
      }
    }
  }

  async updateExistingProduct(currentColors: Color, availableColors: string[]) {
    for (const key in currentColors) {
      if (key.includes('clr') && currentColors[key] == 0) {
        currentColors[key] = randomInt(1, 5);
        availableColors.push(key);
      }
    }
    return { currentColors, availableColors };
  }
}
