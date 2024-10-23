import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  // Create a new NestJS application instance using Fastify as the underlying HTTP server
  // This represents a change from the default Express platform to Fastify for improved performance
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Apply the GlobalExceptionFilter to handle all exceptions globally
  // This filter will catch and format any unhandled exceptions in the application
  // The HttpAdapterHost is injected to allow the filter to access the underlying HTTP server
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(HttpAdapterHost)));
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
