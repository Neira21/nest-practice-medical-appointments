import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { handlePrismaError } from '../utils/PrismaErrors';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const salts = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salts);

      const newUser = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          password: hashedPassword,
          email: createUserDto.email,
          roleId: createUserDto.roleId || 2, // Asignar roleId 2 por defecto si no se proporciona
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = newUser;

      return {
        message: 'Usuario creado exitosamente',
        data: userWithoutPassword,
      };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          username: true,
          email: true,
          password: false,
          role: {
            select: {
              name: true,
            },
          },
        },
      });
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
        include: { role: true },
      });
      if (!user) {
        return { message: 'Usuario no encontrado', data: null };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, role, username, email } = user;
      const roleName = role?.name ?? role?.name ?? null;

      const userWithoutPassword = {
        id,
        nombre: username,
        email,
        rol: roleName,
      };

      return { message: 'Perfil del usuario', data: userWithoutPassword };
    } catch (error) {
      console.log('Error al buscar usuario:', error);
    }
  }

  async findOneByName(name: string) {
    try {
      const username = name.trim();

      const user = await this.prisma.user.findUnique({
        where: { username },
        include: {
          role: true, // Incluir información del rol
        },
      });

      if (user) {
        return { message: 'Usuario encontrado', data: user };
      } else {
        return { message: 'Usuario no encontrado', data: null };
      }
    } catch (error) {
      console.log('Error finding user by name:', error);
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
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
