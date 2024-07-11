import { Optional } from '@nestjs/common';
import { IsNumber, IsString, Length, Min } from 'class-validator';

export class UpdateModelDto {
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
