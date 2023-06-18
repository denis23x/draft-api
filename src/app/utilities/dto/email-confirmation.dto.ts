/** @format */

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailConfirmationDto {
  @ApiProperty({
    description: 'Token'
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
