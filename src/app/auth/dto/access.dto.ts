/** @format */

import { ApiProperty } from '@nestjs/swagger';

export class AccessDto {
  @ApiProperty({
    default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access: string;
}
