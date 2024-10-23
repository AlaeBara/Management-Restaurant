import { PrismaService } from '../../../prisma/prisma.service'; // Adjust path as necessary

export class BaseService<T> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: string,
  ) {}

  async findAll(conditions: Record<string, any> = {}) {
    return this.prisma[this.model].findMany({
      where: { deletedAt: null, ...conditions },
    });
  }

  async findOne(conditions: Record<string, any> = {}) {
    return this.prisma[this.model].findUnique({
      where: { ...conditions, deletedAt: null },
    });
  }

  async findFirst(conditions: Record<string, any> = {}) {
    return this.prisma[this.model].findFirst({
      where: { ...conditions, deletedAt: null },
    });
  }

  async softDelete(id: number) {
    return this.prisma[this.model].update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
