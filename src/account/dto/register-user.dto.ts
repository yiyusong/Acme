import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class RegisterUserDto {
  @IsEmail(
    {},
    {
      message: '邮箱格式错误',
    },
  )
  email: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @Length(6, 16)
  password: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
