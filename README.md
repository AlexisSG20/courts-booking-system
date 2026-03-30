# Courts Booking System

Sistema fullstack de reservas para canchas o lozas deportivas.  
Permite registrar reservas, generar token y QR, validar el ingreso y gestionar reservas desde un panel administrativo.

## Descripción general

El flujo principal del sistema es:

1. el usuario reserva una cancha en una fecha y horario disponible
2. el sistema genera un token y un código QR para la reserva
3. el personal valida la reserva por token o QR
4. se registra el check-in para marcar el ingreso como usado
5. el administrador puede revisar métricas, filtrar reservas y exportar información

## Stack

### Backend
- NestJS
- Prisma ORM
- PostgreSQL

### Frontend
- React
- Vite
- Tailwind CSS

### Autenticación y seguridad
- JWT (access token)
- Refresh token por cookie httpOnly
- Roles: `ADMIN`, `STAFF`

## Estructura del repositorio

Monorepo con dos aplicaciones principales:

```txt
courts-booking-system/
├─ courts-api/   # API backend con NestJS + Prisma
├─ courts-web/   # Frontend web con React + Vite
└─ .github/      # CI / workflows
```

## Funcionalidades implementadas

- Reservas por cancha, fecha y horario
- Consulta de disponibilidad
- Generación de token de reserva
- Generación de código QR
- Validación de reservas por token o QR
- Check-in para marcar reservas como usadas
- Panel administrativo con filtros
- KPIs de reservas e ingresos
- Exportación a Excel
- Login con roles `ADMIN` y `STAFF`
- Refresh automático del access token

## Roles del sistema

### ADMIN
- acceso al panel administrativo
- visualización de métricas
- filtros por fecha y cancha
- exportación de reservas
- registro de ingresos

### STAFF
- validación de reservas
- registro de check-in por token o QR

## Tecnologías adicionales

- `@zxing/browser` para escaneo QR
- `react-qr-code` para generación visual de QR
- npm workspaces para estructura monorepo
- GitHub Actions para integración continua

## Requisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm
- Postman opcional para pruebas de API

## Configuración del proyecto

### 1. Clonar el repositorio

git clone <URL_DEL_REPOSITORIO>  
cd courts-booking-system

## Backend (`courts-api`)

### 2. Instalar dependencias

cd courts-api  
npm install

### 3. Variables de entorno

Crear el archivo `.env` a partir de `.env.example`.

En PowerShell:

copy .env.example .env

Luego completar las variables necesarias, por ejemplo:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- credenciales iniciales de admin si aplica

### 4. Ejecutar migraciones y seed

npx prisma generate  
npx prisma migrate dev  
npm run seed

### 5. Levantar backend

npm run start:dev

El backend quedará disponible normalmente en:

`http://localhost:3000`

## Frontend (`courts-web`)

### 6. Instalar dependencias

Abre otra terminal y entra a:

cd courts-web  
npm install

### 7. Levantar frontend

npm run dev

El frontend quedará disponible normalmente en:

`http://localhost:5173`

## Credenciales de acceso

Las credenciales dependen de los valores definidos en el seed y en el archivo `.env`.

Ejemplo de acceso de prueba:

- Admin: correo y contraseña configurados en el seed
- Staff: correo y contraseña configurados en el seed

## Scripts útiles

### Backend

npm run start:dev  
npm run test  
npm run seed

### Frontend

npm run dev  
npm run build  
npm run preview

## Demo visual publicada

Además del proyecto real fullstack, existe una demo visual separada del frontend para mostrar la navegación y la interfaz:

- Repo demo UI: `courts-booking-demo-ui`
- Deploy demo UI: `https://courts-booking-demo-ui.netlify.app`

## Estado del proyecto

Proyecto funcional y preparado como pieza de portfolio junior fullstack.

Incluye:

- flujo principal de reservas
- validación de ingreso
- panel admin
- demo IA conectada a datos reales en entorno local
- versión demo visual desplegada por separado

## Posibles mejoras futuras

- despliegue completo backend + base de datos
- persistencia pública para entorno demo
- mejora de reportes y dashboards
- notificaciones o recordatorios de reserva
- pruebas e2e

## Autor

Alexis Suasnabar Gaspar






