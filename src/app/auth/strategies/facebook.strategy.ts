/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { CreateDto } from '../../users/users.dto';

type VerifyCallback = (error: any, user?: any, info?: any) => void;

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
    verifyCallback: VerifyCallback
  ): Promise<any> {
    const email = profile.emails.shift();

    verifyCallback(null, {
      name: email.value.split('@').shift(),
      email: email.value,
      facebookId: profile.id
    } as CreateDto);
  }
}
