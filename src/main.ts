import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './config/logger/logger.middleware';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { WinstonLogger } from './config/logger/winston.logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new LoggerMiddleware().use);

  const configService = app.get(ConfigService);
  const port = +configService.get('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Enables class-transformer to convert payloads
      stopAtFirstError: true, // Stops validation on the first error
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Nest Prac')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/json',
  });

  app
    .listen(port)
    .then(() => {
      // customer logger added after running the server successfully
      app.useLogger(app.get(WinstonLogger));
      logger.log(`Server running on http://localhost:${port}\n`);
    })
    .catch((error) => logger.error(`Server is not running: `, error.stack));
}
bootstrap();
