import { IsEmail, IsIn, IsOptional } from "class-validator";

export class CaptchaDto {
  @IsOptional()
  @IsEmail({},{
    message: '邮箱格式错误'
  })
  email: string;

  @IsIn(['register', 'forget-password'], {
    message: '类型只能是register或forget-password'
  })
  type: string;
}
