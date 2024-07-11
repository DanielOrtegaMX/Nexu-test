import { Optional } from '@nestjs/common';
import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateModelDto {
  @IsString({
    message: 'El parametro name es obligatorio',
  })
  @Length(1, 100)
  name: string;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: 'El valor average_price debe ser un numero ',
    },
  )
  @Min(100000, {
    message: 'El valor average_price minimo debe ser 100,000',
  })
  @Optional()
  average_price: number;
}
