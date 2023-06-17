/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GITHUB_AUTH_ID'),
      clientSecret: configService.get('GITHUB_AUTH_SECRET'),
      callbackURL: configService.get('APP_ORIGIN') + '/api/auth/github/redirect',
      scope: ['user:email']
    });
  }

  async validate(access: string, refresh: string, profile: Profile, callback: any): Promise<void> {
    const email = profile.emails.shift();

    callback(null, {
      name: email.value.split('@').shift(),
      email: email.value,
      githubId: profile.id
    });
  }
}
