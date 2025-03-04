/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  });

  const globalPrefix = '';
  // app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3002;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NoLoVideo')
    .setDescription('A NoLoSay API')
    .setVersion(process.env['API_VERSION'])
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: ${process.env['VIDEO_API_URL']}/${globalPrefix}`,
  );
}

bootstrap();
