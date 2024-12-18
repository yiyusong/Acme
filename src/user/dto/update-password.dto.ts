import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({
    message: '旧密码不能为空'
  })
  password: string;

  @IsString()
  @Length(6, 16, {
    message: '密码长度必须在6到16位之间'
  })
  @IsNotEmpty({
    message: '新密码不能为空'
  })
  newPassword: string;
}
