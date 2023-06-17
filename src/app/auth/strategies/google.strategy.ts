/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_AUTH_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_SECRET'),
      callbackURL: configService.get('APP_ORIGIN') + '/api/auth/google/redirect',
      scope: ['email', 'profile']
    });
  }

  async validate(access: string, refresh: string, profile: Profile, callback: any): Promise<void> {
    const email = profile.emails.shift();

    callback(null, {
      name: email.value.split('@').shift(),
      email: email.value,
      googleId: profile.id
    });
  }
}
