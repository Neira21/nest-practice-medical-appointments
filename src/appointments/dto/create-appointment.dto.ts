import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsString()
  @IsNotEmpty()
  doctorName: string;

  @IsDateString()
  appointmentDate: string; // ISO string format, será convertido a Date
}
