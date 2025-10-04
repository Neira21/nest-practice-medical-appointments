import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({ data: createRoleDto });
  }

  async findAll() {
    const result = (await this.prisma.role.findMany()) as any[];

    if (!result || result.length === 0) {
      return { message: 'No hay roles agregados', data: [] };
    }
    // Si la respuesta es un objeto individual
    return { message: 'Roles Obtenidos', data: result };
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { User: true }, // Incluir usuarios asociados
    });
    if (!role) {
      return { message: 'Rol no encontrado', data: null };
    }
    return { message: 'Rol encontrado', data: role };
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.prisma.role.update({
        where: { id },
        data: updateRoleDto,
      });
      return { message: 'Rol actualizado correctamente', data: role };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }
      if (error.code === 'P2025') {
        throw new ConflictException('Rol no encontrado');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const existingRole = await this.prisma.role.findUnique({
      where: { id },
      include: { User: true }, // Incluir usuarios relacionados
    });

    if (!existingRole) {
      return { message: 'Rol no encontrado', data: null };
    }
    if (existingRole.User && existingRole.User.length > 0) {
      return {
        message: `No se puede eliminar el rol "${existingRole.name}" porque hay ${existingRole.User.length} usuario(s) que lo están usando`,
        data: null,
        usersCount: existingRole.User.length,
        users: existingRole.User.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
        })),
      };
    }

    try {
      await this.prisma.role.delete({ where: { id } });
      return {
        message: `Rol "${existingRole.name}" eliminado correctamente`,
        data: existingRole,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { message: error, data: null };
    }
  }
}
