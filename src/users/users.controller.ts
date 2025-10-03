import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto) {
      return { message: 'No se enviaron datos', data: null };
    }
    // RolId es por defecto 2 (usuario)
    const objectUser = { ...createUserDto, roleId: createUserDto.roleId || 2 };
    return this.usersService.create(objectUser);
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    if (users.length === 0 || !users) {
      return { message: 'No hay usuarios registrados', data: [] };
    }
    return { message: 'Usuarios encontrados', data: users };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
