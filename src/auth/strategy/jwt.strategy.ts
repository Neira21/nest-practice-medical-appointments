import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SECRET } from '../../../constants/jwt-key';

interface JwtPayload {
  sub: number;
  username: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET,
    });
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
    };
  }
}
