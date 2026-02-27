import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityQueryDto } from './dto/availability-query.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  async getAvailability(@Query() query: AvailabilityQueryDto) {
  const { available, booked } = await this.availabilityService.getAvailability(query.courtId, query.date);
  return { courtId: query.courtId, date: query.date, available, booked };
  }
}
