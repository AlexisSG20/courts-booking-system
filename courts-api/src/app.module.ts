import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { PrismaModule } from "./prisma/prisma.module";

import { BookingsController } from "./bookings/bookings.controller";
import { BookingsService } from "./bookings/bookings.service";

import { AvailabilityController } from "./availability/availability.controller";
import { AvailabilityService } from "./availability/availability.service";

import { CourtsController } from "./courts/courts.controller";
import { CourtsService } from "./courts/courts.service";

// ✅ NUEVO: Auth JWT (login/refresh/logout/me)
import { AuthModule } from "./auth/auth.module";

import { AIDemoController } from "./ai-demo/ai-demo.controller";
import { AIDemoService } from "./ai-demo/ai-demo.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,

    // ✅ Importa el módulo de autenticación
    AuthModule,
  ],
  controllers: [
    AppController,
    CourtsController,
    AvailabilityController,
    BookingsController,
    AIDemoController,
  ],
  providers: [
    AppService,
    CourtsService,
    AvailabilityService,
    BookingsService,
    AIDemoService,
  ],
})
export class AppModule {}
