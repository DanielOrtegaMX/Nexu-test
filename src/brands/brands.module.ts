import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { ModelService } from 'src/models/models.service';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService, ModelService],
  imports: [],
})
export class BrandsModule {}
