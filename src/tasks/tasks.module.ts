import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TaskssProcessor } from './task.processor';
import { TasksScheduler } from './tasks.scheduler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]), 
    AuthModule,
    BullModule.registerQueue({ name: 'notifications' }),
    ScheduleModule.forRoot(),
  ],
  providers: [TasksService, TaskssProcessor, TasksScheduler],
  controllers: [TasksController],
  exports: [TasksService]
})
export class TasksModule {}
