import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task, TaskPriority, TaskStatus } from './task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
}

const mockTask = {
  id: 1,
  title: 'Estudar TDD',
  description: 'Aprender TDD na prática',
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  dueDate: new Date('2026-12-31'),
  userId: 1,
  notified: false,
}

describe('TaskService', () => {
  let service = TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('Deve criar uma tarefa para o usuário autenticado', async () => {
      const dto = {
        title: 'Estudar TDD',
        description: 'Aprender TDD na prática',
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-12-31'),
      };

      mockTaskRepository.create.mockReturnValue({...dto, userId: 1});
      mockTaskRepository.save.mockResolvedValue({id: 1, ...dto, userId: 1});

      const result = await service.create(dto, 1);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({...dto, userId: 1});
      expect(mockTaskRepository.save).toHaveBeenCalledTimes(1);
      expect(result.userId).toBe(1);
    });
  });

  describe('findAll', () => {
    it('Deve retornar todas as tarefas do usuário', async () => {
      mockTaskRepository.find.mockResolvedValue([mockTask]);

      const result = await service.findAll(1);

      expect(result).toHaveLength(1);
      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('Deve retornar uma tarefa pelo ID', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(1, 1);

      expect(result).toEqual(mockTask);
    });

    it('Deve lançar NotFoundException se a tarefa não existir', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(99, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('Deve atualizar uma tarefa', async () => {
      const updated = { ...mockTask, title: 'Estudar NestJS' }

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(updated);

      const result = await service.update(1, { title: 'Estudar NestJS' }, 1);

      expect(result.title).toBe('Estudar NestJS');
    });
  });

  describe('remove', () => {
    it('Deve remover uma tarefa', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.remove.mockResolvedValue(mockTask);

      await service.remove(1, 1);

      expect(mockTaskRepository.remove).toHaveBeenCalledWith(mockTask)
    });
  });

  describe('updateStatus', () => {
    it('Deve atualizar o status de uma tarefa', async () => {
      const updated = { ...mockTask, status: TaskStatus.DONE };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(updated);

      const result = await service.updateStatus(1, TaskStatus.DONE, 1)

      expect(result.status).toBe(TaskStatus.DONE)
    })
  })
})