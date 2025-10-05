import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from './interfaces/auth-user.interface';

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: userPassword, ...result } = user;
      return result as AuthUser;
    }

    return null;
  }

  login(user: AuthUser) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role?.name,
    };
    return {
      message: 'Login exitoso',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role?.name,
      },
    };
  }
}
