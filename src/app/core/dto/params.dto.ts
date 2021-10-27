/** @format */

import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class IdentifierDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly id: number;
}
