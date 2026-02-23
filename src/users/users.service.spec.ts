import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('Deve criar um usuário com senha criptografada', async () => {
      const dto = {
        name: 'Nicholas',
        email: 'nicholas@email.com',
        password: '123456',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockImplementation((data) => data);
      mockUserRepository.save.mockImplementation((data) =>
        Promise.resolve({ id: 1, ...data }),
      );

      const result = await service.create(dto);

      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(result.password).not.toBe('123456');
      expect(result.id).toBe(1);
    });

    it('Deve lançar erro se o email já existir', async () => {
      const dto = {
        name: 'Nicholas',
        email: 'nicholas@email.com',
        password: '123456',
      };

      mockUserRepository.findOne.mockResolvedValue({ id: 1, ...dto });

      await expect(service.create(dto)).rejects.toThrow('Email já cadastrado');
    });
  });

  describe('findByEmail', () => {
    it('Deve retornar um usuário pelo email', async () => {
      const user = { id: 1, email: 'nicholas@email.com', name: 'Nicholas' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('nicholas@email.com');

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nicholas@email.com' },
      });
    });

    it('Deve retornar null caso o usuário não exista', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('naoexiste@email.com');

      expect(result).toBeNull();
    });
  });
});
