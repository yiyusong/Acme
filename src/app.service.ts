import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  @Inject()
  private configService: ConfigService;

  getHello(): string {
    console.log(this.configService.get('WINSTON_LOG_LEVEL'));
    return 'Hello World!';
  }
}
