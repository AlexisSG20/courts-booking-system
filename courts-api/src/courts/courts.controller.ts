import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';

@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Get()
  findAll() {
    return this.courtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const court = this.courtsService.findOne(id);
    if (!court) throw new NotFoundException(`Court with id ${id} not found`);
    return court;
  }

  @Post()
  create(@Body() dto: CreateCourtDto) {
    return this.courtsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCourtDto) {
    const updated = this.courtsService.update(id, dto);
    if (!updated) throw new NotFoundException(`Court with id ${id} not found`);
    return updated;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = this.courtsService.remove(id);
    if (!deleted) throw new NotFoundException(`Court with id ${id} not found`);
    return deleted;
  }
}
