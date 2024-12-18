import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { NumberUtils } from 'src/utils/NumberUtils';

@Injectable()
export class GoodsService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  async getGoodsList(page: number, pageSize: number, categoryId?: number, sort?: string, name?: string, orderBy?: string) {
    const where: Prisma.GoodsWhereInput = {
      status: 1
    };
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (name) {
      where.name = name;
    }
    const [count, goods] = await this.prismaService.$transaction([
      this.prismaService.goods.count({
        where,
      }),
      this.prismaService.goods.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [orderBy]: sort,
        },
        select: {
          goodsId: true,
          name: true,
          mainImage: true,
          price: true,
          originalPrice: true,
          stock: true,
          sales: true,
          isHot: true,
          isNew: true,
        }
      })
    ])
    return {
      pages: Math.ceil(count / pageSize),
      data: goods,
    };
  }

  async getGoodsDetail(id: number) {
    const goods = await this.prismaService.goods.findUnique({
      where: {
        goodsId: id,
        status: 1,
      },
      include: {
        skus: true,
        attributes: {
          include: {
            values: true,
          },
        },
      },
    })
    if (!goods) {
      throw new NotFoundException('商品不存在');
    }
    return goods;
  }

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    const { goods, addressId, remark, couponId } = createOrderDto;
    //订单商品列表
    const goodsList = await this.prismaService.goods.findMany({
      where: {
        goodsId: {
          in: goods.map(item => item.goodsId),
        },
      },
    });
    //订单商品SKU列表
    const skuIds = goods.map(item => item.skuId);
    const skus = await this.prismaService.sku.findMany({
      where: {
        skuId: {
          in: skuIds,
        },
      },
    });
    if (skus.length !== skuIds.length || goodsList.length !== goods.length) {
      throw new NotFoundException('商品不存在');
    }
    //收货地址
    const address = await this.prismaService.shippingAddress.findUnique({
      where: {
        id: addressId,
      },
    })
    if (!address) {
      throw new NotFoundException('地址不存在');
    }
    //订单总价
    const totalPrice = goodsList.reduce((total, item) => {
      const number = goods.find(g => g.goodsId === item.goodsId)?.number;
      return NumberUtils.multiply(item.price, number).add(total).toFixed(2);
    }, '0');
    console.log('totalPrice', totalPrice);
    //订单ID
    const orderId = Date.now().toString() + Math.random().toString().substring(2, 8);
    try {
      await this.prismaService.goodsOrder.create({
        data: {
          orderId,
          userId,
          totalPrice: totalPrice,
          shippingName: address.name,
          shippingPhone: address.phone,
          shippingAddress: address.address,
          shippingProvince: address.province,
          shippingCity: address.city,
          shippingArea: address.area,
          remark,
          couponId,
          goodsInfo: {
            create: goods.map(item => ({
              goodsId: item.goodsId,
              number: item.number,
              skuId: item.skuId,
              userId,
              totalPrice: NumberUtils.multiply(skus.find(sku => sku.skuId === item.skuId)!.price, item.number),
              goodsName: goodsList.find(goods => goods.goodsId === item.goodsId)?.name,
              goodsImage: goodsList.find(goods => goods.goodsId === item.goodsId)?.mainImage,
              originalPrice: skus.find(sku => sku.skuId === item.skuId)?.originalPrice,
              price: skus.find(sku => sku.skuId === item.skuId)?.price,
              properties: skus.find(sku => sku.skuId === item.skuId)?.properties,
            })),
          },
        },
      });
      return orderId;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('创建订单失败');
    }
  }

  async addGoods() {
    await this.prismaService.goods.create({
      data: {
        name: '测试商品',
        price: 100,
        originalPrice: 100,
        categoryId: 1,
        mainImage: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
        images: ['https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'],
        detailImage: ['https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'],
        description: '测试商品描述',
        status: 1,
        isHot: false,
        isNew: true,
        sales: 1,
        stock: 100,
        attributes: {
          create: [
            {
              title: '颜色',
              values: {
                createMany: {
                  data: [
                    { value: '红色' },
                    { value: '蓝色' },
                    { value: '绿色' }
                  ]
                }
              }
            },
            {
              title: '尺寸',
              values: {
                createMany: {
                  data: [
                    { value: 'S' },
                    { value: 'M' },
                    { value: 'L' },
                    { value: 'XL' },
                    { value: 'XXL' }
                  ]
                }
              }
            }
          ],
        },
        skus: {
          create: [
            {
              price: 100,
              originalPrice: 100,
              stock: 100,
              name: '红色S',
              properties: [
                { name: '颜色', value: '红色' },
                { name: '尺寸', value: 'S' },
              ]
            },
            {
              price: 100,
              originalPrice: 100,
              stock: 100,
              name: '红色M',
              properties: [{ name: '颜色', value: '红色' }, { name: '尺寸', value: 'M' }],
            },
            {
              price: 100,
              originalPrice: 100,
              stock: 100,
              name: '蓝色M',
              properties: [{ name: '颜色', value: '蓝色' }, { name: '尺寸', value: 'M' }],
            },
            {
              price: 100,
              originalPrice: 100,
              stock: 100,
              name: '蓝色XL',
              properties: [{ name: '颜色', value: '蓝色' }, { name: '尺寸', value: 'XL' }],
            },
            {
              price: 100,
              originalPrice: 100,
              stock: 100,
              name: '绿色S',
              properties: [{ name: '颜色', value: '绿色' }, { name: '尺寸', value: 'S' }],
            },
          ],
        },
      },
    });
  }
}
