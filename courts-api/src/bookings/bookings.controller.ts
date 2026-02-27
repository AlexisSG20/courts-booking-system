import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { GetBookingsQueryDto } from "./dto/get-bookings-query.dto";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // 🔒 Admin: listado + filtros + export/KPIs
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  async list(@Query() q: GetBookingsQueryDto) {
    return this.bookingsService.list(q);
  }

  // ✅ Público: crear reserva
  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  // 🔒 Staff/Admin: validar token (JWT + roles)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "STAFF")
  @Get("by-token/:token")
  async getByToken(
    @Param("token", new ParseUUIDPipe({ version: "4" })) token: string,
  ) {
    const booking = await this.bookingsService.findByToken(token);
    return { valid: true, booking };
  }

  // 🔒 Staff/Admin: check-in (JWT + roles)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "STAFF")
  @Post("check-in/:token")
  checkIn(
    @Param("token", new ParseUUIDPipe({ version: "4" })) token: string,
  ) {
    return this.bookingsService.checkInByToken(token);
  }
}
