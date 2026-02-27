import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';

@Injectable()
export class CourtsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.court.findMany();
  }

  async findOne(id: number) {
    const court = await this.prisma.court.findUnique({ where: { id } });
    if (!court) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }
    return court;
  }

  async create(dto: CreateCourtDto) {
    return this.prisma.court.create({
      data: { name: dto.name },
    });
  }

  async update(id: number, dto: UpdateCourtDto) {
    try {
      return await this.prisma.court.update({
        where: { id },
        data: { name: dto.name },
      });
    } catch (error) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.court.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }
  }
}
