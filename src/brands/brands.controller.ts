import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand } from 'src/common/models/brands.model';
import { CreateBrandDto } from './models/dto/createBrandDto';
import { CreateModelDto } from 'src/models/dto/createModel';
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandService: BrandsService) {}

  @Get()
  findAll(): Brand[] {
    return this.brandService.getBrands();
  }

  @Get('/:id/models')
  findByBrandName(@Param('id') brandName: number) {
    return this.brandService.getModelsByBrandName(brandName);
  }
  @Post()
  addBrand(@Body() newBrand: CreateBrandDto) {
    return this.brandService.addBrand(newBrand.name);
  }

  @Post('/:id/models')
  addModel(@Body() newModel: CreateModelDto, @Param('id') brandId: number) {
    return this.brandService.addModel(brandId, newModel);
  }
}
