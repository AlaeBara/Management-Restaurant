import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MasterSeeder } from './common/seeders/master.seeder';
import helmet from 'helmet';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  // Create a new NestJS application instance using Fastify as the underlying HTTP server
  // This represents a change from the default Express platform to Fastify for improved performance
  /*  const app = await NestFactory.create<NestFastifyApplication>(
     AppModule,
     new FastifyAdapter(),
   ); */

  // Use the default NestJS application instance

  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Important: Configure static file serving
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: process.env.STATIC_ASSETS_PREFIX || '/local',   // This matches your URL path
    index: false,         // Disable directory listing
  });

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
  app.use(helmet());

  // Configure CORS to allow requests from frontend URL
  app.enableCors({
    origin: [process.env.FRONTEND_URL, process.env.CLIENT_URL], // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  });

  // Start the server
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
