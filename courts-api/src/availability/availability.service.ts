import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailability(courtId: number, date: string) {
    const allHours = Array.from({ length: 15 }, (_, i) => i + 7); // 7..21

    const bookings = await this.prisma.booking.findMany({
      where: { courtId, date },
      select: { startHour: true, endHour: true },
    });

    const bookedSet = new Set<number>();
    for (const b of bookings) {
      for (let h = b.startHour; h < b.endHour; h++) bookedSet.add(h);
    }

    const booked = allHours.filter((h) => bookedSet.has(h));
    const available = allHours.filter((h) => !bookedSet.has(h));

    return { available, booked };
  }
}
