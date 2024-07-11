import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Brand } from 'src/common/models/brands.model';
import { Model } from 'src/common/models/models.model';
import { CreateModelDto } from 'src/models/dto/createModel';
import { ModelService } from 'src/models/models.service';

@Injectable()
export class BrandsService {
  private readonly brandsFilePath = path.join(
    __dirname,
    '../../src/database/brands.json',
  );

  constructor(private modelService: ModelService) {
    this.initializeBrandsFile();
  }

  getBrands(): Brand[] {
    try {
      return this.getBrandsJson();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  getModelsByBrandName(brandId: number): Omit<Model, 'brand_name'>[] {
    try {
      const dataBrands = this.getBrandsJson();
      const brand = dataBrands.filter((b) => b.id == +brandId);
      if (brand.length) {
        const data = this.modelService.getModelsByBrandName(
          brand[0].brand_name,
        );
        return data.map(({ brand_name, ...rest }) => rest);
      } else {
        return [];
      }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  addBrand(name: string): Brand {
    const data = this.getBrandsJson();
    const existBrand = data.filter(
      (d) => d.brand_name.toLowerCase() == name.toLowerCase(),
    );
    if (existBrand.length) {
      throw new BadRequestException(`El nombre ${name} de la marca ya existe`);
    } else {
      const max = data.reduce((max, obj) => (obj.id > max ? obj.id : max), 0);
      const newBrand: Brand = {
        id: max + 1,
        brand_name: name,
        average_price: 0,
      };
      data.push(newBrand);
      fs.writeFileSync(this.brandsFilePath, JSON.stringify(data, null, 2));
      return newBrand;
    }
  }

  addModel(brandId: number, newModel: CreateModelDto) {
    const data = this.getBrandsJson();
    const existBrand = data.filter((d) => d.id == brandId);
    if (!existBrand.length) {
      throw new BadRequestException(`El id ${brandId} de la marca no existe`);
    }
    return this.modelService.createModel(newModel, existBrand[0].brand_name);
  }

  private initializeBrandsFile(): void {
    if (!fs.existsSync(this.brandsFilePath)) {
      const models: Model[] = this.modelService.getModels();
      const brands = this.groupModelsByBrandName(models);
      fs.writeFileSync(this.brandsFilePath, JSON.stringify(brands, null, 2));
    }
  }

  private groupModelsByBrandName(models: Model[]): Omit<Brand, 'name'>[] {
    const brandMap: { [key: string]: { total_price: number; count: number } } =
      {};
    models.forEach((model) => {
      if (!brandMap[model.brand_name]) {
        brandMap[model.brand_name] = { total_price: 0, count: 0 };
      }
      brandMap[model.brand_name].total_price += model.average_price;
      brandMap[model.brand_name].count += 1;
    });

    let idCounter = 1;
    return Object.keys(brandMap).map((brand_name) => ({
      id: idCounter++,
      brand_name,
      average_price: Number(
        (brandMap[brand_name].total_price / brandMap[brand_name].count).toFixed(
          2,
        ),
      ),
    }));
  }

  private getBrandsJson(): Brand[] {
    const data = fs.readFileSync(this.brandsFilePath, 'utf8');
    return JSON.parse(data);
  }

  private handleExceptions(error: any) {
    throw new InternalServerErrorException(
      `Check server logs ${JSON.stringify(error)}`,
    );
  }
}
