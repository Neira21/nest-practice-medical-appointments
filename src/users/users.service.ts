import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { handlePrismaError } from '../utils/PrismaErrors';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: createUserDto,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      if (!users || users.length === 0) {
        return { message: 'No hay usuarios registrados', data: [] };
      }
      return { message: 'Usuarios encontrados', data: users };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        return { message: 'Usuario no encontrado', data: null };
      }
      return { message: 'Usuario encontrado', data: user };
    } catch (error) {
      console.log('Error al buscar usuario:', error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async remove(id: number) {
    // Primero verificar si el usuario existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return {
        message: 'Usuario no encontrado',
        data: null,
      };
    }
  }
}
