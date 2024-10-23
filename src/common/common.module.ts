import { Global, Module } from '@nestjs/common';
import { IsUniqueConstraint } from './decorators/is-unique-constraint.decorator';
import { AuthGuard } from './auth/auth.guard';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [IsUniqueConstraint,AuthGuard],
  exports: [IsUniqueConstraint,AuthGuard],
})
export class CommonModule {}
