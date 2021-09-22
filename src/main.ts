import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
    const logger = new Logger();
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.listen(3000);
    const port = configService.get('PORT');
    logger.log(`Application listening on port ${port}`);
}
bootstrap();
