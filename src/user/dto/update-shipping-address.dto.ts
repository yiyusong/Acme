import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateShippingAddressDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  province: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  area: string;

  @IsString()
  @IsOptional()
  tag: string;

  @IsBoolean()
  @IsOptional()
  isDefault: boolean;

  @IsIn([1, 2, 3])
  @IsOptional()
  status: number;
}
