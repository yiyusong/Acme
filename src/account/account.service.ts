import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { md5 } from 'src/utils/md5';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CaptchaDto } from './dto/captcha.dto';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { UserInfoVo } from './vo/userInfo.vo';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(RedisService)
  private readonly redis: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async create(registerUser: RegisterUserDto) {
    const { email, password, captcha } = registerUser;
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (foundUser) {
      throw new BadRequestException('用户已存在');
    }
    const captchaKey = `captcha:${email}:register`;
    const isEqual = await this.redis.equal(captchaKey, captcha);
    if (!isEqual) {
      throw new BadRequestException('验证码错误');
    }
    await this.redis.del(captchaKey);
    const hashedPassword = md5(password);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          nickname: email,
        },
      });
      return newUser;
    } catch (error) {
      throw new BadRequestException('注册失败');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!foundUser) {
      throw new BadRequestException('用户不存在');
    }
    const hashedPassword = md5(password);
    if (foundUser.password !== hashedPassword) {
      throw new BadRequestException('密码错误');
    }
    const userInfo = new UserInfoVo();
    userInfo.id = foundUser.id;
    userInfo.email = foundUser.email;
    userInfo.nickname = foundUser.nickname;
    userInfo.avatar = foundUser.avatar;
    userInfo.gender = foundUser.gender;
    userInfo.bio = foundUser.bio;
    userInfo.birthday = foundUser.birthday;
    userInfo.createdAt = foundUser.createdAt;
    userInfo.phone = foundUser.phone;
    userInfo.status = foundUser.status;
    userInfo.level = foundUser.level;

    const refresh_token = this.jwtService.sign({
      id: foundUser.id,
      email: foundUser.email,
    }, {expiresIn: this.configService.get('jwt_refresh_token_expires_in')});
  
    const access_token = this.jwtService.sign({
      id: foundUser.id,
      email: foundUser.email,
      nickname: foundUser.nickname,
      phone: foundUser.phone,
      level: foundUser.level,
      status: foundUser.status,
    }, {expiresIn: this.configService.get('jwt_access_token_expires_in')});

    return {
      user: userInfo,
      refresh_token,
      access_token,
    };
  }

  async captcha(captchaDto: CaptchaDto) {
    const { email, type } = captchaDto;
    const captchaKey = `captcha:${email}:${type}`;
    const captchaValue = Math.random().toString().slice(2, 8);
    try {
      await this.redis.set(captchaKey, captchaValue, 60 * 10);
      await this.emailService.sendEmail({
        to: email,
        subject: type === 'register' ? '注册-ACME' : '忘记密码-ACME',
        html: `您的验证码是：<b>${captchaValue}</b>，有效期10分钟`,
      });
    } catch (error) {
      throw new BadRequestException('获取验证码失败');
    }
    return '发送成功';
  }

  async forgetPassword(forgetPasswordDto: RegisterUserDto) {
    const { email, password, captcha } = forgetPasswordDto;
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!foundUser) {
      throw new BadRequestException('用户不存在');
    }
    const captchaKey = `captcha:${email}:forget-password`;
    const isEqual = await this.redis.equal(captchaKey, captcha);
    if (!isEqual) {
      throw new BadRequestException('验证码错误');
    }
    await this.redis.del(captchaKey);
    const hashedPassword = md5(password);
    try {
      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      });
      return '修改成功';
    } catch (error) {
      throw new BadRequestException('修改失败');
    }
  }
}

