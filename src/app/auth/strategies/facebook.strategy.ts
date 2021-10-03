/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { CreateUserDto } from '../../users/users.dto';

type VerifyCallback = (err: any, user: any, info?: any) => void;

interface JsonProfile {
  first_name: string;
  last_name: string;
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

  async validate(a: string, r: string, profile: Profile, cb: VerifyCallback): Promise<any> {
    cb(null, {
      name: profile.displayName || this.getName(profile._json),
      email: profile.emails[0].value,
      facebookId: profile.id
    } as CreateUserDto);
  }

  private getName(json: JsonProfile): string {
    return `${json.first_name || ''} ${json.last_name || ''}`.trim();
  }
}
