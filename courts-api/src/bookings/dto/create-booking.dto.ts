import { IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  courtId: number;

  @IsDateString()
  date: string; // YYYY-MM-DD

  @Type(() => Number)
  @IsInt()
  @Min(0)
  startHour: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  endHour: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  peopleCount: number;
}
