export class CreateOrderDto {
  goods: {
    goodsId: number;
    skuId: number;
    number: number;
  }[];
  addressId: number;
  remark: string;
  couponId: number;
}
