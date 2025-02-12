import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 设置全局前缀
  app.useGlobalInterceptors(new TransformInterceptor()); // 使用全局拦截器
  app.useGlobalFilters(new HttpExceptionFilter()); // 使用全局过滤器
  app.enableCors(); // 启用CORS
  await app.listen(process.env.PORT ?? 3005);
}

bootstrap();
