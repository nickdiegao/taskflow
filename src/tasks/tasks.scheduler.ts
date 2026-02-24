import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task, TaskStatus } from "./task.entity";
import { LessThan, Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bull";
import type { Queue } from "bull";
import { User } from "src/users/user.entity";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class TasksScheduler {
    private readonly logger = new Logger(TasksScheduler.name);

    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectQueue('notifications')
        private readonly notificationsQueue: Queue
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async checkDueTasks() {
        this.logger.log('Verificando tarefas vencidas...');

        const overdueTasks = await this.tasksRepository.find({
            where: {
                dueDate: LessThan(new Date()),
                status: TaskStatus.PENDING,
                notified: false,
            },
        });

        for (const task of overdueTasks) {
            const user = await this.usersRepository.findOne({
                where: { id: task.userId },
            });

            if (user) {
                await this.notificationsQueue.add('task-due', {
                    taskTitle: task.title,
                    userEmail: user.email,
                });

                task.notified = true;
                await this.tasksRepository.save(task);

                this.logger.log(`Job adicionado na fila para tarefa: ${task.title}`)
            }
        }
    }
}