/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { CreateDto } from '../../users/users.dto';

type VerifyCallback = (err: any, user: any, info?: any) => void;

interface JsonProfile {
  familyName: string;
  givenName: string;
}

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
    a: string,
    r: string,
    profile: Profile,
    verifyCallback: VerifyCallback
  ): Promise<any> {
    verifyCallback(null, {
      name: profile.displayName || this.getName(profile.name),
      email: profile.emails[0].value,
      facebookId: profile.id
    } as CreateDto);
  }

  private getName(json: JsonProfile): string {
    return [json.givenName || '', json.familyName || ''].join(' ').trim();
  }
}
