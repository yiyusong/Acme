import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ReqUser } from 'src/utils/decorators/req-user.decorator';
import { generateParseIntPipe } from 'src/utils/generate-parse-int-pipe';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}


  @Get('list')
  findAll(
    @ReqUser('id') id: number,
    @Query('page', new DefaultValuePipe(1), generateParseIntPipe('page')) page: number,
    @Query('size', new DefaultValuePipe(1), generateParseIntPipe('size')) size: number,
    @Query('type', new DefaultValuePipe('all')) type: string,
    @Query('name') name?: string,
  ) {
    return this.orderService.findAll(id, page, size, type, name);
  }
}
