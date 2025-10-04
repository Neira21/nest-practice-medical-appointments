import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SECRET } from '../../../constants/jwt-key';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET,
    });
  }

  validate(payload: any) {
    return {
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment*/
      userId: payload.sub,
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment*/
      username: payload.username,
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment*/
      roleId: payload.roleId,
    };
  }
}
