import { Body, Controller, DefaultValuePipe, Get, Post, Query } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { generateParseIntPipe } from 'src/utils/generate-parse-int-pipe';
import { NoToken } from 'src/utils/decorators/login.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReqUser } from 'src/utils/decorators/req-user.decorator';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get('list')
  async getGoodsList(
    @Query('page', new DefaultValuePipe(1), generateParseIntPipe('page')) page: number,
    @Query('size', new DefaultValuePipe(20), generateParseIntPipe('size')) pageSize: number,
    @Query('cate') categoryId: number,
    @Query('sort', new DefaultValuePipe('desc')) sort: string,
    @Query('orderBy', new DefaultValuePipe('createdAt')) orderBy: string,
    @Query('name') name: string,
  ) {
    return this.goodsService.getGoodsList(page, pageSize, categoryId, sort, name, orderBy);
  }

  @Get('detail')
  @NoToken()
  async getGoodsDetail(@Query('goodsId', generateParseIntPipe('goodsId')) goodsId: number) {
    return this.goodsService.getGoodsDetail(goodsId);
  }

  @Get('add')
  @NoToken()
  async addGoods() {
    return this.goodsService.addGoods();
  }

  @Post('checkout')
  async checkout(@ReqUser('id') id: number, @Body() createOrderDto: CreateOrderDto) {
    return this.goodsService.createOrder(id, createOrderDto);
  }
}
