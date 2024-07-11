import { IsOptional, IsNumberString } from 'class-validator';

export class SearchModelQuery {
  @IsOptional()
  @IsNumberString()
  greater?: string;

  @IsOptional()
  @IsNumberString()
  lower?: string;
}
