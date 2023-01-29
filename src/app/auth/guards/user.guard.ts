/** @format */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request } from 'express';
import { Observable, of } from 'rxjs';

@Injectable()
export class UserRelationGuard implements CanActivate {
  canActivate(executionContext: ExecutionContext): Observable<boolean> {
    const httpArgumentsHost: HttpArgumentsHost = executionContext.switchToHttp();

    const request: Request = httpArgumentsHost.getRequest<Request>();

    const idRequest: number = Number(request.params.id);
    const idUser: number = Number((request.user as any).id);

    return of(idRequest === idUser);
  }
}
