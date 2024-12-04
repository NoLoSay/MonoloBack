/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// import * as fs from 'fs';

// const httpsOptions = {
//   key: fs.readFileSync('./secrets/cert.key'),
//   cert: fs.readFileSync('./secrets/cert.crt'),
// };

const options: NestApplicationOptions = {
  cors: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, options);

  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  });

  //app.useGlobalPipes(new ValidationPipe());
  const globalPrefix = '';
  // app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NoLoAPI')
    .setDescription('A NoLoSay API')
    .setVersion(process.env['API_VERSION'])
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: ${process.env['API_URL']}/${globalPrefix}`,
  );
}

bootstrap();
