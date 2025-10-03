import { ConflictException } from '@nestjs/common';
/**
 * @param error - Prisma error object
 */

function handlePrismaError(error: any) {
  if (error.code === 'P2002') {
    const field = error.meta?.target as string[];
    if (field?.includes('username')) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }
    if (field?.includes('email')) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }
    throw new ConflictException('Ya existe un registro con ese valor');
  }

  if (error.code === 'P2025') {
    throw new ConflictException('Registro no encontrado');
  }
  throw error;
}

export { handlePrismaError };
