import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ReqUser } from 'src/utils/decorators/req-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  getUserInfo(@ReqUser('id') id: number) {
    return this.userService.getUserInfo(id);
  }

  @Patch('info')
  updateUserInfo(@ReqUser('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserInfo(id, updateUserDto);
  }

  @Post('modify-password')
  updatePassword(@ReqUser('id') id: number, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Get('address')
  getShippingAddress(@ReqUser('id') id: number) {
    return this.userService.getShippingAddress(id);
  }

  @Put('address')
  createShippingAddress(@ReqUser('id') id: number, @Body() createShippingAddressDto: CreateShippingAddressDto) {
    return this.userService.createShippingAddress(id, createShippingAddressDto);
  }
}
