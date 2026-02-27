# Courts Booking System

Sistema de reservas para canchas/lozas: el cliente reserva su turno y luego se valida el ingreso con **QR/token** (check-in).

## Stack
- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** React (Vite)
- **Auth:** JWT (access token) + Refresh token por **cookie httpOnly**
- **Roles:** `ADMIN`, `STAFF`

## Estructura del repo (Monorepo)
- `courts-api/` — API (NestJS + Prisma)
- `courts-web/` — Web (React + Vite)

---

## Features
- ✅ Reservas + disponibilidad por cancha/fecha
- ✅ Validación de QR/token
- ✅ Check-in (marca una reserva como **usada**)
- ✅ Panel Admin: filtros + KPIs + export a Excel
- ✅ Seguridad: JWT + roles (`ADMIN`, `STAFF`)
- ✅ Refresh automático del access token (`/auth/refresh`)

---

## Requisitos
- Node.js **18+**
- PostgreSQL **14+**
- (Opcional) Postman para pruebas

---

## Setup (desarrollo)

### 1) Backend (courts-api)

#### A) Variables de entorno
Entra a `courts-api/` y crea tu `.env` a partir del ejemplo:

**PowerShell (Windows):**
```powershell
cd courts-api
copy .env.example .env