import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { LoginDto } from './dto/login.dto';
import { CaptchaDto } from './dto/captcha.dto';
import { NoToken } from 'src/utils/decorators/login.decorator';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  @NoToken()
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.accountService.create(registerUserDto);
  }

  @Post('login')
  @NoToken()
  login(@Body() loginDto: LoginDto) {
    return this.accountService.login(loginDto);
  }

  @Post('captcha')
  @NoToken()
  captcha(@Body() captchaDto: CaptchaDto) {
    return this.accountService.captcha(captchaDto);
  }

  @Post('forget-password')
  @NoToken()
  forgetPassword(@Body() forgetPasswordDto: RegisterUserDto) {
    return this.accountService.forgetPassword(forgetPasswordDto);
  }
}
