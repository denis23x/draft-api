/** @format */

import { Injectable } from '@nestjs/common';
import { from, of, switchMap } from 'rxjs';
import { Post } from '../../posts/posts.entity';
import { Category } from '../../categories/categories.entity';
import { User } from '../../users/users.entity';
import { SelectQueryBuilder } from 'typeorm';

interface GetAllDto {
  page?: number;
  size?: number;
}

@Injectable()
export class HelperService {
  async pagination(
    selectQueryBuilder: SelectQueryBuilder<any>,
    getAllDto: GetAllDto
  ): Promise<any[]> {
    return await from(selectQueryBuilder.getMany())
      .pipe(
        switchMap((entity: User[] | Post[] | Category[]) => {
          if (!('page' in getAllDto) || !('size' in getAllDto)) {
            getAllDto = {
              page: 1,
              size: 10
            };
          }

          const page: number = (getAllDto.page - 1) * getAllDto.size;
          const limit: number = getAllDto.page * getAllDto.size;

          return of(entity.slice(page, limit));
        })
      )
      .toPromise();
  }
}
