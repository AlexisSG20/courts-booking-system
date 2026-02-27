import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ GET /bookings?date=YYYY-MM-DD&courtId=1&pending=true
  // ✅ NUEVO: GET /bookings?from=YYYY-MM-DD&to=YYYY-MM-DD&courtId=1&pending=true
  async list(q: GetBookingsQueryDto) {
    const where: any = {};

    // filtros comunes
    if (q.courtId) where.courtId = q.courtId;
    if (q.pending) where.usedAt = null;

    // ✅ validación simple del rango
    if (q.from && q.to && q.from > q.to) {
      throw new BadRequestException('from no puede ser mayor que to');
    }

    // ✅ rango tiene prioridad sobre date
    if (q.from || q.to) {
      where.date = {};
      if (q.from) where.date.gte = q.from;
      if (q.to) where.date.lte = q.to; // inclusivo
    } else if (q.date) {
      where.date = q.date;
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      orderBy: [{ date: 'desc' }, { courtId: 'asc' }, { startHour: 'asc' }],
      include: {
        court: { select: { id: true, name: true } },
      },
    });

    return { count: bookings.length, bookings };
  }

  async create(dto: CreateBookingDto) {
    if (dto.endHour <= dto.startHour) {
      throw new BadRequestException('endHour must be greater than startHour');
    }

    const overlap = await this.prisma.booking.findFirst({
      where: {
        courtId: dto.courtId,
        date: dto.date,
        NOT: [
          { endHour: { lte: dto.startHour } },
          { startHour: { gte: dto.endHour } },
        ],
      },
      select: { id: true },
    });

    if (overlap) {
      throw new ConflictException('Ya está ocupado en ese horario');
    }

    const duration = dto.endHour - dto.startHour;
    const pricePerHour = 20;
    const totalPrice = duration * pricePerHour * dto.peopleCount;

    const booking = await this.prisma.booking.create({
      data: {
        courtId: dto.courtId,
        date: dto.date,
        startHour: dto.startHour,
        endHour: dto.endHour,
        peopleCount: dto.peopleCount,
        totalPrice,
        token: randomUUID(),
      },
      select: { id: true, totalPrice: true, token: true },
    });

    return {
      bookingId: booking.id,
      totalPrice: booking.totalPrice,
      token: booking.token,
    };
  }

  async findByToken(token: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { token },
      include: {
        court: { select: { id: true, name: true } },
      },
    });

    if (!booking) throw new NotFoundException('No existe una reserva con ese token');
    return booking;
  }

  async checkInByToken(token: string) {
    // Intento atómico: marcar usado solo si usedAt es null
    const updated = await this.prisma.booking.updateMany({
      where: { token, usedAt: null },
      data: { usedAt: new Date() },
    });

    // Si se actualizó, devolvemos la reserva ya marcada
    if (updated.count === 1) {
      const booking = await this.findByToken(token);
      return { checkedIn: true, booking };
    }

    // Si no actualizó: o no existe, o ya estaba usado
    const booking = await this.prisma.booking.findUnique({
      where: { token },
      include: {
        court: { select: { id: true, name: true } },
      },
    });

    if (!booking) throw new NotFoundException('No existe una reserva con ese token');

    return {
      checkedIn: false,
      alreadyUsed: true,
      booking,
    };
  }
}
