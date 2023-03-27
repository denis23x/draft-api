/** @format */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString()
  token: string;

  @ApiPropertyOptional({
    description: 'Password',
    minLength: 6,
    maxLength: 32
  })
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password?: string;
}
