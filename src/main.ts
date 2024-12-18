import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { FormatResponseInterceptor } from './utils/interceptors/format-response.interceptor';
import { CustomExceptionFilter } from './utils/filters/custom-exception.filter';
import { InvokeRecordInterceptor } from './utils/interceptors/invoke-record.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { UnLoginFilter } from './utils/filters/unLogin.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new UnLoginFilter());
  await app.listen(3000);
}
bootstrap();
