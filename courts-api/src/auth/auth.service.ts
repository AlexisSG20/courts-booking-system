import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import type { Request, Response } from "express";
import * as argon2 from "argon2";

function numEnv(name: string, fallback: number) {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

@Injectable()
export class AuthService {
  private jwt = new JwtService();
  private accessSecret = process.env.JWT_ACCESS_SECRET!;
  private refreshSecret = process.env.JWT_REFRESH_SECRET!;
  private accessTtl = numEnv("JWT_ACCESS_TTL_SECONDS", 900);
  private refreshTtl = numEnv("JWT_REFRESH_TTL_SECONDS", 60 * 60 * 24 * 30);

  constructor(private prisma: PrismaService) {}

  private cookieOptions() {
    const secure = String(process.env.COOKIE_SECURE).toLowerCase() === "true";
    return { httpOnly: true, secure, sameSite: "lax" as const, path: "/" };
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Credenciales inválidas");
    if (!user.isActive) throw new ForbiddenException("Usuario desactivado");

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException("Credenciales inválidas");

    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { secret: this.accessSecret, expiresIn: this.accessTtl }
    );

    const refreshToken = await this.jwt.signAsync(
      { sub: user.id },
      { secret: this.refreshSecret, expiresIn: this.refreshTtl }
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await argon2.hash(refreshToken), lastLoginAt: new Date() },
    });

    res.cookie("refresh_token", refreshToken, {
      ...this.cookieOptions(),
      maxAge: this.refreshTtl * 1000,
    });

    return { accessToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  async refresh(req: Request, res: Response) {
    const token = (req as any).cookies?.refresh_token;
    if (!token) throw new UnauthorizedException("No refresh token");

    let payload: any;
    try {
      payload = await this.jwt.verifyAsync(token, { secret: this.refreshSecret });
    } catch {
      throw new UnauthorizedException("Refresh inválido");
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive || !user.refreshTokenHash) throw new UnauthorizedException("Refresh inválido");

    const ok = await argon2.verify(user.refreshTokenHash, token);
    if (!ok) throw new UnauthorizedException("Refresh inválido");

    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { secret: this.accessSecret, expiresIn: this.accessTtl }
    );

    // rotación
    const newRefresh = await this.jwt.signAsync(
      { sub: user.id },
      { secret: this.refreshSecret, expiresIn: this.refreshTtl }
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await argon2.hash(newRefresh) },
    });

    res.cookie("refresh_token", newRefresh, {
      ...this.cookieOptions(),
      maxAge: this.refreshTtl * 1000,
    });

    return { accessToken };
  }

  async logout(req: Request, res: Response) {
    const token = (req as any).cookies?.refresh_token;

    if (token) {
      try {
        const payload: any = await this.jwt.verifyAsync(token, { secret: this.refreshSecret });
        await this.prisma.user.update({
          where: { id: payload.sub },
          data: { refreshTokenHash: null },
        });
      } catch {}
    }

    res.clearCookie("refresh_token", this.cookieOptions());
    return { ok: true };
  }
}
