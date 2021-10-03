/** @format */

import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  exports: [CategoriesService, CategoriesRepository],
  providers: [CategoriesService, CategoriesRepository]
})
export class CategoriesModule {}
