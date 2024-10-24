import { Global, Module } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class CommonModule {}
