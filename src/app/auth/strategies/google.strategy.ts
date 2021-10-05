/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { CreateUserDto } from '../../users/users.dto';

interface JsonProfile {
  givenName: string;
  familyName: string;
}

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
    a: string,
    r: string,
    profile: Profile,
    verifyCallback: VerifyCallback
  ): Promise<void> {
    verifyCallback(null, {
      name: profile.displayName || this.getName(profile.name),
      email: profile.emails[0].value,
      googleId: profile.id
    } as CreateUserDto);
  }

  private getName(json: JsonProfile): string {
    return [json.givenName || '', json.familyName || ''].join(' ').trim();
  }
}