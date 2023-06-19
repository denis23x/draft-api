/** @format */

import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetGetDto {
  @ApiProperty({
    description: 'Email'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
