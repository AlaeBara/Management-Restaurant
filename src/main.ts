import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from '@fastify/cors';
import { ValidationPipe } from '@nestjs/common';
import helmet from '@fastify/helmet';
import { MasterSeeder } from './common/seeders/master.seeder';

async function bootstrap() {
  // Create a new NestJS application instance using Fastify as the underlying HTTP server
  // This represents a change from the default Express platform to Fastify for improved performance
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Run database seeders if RUN_SEEDER environment variable is set to TRUE
  if (process.env.RUN_SEEDER === 'TRUE') {
    const seederService = app.get(MasterSeeder);
    await seederService.seedAll();
  }

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Restaurant Management API') // Set API title
    .setDescription('REST API for managing restaurant operations') // Set API description
    .setVersion('1.0') // Set API version
    .addBearerAuth() // Add bearer token authentication
    .build();

  // Create Swagger documentation
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  // Setup Swagger UI at /api path
  SwaggerModule.setup('api', app, documentFactory);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable helmet middleware
  await app.register(helmet, {
    global: true,
    //contentSecurityPolicy: false,
  });

  // Configure CORS to allow requests from frontend URL
  await app.register(cors, {
    origin: process.env.FRONTEND_URL, // Allow requests from frontend URL specified in env
    credentials: true, // Allow credentials (cookies, auth headers etc)
  });

  // Start the server
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
