import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;

  const prismaMock = {
    booking: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return alreadyUsed when token was already checked in', async () => {
  const token = 'token-usado';

  const usedBooking = {
    id: 1,
    token,
    date: '2026-03-18',
    startHour: 10,
    endHour: 11,
    peopleCount: 2,
    totalPrice: 40,
    usedAt: new Date('2026-03-18T10:05:00.000Z'),
    courtId: 1,
    court: {
      id: 1,
      name: 'Losa 1',
    },
  };

  prismaMock.booking.updateMany.mockResolvedValue({ count: 0 });
  prismaMock.booking.findUnique.mockResolvedValue(usedBooking);

  const result = await service.checkInByToken(token);

  expect(prismaMock.booking.updateMany).toHaveBeenCalledWith({
    where: { token, usedAt: null },
    data: { usedAt: expect.any(Date) },
  });

  expect(prismaMock.booking.findUnique).toHaveBeenCalledWith({
    where: { token },
    include: {
      court: { select: { id: true, name: true } },
    },
  });

  expect(result).toEqual({
    checkedIn: false,
    alreadyUsed: true,
    booking: usedBooking,
    });
  });

  it('should check in booking successfully when token is valid and unused', async () => {
  const token = 'token-valido';

  const checkedInBooking = {
    id: 2,
    token,
    date: '2026-03-18',
    startHour: 11,
    endHour: 12,
    peopleCount: 2,
    totalPrice: 40,
    usedAt: new Date('2026-03-18T11:01:00.000Z'),
    courtId: 1,
    court: {
      id: 1,
      name: 'Losa 1',
    },
  };

  prismaMock.booking.updateMany.mockResolvedValue({ count: 1 });
  prismaMock.booking.findUnique.mockResolvedValue(checkedInBooking);

  const result = await service.checkInByToken(token);

  expect(prismaMock.booking.updateMany).toHaveBeenCalledWith({
    where: { token, usedAt: null },
    data: { usedAt: expect.any(Date) },
  });

  expect(prismaMock.booking.findUnique).toHaveBeenCalledWith({
    where: { token },
    include: {
      court: { select: { id: true, name: true } },
    },
  });

  expect(result).toEqual({
    checkedIn: true,
    booking: checkedInBooking,
    });
  });

  it('should throw NotFoundException when token does not exist', async () => {
  const token = 'token-inexistente';

  prismaMock.booking.findUnique.mockResolvedValue(null);

  await expect(service.findByToken(token)).rejects.toThrow(NotFoundException);

  expect(prismaMock.booking.findUnique).toHaveBeenCalledWith({
    where: { token },
    include: {
      court: { select: { id: true, name: true } },
    },
  });
 });

 it('should throw BadRequestException when endHour is less than or equal to startHour', async () => {
  const dto = {
    courtId: 1,
    date: '2026-03-18',
    startHour: 10,
    endHour: 10,
    peopleCount: 2,
  };

  await expect(service.create(dto)).rejects.toThrow(BadRequestException);

  expect(prismaMock.booking.findFirst).not.toHaveBeenCalled();
  expect(prismaMock.booking.create).not.toHaveBeenCalled();
 });

 it('should throw ConflictException when booking overlaps with an existing one', async () => {
  const dto = {
    courtId: 1,
    date: '2026-03-18',
    startHour: 10,
    endHour: 11,
    peopleCount: 2,
  };

  prismaMock.booking.findFirst.mockResolvedValue({ id: 99 });

  await expect(service.create(dto)).rejects.toThrow(ConflictException);

  expect(prismaMock.booking.findFirst).toHaveBeenCalledWith({
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

  expect(prismaMock.booking.create).not.toHaveBeenCalled();
 });

 it('should create a booking successfully and return bookingId, totalPrice and token', async () => {
  const dto = {
    courtId: 1,
    date: '2026-03-18',
    startHour: 10,
    endHour: 12,
    peopleCount: 3,
  };

  prismaMock.booking.findFirst.mockResolvedValue(null);
  prismaMock.booking.create.mockResolvedValue({
    id: 15,
    totalPrice: 120,
    token: 'mock-token-123',
  });

  const result = await service.create(dto);

  expect(prismaMock.booking.findFirst).toHaveBeenCalledWith({
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

  expect(prismaMock.booking.create).toHaveBeenCalledWith({
    data: {
      courtId: dto.courtId,
      date: dto.date,
      startHour: dto.startHour,
      endHour: dto.endHour,
      peopleCount: dto.peopleCount,
      totalPrice: 120,
      token: expect.any(String),
    },
    select: { id: true, totalPrice: true, token: true },
  });

  expect(result).toEqual({
    bookingId: 15,
    totalPrice: 120,
    token: 'mock-token-123',
  });
 });
});