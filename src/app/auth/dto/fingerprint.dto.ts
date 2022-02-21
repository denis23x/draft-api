/** @format */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FingerprintDto {
  @ApiProperty({
    description: 'Client unique identifier',
    default: 'sPx5uhkrzLbrJNvtEbKl'
  })
  @IsNotEmpty()
  @IsString()
  fingerprint: string;
}
