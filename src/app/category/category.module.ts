/** @format */

import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  controllers: [CategoryController],
  exports: [CategoryService],
  providers: [CategoryService]
})
export class CategoryModule {}
