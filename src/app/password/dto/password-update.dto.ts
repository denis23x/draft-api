/** @format */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordUpdateDto {
  @ApiProperty({
    description: 'Token',
    default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiPropertyOptional({
    description: 'Password',
    minLength: 6,
    maxLength: 32
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password: string;
}
