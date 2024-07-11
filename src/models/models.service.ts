import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Model } from 'src/common/models/models.model';
import { CreateModelDto } from './dto/createModel';
import { UpdateModelDto } from './dto/updateModelDto';
import { SearchModelQuery } from './dto/searchModelQuery';

@Injectable()
export class ModelService {
  private readonly modelsFilePath = path.join(
    __dirname,
    '../../src/database/models.json',
  );

  getModels(): Model[] {
    try {
      const data = fs.readFileSync(this.modelsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  getModelsByBrandName(brandName: string): Model[] {
    const models: Model[] = this.getModelsJson();

    const filteredModels = models.filter(
      (model) => model.brand_name.toLowerCase() === brandName.toLowerCase(),
    );
    if (filteredModels.length === 0) {
      throw new NotFoundException(
        `No models found for brand name: ${brandName}`,
      );
    }

    return filteredModels;
  }

  createModel(model: CreateModelDto, brandName: string): Model {
    const models: Model[] = this.getModelsJson();
    const existModel = models.filter(
      (m) => m.name.toLowerCase() == model.name.toLowerCase(),
    );
    if (existModel.length) {
      throw new BadRequestException(
        `El nombre ${model.name} de la marca ya existe`,
      );
    } else {
      const max = models.reduce((max, obj) => (obj.id > max ? obj.id : max), 0);
      const newModel: Model = {
        id: max + 1,
        name: model.name,
        average_price: model.average_price,
        brand_name: brandName,
      };
      models.push(newModel);
      fs.writeFileSync(this.modelsFilePath, JSON.stringify(models, null, 2));
      return newModel;
    }
  }

  updateModel(modelId: string, model: UpdateModelDto) {
    const models: Model[] = this.getModelsJson();
    const existModel = models.filter((m) => m.id == +modelId);
    if (!existModel.length) {
      throw new BadRequestException(`El id  ${modelId} del modelo no existe`);
    } else {
      const updateModels = models.map((m) => {
        return {
          ...m,
          average_price:
            m.id === +modelId ? model.average_price : m.average_price,
        };
      });
      fs.writeFileSync(
        this.modelsFilePath,
        JSON.stringify(updateModels, null, 2),
      );
    }
  }

  filterModelsByPriceRange(
    query: SearchModelQuery,
  ): Omit<Model, 'brand_name'>[] {
    const models: Model[] = this.getModelsJson();

    const greater = query.greater ? parseFloat(query.greater) : 0;
    const lower = query.lower ? parseFloat(query.lower) : Number.MAX_VALUE;

    const modelsFiltered = models.filter(
      (model) => model.average_price > greater && model.average_price < lower,
    );
    return modelsFiltered.map(({ brand_name, ...rest }) => rest);
  }

  private getModelsJson(): Model[] {
    const data = fs.readFileSync(this.modelsFilePath, 'utf8');
    return JSON.parse(data);
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db `);
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
