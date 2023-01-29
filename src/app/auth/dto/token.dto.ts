/** @format */

import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  token: string;
}
