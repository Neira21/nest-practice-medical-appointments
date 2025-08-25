import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const data = {
      ...createAppointmentDto,
      appointmentDate: new Date(createAppointmentDto.appointmentDate), // Convertir string a Date
    };

    return this.prisma.appointment.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.appointment.findMany();
  }

  async findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const data = {
      ...updateAppointmentDto,
      ...(updateAppointmentDto.appointmentDate && {
        appointmentDate: new Date(updateAppointmentDto.appointmentDate),
      }),
    };

    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.appointment.delete({
      where: { id },
    });
  }
}
