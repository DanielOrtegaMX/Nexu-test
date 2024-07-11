import { Module } from '@nestjs/common';
import { ModelService } from './models.service';
import { ModelsController } from './models.controller';

@Module({
  controllers: [ModelsController],
  providers: [ModelService],
  imports: [],
})
export class ModelsModule {}
