import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ModelService } from './models.service';
import { UpdateModelDto } from './dto/updateModelDto';
import { SearchModelQuery } from './dto/searchModelQuery';
import { Model } from 'src/common/models/models.model';

@Controller('models')
export class ModelsController {
  constructor(private modelsService: ModelService) {}

  @Get()
  filterModelsByPriceRange(
    @Query() query: SearchModelQuery,
  ): Omit<Model, 'brand_name'>[] {
    return this.modelsService.filterModelsByPriceRange(query);
  }

  @Put('/:id')
  findAll(@Body() model: UpdateModelDto, @Param('id') modelId: string) {
    return this.modelsService.updateModel(modelId, model);
  }
}
