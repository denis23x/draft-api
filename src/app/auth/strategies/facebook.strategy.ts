/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('FACEBOOK_AUTH_ID'),
      clientSecret: configService.get('FACEBOOK_AUTH_SECRET'),
      callbackURL: configService.get('APP_ORIGIN') + '/api/auth/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name']
    });
  }

  async validate(access: string, refresh: string, profile: Profile, callback: any): Promise<void> {
    const email = profile.emails.shift();

    callback(null, {
      name: email.value.split('@').shift(),
      email: email.value,
      facebookId: profile.id
    });
  }
}
