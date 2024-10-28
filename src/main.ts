import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { MasterSeeder } from './user-management/seeders/master.seeder';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create a new NestJS application instance using Fastify as the underlying HTTP server
  // This represents a change from the default Express platform to Fastify for improved performance
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  if (process.env.RUN_SEEDER === 'TRUE') {
    const seederService = app.get(MasterSeeder);
    await seederService.seedAll();
  }
  const config = new DocumentBuilder()
  .setTitle('Restaurant Management API')
  .setDescription('REST API for managing restaurant operations')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
