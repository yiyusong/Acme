import { IsIn, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: '昵称格式错误'
  })
  nickname?: string;

  @IsOptional()
  @IsString({
    message: '头像格式错误'
  })
  avatar?: string;

  @IsOptional()
  @IsString({
    message: '个性签名格式错误'
  })
  bio?: string;

  @IsOptional()
  @IsString({
    message: '性别格式错误'
  })
  gender?: string;

  @IsOptional()
  @IsIn(['man', 'woman', 'secret'], {
    message: '性别只能是man、woman或secret'
  })
  birthday?: string;

  @IsOptional()
  @IsString({
    message: '手机号码格式错误'
  })
  phone?: string;
}


