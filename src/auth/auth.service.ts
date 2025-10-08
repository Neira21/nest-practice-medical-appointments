import { UsersService } from './../users/users.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from './interfaces/auth-user.interface';
import { IsNotEmpty, IsString } from 'class-validator';
import { PayloadFull } from './payload';
import { SECRET } from '../../constants/jwt-key';

export default class RefreshTokenBodyDTO {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthUser | null> {
    // Buscar usuario por username
    const userResponse = await this.userService.findOneByName(username);

    if (!userResponse || !userResponse.data) {
      return null;
    }

    const user = userResponse.data;

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      const object = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name,
      };
      return object;
    }

    return null;
  }

  login(user: AuthUser) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    return {
      message: 'Login exitoso',
      access_token: this.jwtService.sign(payload),
      user: {
        username: user.username,
        role: user.role,
      },
    };
  }

  async refreshToken(body: RefreshTokenBodyDTO) {
    try {
      const payload: PayloadFull = await this.jwtService.verifyAsync(
        body.refreshToken,
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iat, exp, ...result } = payload;
      const refreshToken = this.jwtService.signAsync(result, {
        secret: SECRET,
        expiresIn: '2hrs',
      });
      return {
        refreshToken,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
