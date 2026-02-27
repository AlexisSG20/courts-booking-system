import { IsInt, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AvailabilityQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  courtId: number;

  // Valida formato YYYY-MM-DD (o ISO). Para tu caso sirve perfecto.
  @IsDateString()
  date: string;
}
