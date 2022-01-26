import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET', //protect this, move to env var
    });
  }

  async validate(payload: any) {
    //if more info in database
    //const user = await.usersService.getById(payload.sub)

    return {
      id: payload.sub,
      name: payload.name,
    };
  }
}
