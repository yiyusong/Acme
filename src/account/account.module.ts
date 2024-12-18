import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './login.strategy';
import { LoginGuard } from './login.guard';

@Module({
  imports: [PrismaModule],
  controllers: [AccountController],
  providers: [AccountService,
    JwtStrategy,
    {
      provide: 'APP_GUARD',
      useClass: LoginGuard,
    }
  ],
})
export class AccountModule { }
