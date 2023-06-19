/** @format */

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordCheckGetDto {
  @ApiProperty({
    description: 'Password',
    minLength: 6,
    maxLength: 32,
    default: 'moder@moder.com'
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password: string;
}
