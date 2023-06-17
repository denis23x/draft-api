/** @format */

import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get('JWT_SECRET'),
      signOptions: {
        audience: this.configService.get('JWT_AUDIENCE'),
        issuer: this.configService.get('JWT_ISSUER')
      },
      verifyOptions: {
        audience: this.configService.get('JWT_AUDIENCE'),
        issuer: this.configService.get('JWT_ISSUER')
      }
    };
  }
}
