import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfoVo } from 'src/account/vo/userInfo.vo';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { md5 } from 'src/utils/md5';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async getUserInfo(id: number) {
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    if (!foundUser) {
      throw new NotFoundException('用户不存在');
    }
    const userInfo = new UserInfoVo();
    userInfo.id = foundUser.id;
    userInfo.nickname = foundUser.nickname;
    userInfo.email = foundUser.email;
    userInfo.level = foundUser.level;
    userInfo.status = foundUser.status;
    userInfo.avatar = foundUser.avatar;
    userInfo.createdAt = foundUser.createdAt;
    return userInfo;
  }

  async updateUserInfo(id: number, updateUserDto: UpdateUserDto) {
    const { nickname, avatar, bio, gender, birthday, phone } = updateUserDto;
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    if (!foundUser) {
      throw new NotFoundException('用户不存在');
    }
    if (nickname) {
      foundUser.nickname = nickname;
    }
    if (avatar) {
      foundUser.avatar = avatar;
    }
    if (bio) {
      foundUser.bio = bio;
    }
    if (gender) {
      foundUser.gender = gender;
    }
    if (birthday) {
      foundUser.birthday = new Date(birthday);
    }
    if (phone) {
      foundUser.phone = phone;
    }
    try {
      const updatedUser = await this.prisma.user.update({ where: { id }, data: foundUser });
      return updatedUser;
    } catch (error) {
      throw new BadRequestException('更新失败');
    }
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const { password, newPassword } = updatePasswordDto;
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    if (!foundUser) {
      throw new NotFoundException('用户不存在');
    }
    const hashedPassword = md5(password);
    if (foundUser.password !== hashedPassword) {
      throw new BadRequestException('密码错误');
    }
    try {
      await this.prisma.user.update({ where: { id }, data: { password: md5(newPassword) } });
      return '修改成功';
    } catch (error) {
      throw new BadRequestException('修改失败');
    }
  }

  async getShippingAddress(id: number) {
    const foundShippingAddress = await this.prisma.shippingAddress.findMany({
      where: {
        userId: id,
        status: {
          not: 3
        }
      }
    });
    return foundShippingAddress;
  }

  async createShippingAddress(id: number, createShippingAddressDto: CreateShippingAddressDto) {
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    if (!foundUser) {
      throw new NotFoundException('用户不存在');
    }
    const addressCount = await this.prisma.shippingAddress.count({ where: { userId: id, status: { not: 3 } } });
    const { name, phone, address, province, city, area, tag, isDefault } = createShippingAddressDto;
    try {
      await this.prisma.shippingAddress.create({
        data: {
          userId: id,
          name,
          phone,
          address,
          province,
          city,
          area,
          tag,
          isDefault: addressCount === 0 ? true : isDefault,
        }
      })
      return '创建成功';
    } catch (error) {
      throw new BadRequestException('创建失败');
    }
  }

  async updateShippingAddress(userId: number, updateShippingAddressDto: UpdateShippingAddressDto) {
    const { name, phone, address, province, city, area, tag, isDefault, id, status } = updateShippingAddressDto;
    const foundShippingAddress = await this.prisma.shippingAddress.findUnique({ where: { id } });
    if (!foundShippingAddress) {
      throw new NotFoundException('收货地址不存在');
    }
    const originalIsDefault = foundShippingAddress.isDefault;
    if (foundShippingAddress.userId !== userId) {
      throw new BadRequestException('无权限');
    }
    if (status) {
      foundShippingAddress.status = status;
    }
    if (name) {
      foundShippingAddress.name = name;
    }
    if (phone) {
      foundShippingAddress.phone = phone;
    }
    if (address) {
      foundShippingAddress.address = address;
    }
    if (province) {
      foundShippingAddress.province = province;
    }
    if (city) {
      foundShippingAddress.city = city;
    }
    if (area) {
      foundShippingAddress.area = area;
    }
    if (tag) {
      foundShippingAddress.tag = tag;
    }
    if (isDefault) {
      foundShippingAddress.isDefault = status === 3 ? false : isDefault;
    }
    try {
      await this.prisma.shippingAddress.update({ where: { id }, data: foundShippingAddress });
      // 如果原来不是默认地址，现在要设置为默认地址，则将其他默认地址设置为非默认
      if (!originalIsDefault && isDefault) {
        await this.prisma.shippingAddress.updateMany({
          where: {
            userId,
            isDefault: true,
            id: { not: id }
          },
          data: { isDefault: false }
        });
      }
      // 如果原来是默认地址，现在要设置为非默认地址或者删除地址，则设置第一个地址为默认地址
      if (originalIsDefault && (!isDefault || status === 3)) {
        const firstAddress = await this.prisma.shippingAddress.findFirst({
          where: {
            userId,
            status: { not: 3 },
            isDefault: false,
            id: { not: id }
          },
          orderBy: { id: 'asc' }
        });
        if (firstAddress) {
          await this.prisma.shippingAddress.update({ where: { id: firstAddress.id }, data: { isDefault: true } });
        } else {
          throw new BadRequestException('必须存在一个默认地址');
        }
      }
      return '更新成功';
    } catch (error) {
      throw new BadRequestException('更新失败');
    }
  }
}
