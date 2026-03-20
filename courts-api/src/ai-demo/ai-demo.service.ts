import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type AiDemoResponse = {
  answer: string;
  data?: unknown;
};

@Injectable()
export class AIDemoService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeText(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[¿?¡!.,;:()[\]{}"'`´]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private hasAny(text: string, terms: string[]) {
    return terms.some((term) => text.includes(term));
  }

  private hasAll(text: string, terms: string[]) {
    return terms.every((term) => text.includes(term));
  }

  private formatRecentBookings(
    bookings: Array<{
      id: string;
      date: string;
      startHour: number;
      endHour: number;
      peopleCount: number;
      court: { name: string };
      usedAt: Date | null;
    }>,
  ) {
    if (!bookings.length) {
      return 'No encontré reservas.';
    }

    return bookings
      .map((booking, index) => {
        const status = booking.usedAt ? 'ingreso registrado' : 'pendiente';
        return `${index + 1}. ${booking.court.name} — ${booking.date} de ${booking.startHour}:00 a ${booking.endHour}:00, ${booking.peopleCount} persona(s), estado: ${status}`;
      })
      .join('\n');
  }

  private async getTotalBookings(): Promise<AiDemoResponse> {
    const count = await this.prisma.booking.count();

    return {
      answer: `Actualmente hay ${count} reserva(s) registradas en el sistema.`,
      data: { totalBookings: count },
    };
  }

  private async getPendingBookings(): Promise<AiDemoResponse> {
    const count = await this.prisma.booking.count({
      where: { usedAt: null },
    });

    return {
      answer: `Actualmente hay ${count} reserva(s) pendientes de ingreso.`,
      data: { pendingBookings: count },
    };
  }

  private async getUsedBookings(): Promise<AiDemoResponse> {
    const count = await this.prisma.booking.count({
      where: { NOT: { usedAt: null } },
    });

    return {
      answer: `Actualmente hay ${count} reserva(s) con ingreso ya registrado.`,
      data: { usedBookings: count },
    };
  }

  private async getUsersCount(): Promise<AiDemoResponse> {
    const count = await this.prisma.user.count();

    return {
      answer: `Actualmente hay ${count} usuario(s) registrados.`,
      data: { totalUsers: count },
    };
  }

  private async getActiveUsersCount(): Promise<AiDemoResponse> {
    const count = await this.prisma.user.count({
      where: { isActive: true },
    });

    return {
      answer: `Actualmente hay ${count} usuario(s) activos.`,
      data: { activeUsers: count },
    };
  }

  private async getInactiveUsersCount(): Promise<AiDemoResponse> {
    const count = await this.prisma.user.count({
      where: { isActive: false },
    });

    return {
      answer: `Actualmente hay ${count} usuario(s) inactivos.`,
      data: { inactiveUsers: count },
    };
  }

  private async getRecentBookings(): Promise<AiDemoResponse> {
    const bookings = await this.prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        date: true,
        startHour: true,
        endHour: true,
        peopleCount: true,
        usedAt: true,
        court: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      answer: `Estas son las 5 reservas más recientes:\n\n${this.formatRecentBookings(bookings)}`,
      data: { recentBookings: bookings },
    };
  }

  private async getTodayBookings(): Promise<AiDemoResponse> {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayText = `${yyyy}-${mm}-${dd}`;

    const bookings = await this.prisma.booking.findMany({
      where: { date: todayText },
      orderBy: { startHour: 'asc' },
      take: 10,
      select: {
        id: true,
        date: true,
        startHour: true,
        endHour: true,
        peopleCount: true,
        usedAt: true,
        court: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!bookings.length) {
      return {
        answer: `No encontré reservas para hoy (${todayText}).`,
        data: { today: todayText, bookings: [] },
      };
    }

    return {
      answer: `Encontré ${bookings.length} reserva(s) para hoy (${todayText}):\n\n${this.formatRecentBookings(bookings)}`,
      data: { today: todayText, bookings },
    };
  }

  private async getPendingTodayBookings(): Promise<AiDemoResponse> {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayText = `${yyyy}-${mm}-${dd}`;

    const count = await this.prisma.booking.count({
      where: {
        date: todayText,
        usedAt: null,
      },
    });

    return {
      answer: `Actualmente hay ${count} reserva(s) pendientes para hoy (${todayText}).`,
      data: { today: todayText, pendingTodayBookings: count },
    };
  }

  private async getTodayPeopleCount(): Promise<AiDemoResponse> {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayText = `${yyyy}-${mm}-${dd}`;

    const bookings = await this.prisma.booking.findMany({
      where: { date: todayText },
      select: { peopleCount: true },
    });

    const totalPeople = bookings.reduce(
      (sum, booking) => sum + booking.peopleCount,
      0,
    );

    return {
      answer: `La suma de personas reservadas para hoy (${todayText}) es ${totalPeople}.`,
      data: { today: todayText, totalPeople },
    };
  }

  private async getMostBookedCourt(): Promise<AiDemoResponse> {
    const grouped = await this.prisma.booking.groupBy({
      by: ['courtId'],
      _count: {
        courtId: true,
      },
      orderBy: {
        _count: {
          courtId: 'desc',
        },
      },
      take: 1,
    });

    if (!grouped.length) {
      return {
        answer:
          'Todavía no hay reservas suficientes para calcular la cancha con más reservas.',
        data: { mostBookedCourt: null },
      };
    }

    const top = grouped[0];

    const court = await this.prisma.court.findUnique({
      where: { id: top.courtId },
      select: { id: true, name: true },
    });

    if (!court) {
      return {
        answer:
          'Encontré reservas, pero no pude resolver el nombre de la cancha.',
        data: { mostBookedCourt: null },
      };
    }

    return {
      answer: `La cancha con más reservas es ${court.name}, con ${top._count.courtId} reserva(s).`,
      data: {
        mostBookedCourt: {
          id: court.id,
          name: court.name,
          bookingsCount: top._count.courtId,
        },
      },
    };
  }

  private async getCourtsCount(): Promise<AiDemoResponse> {
    const count = await this.prisma.court.count();

    return {
      answer: `Actualmente hay ${count} cancha(s) registradas en el sistema.`,
      data: { totalCourts: count },
    };
  }

  private explainBooking(): AiDemoResponse {
    return {
      answer:
        'Una reserva es el registro de una cancha apartada para una fecha y horario específicos. Incluye datos como cancha, fecha, horas, cantidad de personas, precio total y estado de ingreso.',
    };
  }

  private explainUser(): AiDemoResponse {
    return {
      answer:
        'Un usuario es una cuenta del sistema que puede acceder según su rol. En este proyecto puede ser admin o staff, y se usa para autenticación y control de acceso.',
    };
  }

  private explainCourt(): AiDemoResponse {
    return {
      answer:
        'Una cancha es el espacio deportivo que puede reservarse. Cada reserva está asociada a una cancha específica.',
    };
  }

  private explainCapabilities(): AiDemoResponse {
    return {
      answer:
        'Puedo responder consultas operativas sobre reservas, usuarios y canchas. Por ejemplo: total de reservas, pendientes, ingresos registrados, usuarios, usuarios activos, reservas recientes, reservas de hoy, pendientes de hoy, total de canchas y cancha con más reservas.',
    };
  }

  async handleQuery(message: string): Promise<AiDemoResponse> {
    const raw = message?.trim();

    if (!raw) {
      return {
        answer: 'Escribe una consulta para poder ayudarte.',
      };
    }

    const text = this.normalizeText(raw);

    // ayuda / alcance
    if (
      this.hasAny(text, [
        'ayuda',
        'que puedes hacer',
        'que puedes responder',
        'que consultas aceptas',
        'que consultas soportas',
        'alcance',
        'opciones',
        'comandos',
        'help',
      ])
    ) {
      return this.explainCapabilities();
    }

    // definiciones
    if (
      this.hasAny(text, [
        'que es una reserva',
        'que son las reservas',
        'explica reserva',
        'definicion de reserva',
        'significado de reserva',
      ])
    ) {
      return this.explainBooking();
    }

    if (
      this.hasAny(text, [
        'que es un usuario',
        'que son los usuarios',
        'explica usuario',
        'definicion de usuario',
        'significado de usuario',
      ])
    ) {
      return this.explainUser();
    }

    if (
      this.hasAny(text, [
        'que es una cancha',
        'que son las canchas',
        'explica cancha',
        'definicion de cancha',
        'significado de cancha',
        'que es una losa',
      ])
    ) {
      return this.explainCourt();
    }

    // reservas pendientes de hoy
    if (
      (this.hasAny(text, ['hoy']) &&
        this.hasAny(text, [
          'pendientes',
          'sin ingreso',
          'aun no usadas',
          'todavia no usadas',
        ]) &&
        this.hasAny(text, ['reserva', 'reservas', 'booking', 'bookings'])) ||
      this.hasAny(text, [
        'reservas pendientes de hoy',
        'reservas pendientes para hoy',
        'cuantas reservas pendientes hay hoy',
      ])
    ) {
      return this.getPendingTodayBookings();
    }

    // reservas de hoy
    if (
      this.hasAny(text, [
        'reservas de hoy',
        'reservas para hoy',
        'que reservas hay hoy',
        'hay reservas hoy',
        'bookings de hoy',
      ]) ||
      (this.hasAny(text, ['hoy']) &&
        this.hasAny(text, ['reserva', 'reservas', 'booking', 'bookings']))
    ) {
      return this.getTodayBookings();
    }

    // total personas hoy
    if (
      this.hasAny(text, [
        'cuantas personas hay hoy',
        'cuantas personas reservaron hoy',
        'cuantas personas tienen reserva hoy',
        'total de personas hoy',
      ])
    ) {
      return this.getTodayPeopleCount();
    }

    // reservas pendientes
    if (
      this.hasAny(text, [
        'reservas pendientes',
        'pendientes',
        'faltan por usar',
        'sin ingreso',
        'aun no usadas',
        'todavia no usadas',
      ]) &&
      this.hasAny(text, [
        'reserva',
        'reservas',
        'booking',
        'bookings',
        'pendiente',
        'pendientes',
      ])
    ) {
      return this.getPendingBookings();
    }

    // reservas usadas / check-in
    if (
      (this.hasAny(text, [
        'usadas',
        'usados',
        'con ingreso',
        'check in',
        'checkin',
        'ingreso registrado',
        'ya ingresaron',
      ]) &&
        this.hasAny(text, ['reserva', 'reservas', 'booking', 'bookings'])) ||
      this.hasAny(text, [
        'cuantas reservas usadas hay',
        'cuantas reservas con ingreso hay',
        'cuantas reservas ya ingresaron',
        'cuantas reservas ya registraron ingreso',
      ])
    ) {
      return this.getUsedBookings();
    }

    // total reservas
    if (
      this.hasAny(text, [
        'cuantas reservas hay',
        'cantidad de reservas',
        'total de reservas',
        'cuantas reservas existen',
        'numero de reservas',
        'cuantos bookings hay',
        'cuantas reservaciones hay',
      ]) ||
      (this.hasAny(text, ['cuantas', 'cantidad', 'total', 'numero']) &&
        this.hasAny(text, [
          'reserva',
          'reservas',
          'booking',
          'bookings',
          'reservaciones',
        ]))
    ) {
      return this.getTotalBookings();
    }

    // usuarios totales
    if (
      this.hasAny(text, [
        'cuantos usuarios hay',
        'cantidad de usuarios',
        'usuarios registrados',
        'total de usuarios',
        'cuanta gente hay registrada',
        'cuentas registradas',
        'cuantos trabajadores hay',
      ]) ||
      (this.hasAny(text, ['cuantos', 'cantidad', 'total']) &&
        this.hasAny(text, [
          'usuario',
          'usuarios',
          'gente registrada',
          'cuentas registradas',
        ]))
    ) {
      return this.getUsersCount();
    }

    // usuarios activos
    if (
      this.hasAny(text, [
        'usuarios activos',
        'cuantos usuarios activos hay',
        'cuantas cuentas activas hay',
        'cuantos usuarios estan activos',
      ])
    ) {
      return this.getActiveUsersCount();
    }

    // usuarios inactivos
    if (
      this.hasAny(text, [
        'usuarios inactivos',
        'cuantos usuarios inactivos hay',
        'cuantas cuentas inactivas hay',
      ])
    ) {
      return this.getInactiveUsersCount();
    }

    // reservas recientes
    if (
      this.hasAny(text, [
        'reservas recientes',
        'ultimas reservas',
        'reservas mas recientes',
        'muestrame las reservas recientes',
        'lista las reservas recientes',
        'ultimos bookings',
        'ultimas reservaciones',
      ]) ||
      (this.hasAny(text, ['recientes', 'ultimas', 'ultimos']) &&
        this.hasAny(text, [
          'reserva',
          'reservas',
          'booking',
          'bookings',
          'reservaciones',
        ]))
    ) {
      return this.getRecentBookings();
    }

    // total canchas
    if (
      this.hasAny(text, [
        'cuantas canchas hay',
        'cantidad de canchas',
        'total de canchas',
        'cuantas losas hay',
      ])
    ) {
      return this.getCourtsCount();
    }

    // cancha con más reservas
    if (
      this.hasAny(text, [
        'cancha con mas reservas',
        'que cancha tiene mas reservas',
        'cual cancha tiene mas reservas',
        'cancha mas reservada',
        'losa mas reservada',
        'que cancha se usa mas',
        'cual es la cancha mas usada',
        'que losa se usa mas',
      ]) ||
      ((this.hasAny(text, ['cancha', 'losa']) &&
        this.hasAny(text, ['mas reservada', 'mas usada'])) ||
        (this.hasAny(text, ['cancha', 'losa']) &&
          this.hasAll(text, ['mas', 'reservas'])))
    ) {
      return this.getMostBookedCourt();
    }

    return {
      answer:
        'Esa consulta está fuera del alcance actual de la demo. Prueba con preguntas sobre reservas, pendientes, ingresos, usuarios, reservas recientes, reservas de hoy, canchas o ayuda.',
    };
  }
}