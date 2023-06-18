/** @format */

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailConfirmationDto {
  @ApiProperty({
    description: 'Token',
    default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
