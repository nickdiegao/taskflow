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

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    async create(
        @Body() dto: { title: string; description?: string; priority?: TaskPriority, dueDate: Date },
        @Request() req: any,
    ) {
        return this.tasksService.create(dto, req.user.id);
    }

    @Get()
    async findAll(@Request() req:any) {
        return this.tasksService.findAll(req.user.id);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.tasksService.findOne(id, req.user.id);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: { title?: string; description?: string; priority?: TaskPriority; dueDate: Date },
        @Request() req: any
    ) {
        return this.tasksService.update(id, dto, req.user.id)
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.tasksService.remove(id, req.user.id)
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: TaskStatus,
        @Request() req: any
    ) {
        return this.tasksService.updateStatus(id, status, req.user.id);
    }
}
