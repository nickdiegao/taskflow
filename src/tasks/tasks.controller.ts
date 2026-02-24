import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus, TaskPriority } from './task.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    @ApiOperation({ summary: 'Criar uma nova tarefa' })
    @ApiBody({
        schema: {
            example: {
                title: 'Estudar TDD',
                description: 'Aprender TDD na prática',
                priority: 'high',
                dueDate: '2026-12-31T23:59:59.000Z'
            },
        },
    })
    async create(
        @Body() dto: { title: string; description?: string; priority?: TaskPriority, dueDate: Date },
        @Request() req: any,
    ) {
        return this.tasksService.create(dto, req.user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as tarefas do sumário' })
    async findAll(@Request() req:any) {
        return this.tasksService.findAll(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar uma tarefa pelo ID' })
    async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.tasksService.findOne(id, req.user.id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar uma tarefa' })
    @ApiBody({
        schema: {
            example: {
                title: 'Estudar NestJS',
                priority: 'medium',
            },
        },
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: { title?: string; description?: string; priority?: TaskPriority; dueDate: Date },
        @Request() req: any
    ) {
        return this.tasksService.update(id, dto, req.user.id)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar uma nova tarefa' })
    async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.tasksService.remove(id, req.user.id)
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Atualizar o status de uma tarefa' })
    @ApiBody({
        schema: {
            example: {
                status: 'done',
            }
        }
    })
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: TaskStatus,
        @Request() req: any
    ) {
        return this.tasksService.updateStatus(id, status, req.user.id);
    }
}
