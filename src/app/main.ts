import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '../domain/logger/logger.service';

async function bootstrap() {
  const logger: Logger = new Logger();
  await NestFactory.create(AppModule, {
    logger
  });
}
bootstrap();
