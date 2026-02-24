import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';


interface CreateTaskDto {
    title: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: Date;
}

interface UpdateTaskDto {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: Date;
}
@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async create(dto: CreateTaskDto, userId: number): Promise<Task> {
        const task = this.tasksRepository.create({...dto, userId});
        return this.tasksRepository.save(task);
    }

    async findAll(userId: number): Promise<Task[]> {
        return this.tasksRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: number, userId: number): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id, userId }
        });

        if (!task) {
            throw new NotFoundException(`Tarefa #${id} não encontrada`)
        };

        return task;
    }

    async update(id: number, dto: UpdateTaskDto, userId: number): Promise<Task> {
        const task = await this.findOne(id, userId);
        Object.assign(task, dto);
        return this.tasksRepository.save(task);
    }

    async remove(id: number, userId: number): Promise<void>{
        const task = await this.findOne(id, userId);
        await this.tasksRepository.remove(task);
    }

    async updateStatus(id: number, status: TaskStatus, userId: number): Promise<Task> {
        const task = await this.findOne(id, userId);
        task.status = status;
        return this.tasksRepository.save(task);
    }
}
