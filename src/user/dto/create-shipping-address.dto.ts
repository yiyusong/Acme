import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingAddressDto {
  @IsString()
  @IsNotEmpty({
    message: '收货人姓名不能为空'
  })
  name: string;

  @IsString()
  @IsNotEmpty({
    message: '手机号码不能为空'
  })
  phone: string;

  @IsString()
  @IsNotEmpty({
    message: '收货地址不能为空'
  })
  address: string;

  @IsString()
  @IsNotEmpty({
    message: '省不能为空'
  })
  province: string;

  @IsString()
  @IsNotEmpty({
    message: '市不能为空'
  })
  city: string;

  @IsString()
  @IsNotEmpty({
    message: '区县不能为空'
  })
  area: string;

  @IsBoolean()
  isDefault: boolean;

  @IsString()
  @IsOptional()
  tag: string;
}