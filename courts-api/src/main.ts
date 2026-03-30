import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const frontendUrl = process.env.FRONTEND_URL;
  const port = Number(process.env.PORT || 3000);

  app.enableCors({
    origin: frontendUrl ? [frontendUrl] : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port, "0.0.0.0");
  console.log(`API running on port ${port}`);
}
bootstrap();