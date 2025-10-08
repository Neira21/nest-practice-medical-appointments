import { UsersService } from '@/users/users.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RefreshTokenBodyDTO, { AuthService } from './auth.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthUser } from './interfaces/auth-user.interface';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

interface RequestWithUser extends Request {
  user: AuthUser;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/register')
  register(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get('/profile')
  async getProfile(@Request() req: RequestWithUser) {
    return await this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/refresh-token')
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return await this.authService.refreshToken(body);
  }
}
