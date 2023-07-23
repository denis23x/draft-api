/** @format */

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    description: 'Client unique identifier',
    default: 'swagger'
  })
  @IsNotEmpty()
  @IsString()
  fingerprint: string;
}
