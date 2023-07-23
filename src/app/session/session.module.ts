/** @format */

import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({
  controllers: [SessionController],
  exports: [SessionService],
  providers: [SessionService]
})
export class SessionModule {}
