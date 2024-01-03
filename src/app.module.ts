import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ImagesModule } from './images/images.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProductsModule, ImagesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
