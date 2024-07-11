import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BrandsModule } from './brands/brands.module';
import { ModelsModule } from './models/models.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    BrandsModule,
    ModelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
