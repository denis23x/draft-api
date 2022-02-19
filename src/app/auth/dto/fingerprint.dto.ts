/** @format */

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FingerprintDto {
  @ApiProperty({
    description: 'Client unique identifier',
    default: 'sPx5uhkrzLbrJNvtEbKl'
  })
  @IsString()
  fingerprint: string;
}
