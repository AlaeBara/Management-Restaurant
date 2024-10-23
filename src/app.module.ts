import { Module } from '@nestjs/common';
import { UserManagementModule } from './user-management/user-management.module';
import { PrismaModule } from 'prisma/prisma.module';
import { CommonModule } from './common/common.module';
@Module({
  imports: [UserManagementModule,PrismaModule,CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
