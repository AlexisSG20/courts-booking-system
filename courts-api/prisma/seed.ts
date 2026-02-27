import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as argon2 from 'argon2';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1) Crear las courts iniciales
  const courts = [
    { id: 1, name: 'Losa 1' },
    { id: 2, name: 'Losa 2' },
    { id: 3, name: 'Losa 3' },
  ];

  for (const court of courts) {
    await prisma.court.upsert({
      where: { id: court.id },
      update: { name: court.name },
      create: court,
    });
    console.log(`Court created/updated: ${court.name}`);
  }

  // 2) Crear admin inicial (si no existe)
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('⚠️ Falta ADMIN_EMAIL o ADMIN_PASSWORD en .env (no se creó admin)');
  } else {
    const exists = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (exists) {
      console.log(`Admin ya existe: ${adminEmail}`);
    } else {
      const passwordHash = await argon2.hash(adminPassword);

      await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash,
          role: Role.ADMIN,
          isActive: true,
        },
      });

      console.log(`✅ Admin creado: ${adminEmail}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
