import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';

@Module({
  imports: [AiModule],
  controllers: [PracticeController],
  providers: [PracticeService],
  exports: [PracticeService]
})
export class PracticeModule {}
