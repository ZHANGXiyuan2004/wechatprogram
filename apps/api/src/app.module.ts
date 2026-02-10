import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { ManagerModule } from './manager/manager.module';
import { PracticeModule } from './practice/practice.module';
import { RetentionModule } from './retention/retention.module';
import { InMemoryStoreModule } from './store/store.module';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    InMemoryStoreModule,
    AiModule,
    AuthModule,
    PracticeModule,
    ManagerModule,
    AdminModule,
    DataModule,
    SyncModule,
    RetentionModule
  ]
})
export class AppModule {}
