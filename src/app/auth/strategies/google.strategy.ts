/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_AUTH_ID,
      clientSecret: process.env.GOOGLE_AUTH_SECRET,
      callbackURL: process.env.APP_ORIGIN + '/api/auth/google/redirect',
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
