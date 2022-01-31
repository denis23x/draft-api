/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_AUTH_ID,
      clientSecret: process.env.FACEBOOK_AUTH_SECRET,
      callbackURL: process.env.FACEBOOK_AUTH_CALLBACK,
      scope: 'email',
      profileFields: ['emails', 'name']
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    verifyCallback: any
  ): Promise<void> {
    const email = profile.emails.shift();

    verifyCallback(null, {
      name: email.value.split('@').shift(),
      email: email.value,
      facebookId: profile.id
    });
  }
}
