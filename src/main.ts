import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const frontendUrl = `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`;

  app.enableCors({
    origin: frontendUrl, // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies and credentials
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
    exposedHeaders: 'Content-Length, X-Kuma-Revision',
  });

  const config = new DocumentBuilder()
    .setTitle('JEI API')
    .setDescription('This the API for the JEI website')
    .setVersion('1.0')
    .addTag('cats')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      validationError: { target: false },
    }),
  );
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.APP_PORT);
}
bootstrap();
