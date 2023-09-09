/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UtilitiesService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async postTestDummy(request: Request, body: any): Promise<any> {
    console.log(body);

    return 'postTestDummy';
  }
}
