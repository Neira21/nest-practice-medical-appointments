import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../../constants/jwt-key';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaService } from '@/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: SECRET,
      signOptions: { expiresIn: '1hr' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    PrismaService,
  ],
})
export class AuthModule {}
