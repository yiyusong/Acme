import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  @Inject(PrismaService) 
  private readonly prisma: PrismaService;

  findAll(userId: number, page: number, size: number, type: string, name?: string) {
    const where: Prisma.GoodsOrderWhereInput = {
      userId,
    };
    if (type !== 'all') {
      where.status = 1;
    }
    if (name) {
      where.goodsInfo.some.goodsName = {
        contains: name,
      };
    }
    return this.prisma.goodsOrder.findMany({
      where,
      skip: (page - 1) * size,
      take: size,
      include: {
        goodsInfo: true,
      },
    });
  }
}
