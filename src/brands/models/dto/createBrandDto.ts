import { IsString, Length } from 'class-validator';

export class CreateBrandDto {
  @IsString({
    message: 'El parametro name es obligatorio',
  })
  @Length(1, 100)
  name: string;
}
