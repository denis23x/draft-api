/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { CreateDto } from '../../users/users.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_AUTH_ID,
      clientSecret: process.env.GOOGLE_AUTH_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK,
      scope: ['email', 'profile']
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    verifyCallback: VerifyCallback
  ): Promise<void> {
    const email = profile.emails.shift();

    verifyCallback(null, {
      name: email.value.split('@').shift(),
      email: email.value,
      googleId: profile.id
    } as CreateDto);
  }
}
