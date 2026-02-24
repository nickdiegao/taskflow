import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TaskPriority, TaskStatus } from './task.entity';
import { TasksService } from './tasks.service';

const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateStatus: jest.fn(),
};

const mockUser = { id: 1, email: 'nicholas@email.com' };

const mockTask = {
  id: 1,
  title: 'Estudar TDD',
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  userId: 1
};

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('Deve criar uma tarefa para o usuário autenticado', async () => {
      const dto = { title: 'Estudar TDD', priority: TaskPriority.HIGH };
      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(dto, { user: mockUser })
      
      expect(mockTasksService.create).toHaveBeenCalledWith(dto, mockUser.id);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('Deve retornar todas as tarefas do usuário', async () => {
      mockTasksService.findAll.mockResolvedValue([mockTask]);

      const result = await controller.findAll({user: mockUser});

      expect(mockTasksService.findAll).toHaveBeenCalledWith(mockUser.id);
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('Deve retornar uma tarefa pelo id', async () => {
      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne(1, { user:mockUser })

      expect(mockTasksService.findOne).toHaveBeenCalledWith(1, mockUser.id);
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('Deve atualizar uma tarefa', async () => {
      const dto = { title: 'Estudar NestJS' };
      const updated = { ...mockTask, ...dto };
      mockTasksService.update.mockResolvedValue(updated);

      const result = await controller.update(1, dto, { user: mockUser });

      expect(mockTasksService.update).toHaveBeenCalledWith(1, dto, mockUser.id);
      expect(result.title).toBe('Estudar NestJS');
    });
  });

  describe('remove', () => {
    it('Deve remover uma tarefa', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      await controller.remove(1, { user: mockUser });

      expect(mockTasksService.remove).toHaveBeenCalledWith(1, mockUser.id);
    });
  });

  describe('updatedStatus', () => {
    it('Deve atualizar o status de uma tarefa', async () => {
      const updated = { ...mockTask, status: TaskStatus.DONE };
      mockTasksService.updateStatus.mockResolvedValue(updated);

      const result = await controller.updateStatus(1, TaskStatus.DONE, { user: mockUser });

      expect(mockTasksService.updateStatus).toHaveBeenCalledWith(1, TaskStatus.DONE, mockUser.id);
      expect(result.status).toBe(TaskStatus.DONE);
    })
  })
})