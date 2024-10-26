import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { MasterSeeder } from './user-management/seeders/master.seeder';
import { Constants } from './common/constants/contanst';


async function bootstrap() {
  // Create a new NestJS application instance using Fastify as the underlying HTTP server
  // This represents a change from the default Express platform to Fastify for improved performance
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  if (Constants.RUN_SEEDER === true) {
    const seederService = app.get(MasterSeeder);
    await seederService.seedAll();
  }
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
