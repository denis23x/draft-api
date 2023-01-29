/** @format */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FingerprintDto {
  @ApiProperty({
    description: 'Fingerprint',
    default: 'swagger'
  })
  @IsNotEmpty()
  @IsString()
  fingerprint: string;
}
